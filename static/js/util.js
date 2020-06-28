export function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  }

export function secondsToTimecode(seconds) {
  let date = new Date(null);
  date.setSeconds(Math.floor(seconds)) // specify value for SECONDS here
  // 3600 seconds is 1 hour. We want to show the timecode as 00:00 if under an hour
  // but if over an hour, we want to show it as 00:00:00
  if (seconds < 3600) {
    return date.toISOString().substr(14, 5)
  } else {
    return date.toISOString().substr(11, 8)
  }
}