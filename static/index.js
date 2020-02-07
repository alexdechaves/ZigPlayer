import PlayerUI from "./js/main.js"

const config = {
    // source: 'https://player.vimeo.com/external/373429162.m3u8?s=07ec979a7d712065107999ec46bd4cb5a9587b48'
    source: 'https://player.vimeo.com/external/349605853.m3u8?s=4f57d333b54f65fb1cded4d33015705f5e00edbd'
}

let final = document.getElementById('root')

PlayerUI(final, config)
