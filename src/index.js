import PlayerUI from "./js/player.js"


const config = {
    source: 'https://player.vimeo.com/external/444692654.m3u8?s=800433beef52a3a6f087e22dff8d18a3724c5a02'
}

let final = document.getElementById('root')

PlayerUI(final, config)
