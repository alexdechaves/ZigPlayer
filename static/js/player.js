
function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

const playHTML = '<svg viewBox="0 0 20 20" preserveAspectRatio="xMidYMid" focusable="false" aria-labelledby="play-icon-title" class="vp-play-icon" role="img"><defs><filter id="shadow"><feDropShadow dx="0.2" dy="0.4" stdDeviation="2"/></filter></defs><polygon points="1,0 20,10 1,20" style="filter:url(#shadow);"/></svg>'
const pauseHTML = '<svg viewBox="0 0 20 20" preserveAspectRatio="xMidYMid" focusable="false" aria-labelledby="pause-icon-title" class="vp-play-icon" role="img"><defs><filter id="shadow"><feDropShadow dx="0.2" dy="0.4" stdDeviation="2"/></filter></defs><title id="pause-icon-title">{{ title }}</title><rect style="filter:url(#shadow);" class="fill" width="6" height="20" x="0" y="0" /><rect style="filter:url(#shadow);" class="fill" width="6" height="20" x="12" y="0" /></svg>'
const volHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 560" aria-hidden="true" class="vp-play-icon"><path d="M447.161 28.839C516.391 90.361 560 180.088 560 280s-43.609 189.639-112.839 251.161l-29.75-29.75C479.064 447.527 518 368.31 518 280S479.064 112.473 417.411 58.589l29.75-29.75zm-79.409 79.409C416.818 149.318 448 211.018 448 280c0 68.982-31.182 130.682-80.248 171.752l-29.847-29.847C379.436 388.578 406 337.391 406 280c0-57.391-26.564-108.578-68.095-141.905l29.847-29.847zM28 336V224h56l112-112v336L84 336H28zm259.936-147.936C316.989 208.268 336 241.914 336 280c0 38.086-19.011 71.732-48.064 91.936l-30.452-30.452C279.246 329.605 294 306.525 294 280s-14.754-49.605-36.516-61.484l30.452-30.452z"></path></svg>'
const muteHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 560" aria-hidden="true" class="vp-play-icon"><path d="M84 224l112-112v336L84 336H28V224h56zm306.302 56l-84.146 84.146 29.698 29.698L420 309.698l84.146 84.146 29.698-29.698L449.698 280l84.146-84.146-29.698-29.698L420 250.302l-84.146-84.146-29.698 29.698L390.302 280z"></path></svg>'

function Player(element) {
  let playerWrapper = document.createElement('div')
  playerWrapper.className = 'wrapper'
  element.appendChild(playerWrapper)

  let videoElem = document.createElement('video')
  videoElem.className = 'video'
  playerWrapper.appendChild(videoElem)

  let playButton = document.createElement('button')
  playButton.className = 'vp-play-button'

  let playSVG = htmlToElement(playHTML)
  let pauseSVG = htmlToElement(pauseHTML)
  playButton.appendChild(playSVG)
  playerWrapper.appendChild(playButton)
  

  
  let volumeContainer = document.createElement('div')
  let volumeButton = document.createElement('button')
  let volumeSlider = document.createElement('input')
  let volumeSVG = htmlToElement(volHTML)
  let muteSVG = htmlToElement(muteHTML)
  volumeButton.className = 'vp-volume-button'

  volumeSlider.className = 'slider'
  volumeSlider.setAttribute('min', 0)
  volumeSlider.setAttribute('max', 10)
  volumeSlider.setAttribute('value', 5)
  volumeSlider.setAttribute('type', 'range')

  playerWrapper.appendChild(volumeContainer)
  volumeContainer.appendChild(volumeSlider)
  volumeButton.appendChild(volumeSVG)
  volumeContainer.appendChild(volumeButton)

  volumeSlider.classList.add('slider-hidden')

  volumeSlider.oninput = function() {
    videoElem.volume = this.value/10
  }


  volumeButton.addEventListener('mouseover', function () {
    volumeSlider.classList.remove('slider-hidden')
  })

  volumeButton.addEventListener('mouseout', function () {
    volumeSlider.classList.add('slider-hidden')
  })

  volumeSlider.addEventListener('mouseover', function () {
    volumeSlider.classList.remove('slider-hidden')
  })

  volumeSlider.addEventListener('mouseout', function () {
    volumeSlider.classList.add('slider-hidden')
  })

  if(Hls.isSupported()) {
    const hls = new Hls()
    hls.loadSource('https://player.vimeo.com/external/373429162.m3u8?s=07ec979a7d712065107999ec46bd4cb5a9587b48')
    hls.attachMedia(videoElem)
  }

  playButton.addEventListener('mouseover', function () {
      pauseSVG.classList.remove('vp-play-icon')
      pauseSVG.classList.add('vp-play-icon-hover')
      playSVG.classList.remove('vp-play-icon')
      playSVG.classList.add('vp-play-icon-hover')
    })

  playButton.addEventListener('mouseout', function () {
    playSVG.classList.remove('vp-play-icon-hover')
    pauseSVG.classList.remove('vp-play-icon-hover')
    pauseSVG.classList.add('vp-play-icon')
    playSVG.classList.add('vp-play-icon')
    
  })

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

  volumeButton.addEventListener('click', function () {
    if(videoElem.muted){
      videoElem.muted = false
      volumeButton.removeChild(volumeButton.childNodes[0])
      volumeButton.appendChild(volumeSVG)
      console.log(volumeButton.childNodes)
    } else {
      videoElem.muted = true
      volumeButton.removeChild(volumeButton.childNodes[0])
      volumeButton.appendChild(muteSVG)
      volumeSlider.value = 0
      console.log(volumeButton.childNodes)
    }
  })


  videoElem.addEventListener('ended', function () {
    playButton.innerHTML = "Restart"
  })
  }
  
let final = document.getElementById('test')

Player(final)