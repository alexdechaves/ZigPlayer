import PlayerUI from "./js/main.js"


const config = {
    source: 'http://34.120.8.29/live/ch2_abr/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9OC8xLzIwMjAgNDo0MDoyMSBQTSZoYXNoX3ZhbHVlPS9TVzlCbVZmRHZiM01vS2w5azJob3c9PSZ2YWxpZG1pbnV0ZXM9NzIwJmlkPTI2MDU6NjAwMDo4ZDRmOmU5MDA6MTRlYjo2ZjQxOjg5N2I6NjY4ZCZzdHJtX2xlbj01'
}

let final = document.getElementById('root')

PlayerUI(final, config)
