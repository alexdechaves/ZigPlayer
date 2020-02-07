export function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  }

export function secondsToTimecode(seconds) {
  let date = new Date(null);
  date.setSeconds(Math.floor(seconds)) // specify value for SECONDS here
  return date.toISOString().substr(11, 8)
}