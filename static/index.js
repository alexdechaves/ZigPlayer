import PlayerUI from "./js/main.js"

const config = {
    source: 'https://player.vimeo.com/external/373429162.m3u8?s=07ec979a7d712065107999ec46bd4cb5a9587b48',
    source1: 'https://player.vimeo.com/external/380957985.m3u8?s=d70300ba44a02aa1500f5ab66972b86100a19233'
}

let final = document.getElementById('root')

PlayerUI(final, config.source1)
