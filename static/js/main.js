import {htmlToElement, secondsToTimecode} from './util.js'
import {playHTML, pauseHTML, volHTML, muteHTML, configHTML, fsHTML}  from './icons.js'
import {ValidationError} from './error.js'


function PlayerUI(element, configOptions) {
  // if (typeof configOptions !== Object) {
  //   // throw new ValidationError('Configuration is not an object')
  //   console.log('no object')
  // }
  
  if (configOptions.source.includes('.m3u8')) {
    console.log('yes')
  } else {
    console.log('no')
  }

  let playerWrapper = document.createElement('div')
  let controlsWrapper = document.createElement('div')
  
  let videoElem = document.createElement('video')
  const hls = new Hls()

  let volumeContainer = document.createElement('div')
  let volumeButton = document.createElement('button')
  let volumeSlider = document.createElement('input')
  let volumeSVG = htmlToElement(volHTML)
  let muteSVG = htmlToElement(muteHTML)
  
  let playButton = document.createElement('button')
  let playSVG = htmlToElement(playHTML)
  let pauseSVG = htmlToElement(pauseHTML)

  let configButton = document.createElement('button')
  let configSVG = htmlToElement(configHTML)
  let wrapperElem = document.createElement('div')


  let fsSVG = htmlToElement(fsHTML)
  let fsButton = document.createElement('button')

  let progressWrapper = document.createElement('div')
  let progressBar = document.createElement('input')
  let presentTimeLabel = document.createElement('div')
  let durationTimeLabel = document.createElement('div')

  let loadingState = document.createElement('div')
  let loadingWrapper = document.createElement('div')

  let config = []

  function createCoreUi () {
    playerWrapper.className = 'wrapper'
    element.appendChild(playerWrapper)
    videoElem.className = 'video'
    controlsWrapper.classList.add('controls-wrapper')
    playerWrapper.appendChild(videoElem)
    playerWrapper.appendChild(controlsWrapper)
  }

  function createPlayUi () {
    playButton.className = 'vp-play-button'
    playButton.appendChild(playSVG)
    controlsWrapper.appendChild(playButton)
  }

  function createProgressUi(){
    progressBar.setAttribute('min', 0)
    progressBar.setAttribute('max', 1)
    progressBar.setAttribute('value', 0)
    progressBar.setAttribute('step', 0.001)
    progressBar.setAttribute('type', 'range')
    progressBar.className = 'progress-slider'
    progressWrapper.appendChild(progressBar)
    controlsWrapper.appendChild(progressWrapper)
    controlsWrapper.appendChild(presentTimeLabel)
    controlsWrapper.appendChild(durationTimeLabel)
  }

  function createVolumeUi () {
    volumeButton.className = 'vp-volume-button'
    volumeSlider.className = 'slider'
    volumeSlider.setAttribute('min', 0)
    volumeSlider.setAttribute('max', 1)
    volumeSlider.setAttribute('value', videoElem.volume)
    volumeSlider.setAttribute('step', 0.1)
    volumeSlider.setAttribute('type', 'range')

    volumeContainer.setAttribute('id', 'volumeContainer')

    controlsWrapper.appendChild(volumeContainer)
    volumeContainer.appendChild(volumeSlider)
    volumeButton.appendChild(volumeSVG)
    volumeContainer.appendChild(volumeButton)
  }


  function createFullscreenUi() {
    fsButton.className = 'vp-fs-button'
    fsButton.appendChild(fsSVG)
    controlsWrapper.appendChild(fsButton)
  }

  function createConfigUi() {
    configButton.className = 'vp-config-button'
    configButton.appendChild(configSVG)
    controlsWrapper.appendChild(configButton)
  }

  function createLoadingUi() {
    playerWrapper.appendChild(loadingWrapper)
    loadingWrapper.appendChild(loadingState)
    loadingWrapper.className = 'loader-wrapper'
    loadingState.className = 'loader'
    loadingState.style.display = 'none' 
  }

  function addVolumeEventListeners () {
    volumeSlider.oninput = function() {
      videoElem.volume = this.value
    }
    volumeButton.addEventListener('click', function () {
      if(videoElem.muted){
        videoElem.muted = false
        volumeButton.removeChild(volumeButton.childNodes[0])
        volumeButton.appendChild(volumeSVG)
        volumeSlider.value = videoElem.volume
      } else {
        videoElem.muted = true
        volumeButton.removeChild(volumeButton.childNodes[0])
        volumeButton.appendChild(muteSVG)
        volumeSlider.value = 0
      }
    })
    videoElem.addEventListener('volumechange', function(){
      if (volumeSlider.value == 0) {
        videoElem.muted = true
        volumeButton.removeChild(volumeButton.childNodes[0])
        volumeButton.appendChild(muteSVG)
      } else {
        videoElem.muted = false
        volumeButton.removeChild(volumeButton.childNodes[0])
        volumeButton.appendChild(volumeSVG)
      }
    })
  }

  function initQualityMenuUi(arr, element) {
    wrapperElem.className = 'quality-wrapper'
    wrapperElem.style.display = 'none'

    let labelAuto = document.createElement('label')
    labelAuto.setAttribute('for', 'quality')
    labelAuto.id = arr.length
    labelAuto.className = 'container'

    let inputAuto = document.createElement('input')
    inputAuto.setAttribute('type', 'radio')
    inputAuto.setAttribute('name', 'quality')

    let spanAuto = document.createElement('span')
    spanAuto.innerHTML = 'Auto'

    labelAuto.appendChild(inputAuto)
    labelAuto.appendChild(spanAuto)
    wrapperElem.appendChild(labelAuto)

    for(let i = arr.length-1; i >= 0; i -= 1) {
      let labelElem = document.createElement('label')
      labelElem.setAttribute('for', 'quality')
      labelElem.id = i
      labelElem.className = 'container'

      let inputElem = document.createElement('input')
      inputElem.setAttribute('type', 'radio')
      inputElem.setAttribute('name', 'quality')
  
      let spanElem = document.createElement('span')
      spanElem.innerHTML = arr[i].height + 'p' 
  
      labelElem.appendChild(inputElem)
      labelElem.appendChild(spanElem)
      wrapperElem.appendChild(labelElem)

      labelElem.onclick = function() {
        inputElem.checked = true
        hls.currentLevel = i
        wrapperElem.style.display = 'none'
        console.log(i)
      }
    }

    hls.on(Hls.Events.LEVEL_SWITCHED, function(data, event){
      console.log(data, event.level)
      // if (videoElem.paused && videoElem.currentTime > 1) {
      //   videoElem.play()
      // }
    })
      
    element.appendChild(wrapperElem)
  }


  function setupHLS(manifestUrl) {
    if(Hls.isSupported()) {
      hls.loadSource(manifestUrl)
      hls.attachMedia(videoElem)
      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        // config.sort(function(a, b){return b.height-a.height})
        console.log('Player Config: ', data)
        initQualityMenuUi(data.levels, controlsWrapper)
      })
      }
      }
  
  function playEventListenersStart() {
    playButton.addEventListener('click', function () {
      if(videoElem.paused){
        videoElem.play()
        playButton.removeChild(playSVG)
        playButton.appendChild(pauseSVG)
      } else {
        videoElem.pause()
        playButton.removeChild(pauseSVG)
        playButton.appendChild(playSVG)
      }
    })
    videoElem.addEventListener('ended', function () {
      playButton.removeChild(pauseSVG)
      playButton.appendChild(playSVG)
    })
  }

  function progressEventListeners() {
    videoElem.addEventListener('timeupdate', function() {
      progressBar.oninput = function() {
        progressBar.value = this.value
        videoElem.currentTime = progressBar.value * videoElem.duration
        console.log('Seeked to:', progressBar.value * videoElem.duration)
      }
      loadingState.style.display = 'none'
      loadingWrapper.style.backgroundColor = '' 
      progressBar.value = videoElem.currentTime / videoElem.duration
      presentTimeLabel.innerHTML = '<span>' + secondsToTimecode(Math.floor(videoElem.currentTime)) + '</span>'
      presentTimeLabel.className = 'timecode-label'
      durationTimeLabel.className = 'duration-label'
      durationTimeLabel.innerHTML = '<span>' + secondsToTimecode(videoElem.duration) + '</span>'
    })
  }

  function bufferEventListeners() {
    videoElem.onwaiting = function() {
      loadingState.style.display = ''
      loadingWrapper.style.backgroundColor = 'rgb(0, 0, 0, .5)'
    }
  }


  configButton.addEventListener('click', function(){
    if (wrapperElem.style.display == ''){
      wrapperElem.style.display = 'none'
      console.log(hls.currentLevel)
    } else if (wrapperElem.style.display == 'none') {
      wrapperElem.style.display = ''
      console.log(hls.currentLevel)
    } else {
      console.log(hls.currentLevel)
    }
  })

  function fullscreenEventListeners() {
    fsButton.addEventListener('click', function () {
      if (!document.fullscreen) {
        playerWrapper.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    })
  }

  setupHLS(configOptions.source)
  createCoreUi()
  createPlayUi()
  createProgressUi()
  createVolumeUi()
  createConfigUi()
  createLoadingUi()
  createFullscreenUi()
  addVolumeEventListeners()
  playEventListenersStart()
  progressEventListeners()
  bufferEventListeners()
  fullscreenEventListeners()
  }


export default PlayerUI;