(function () {
  function log(message) {
    var debug = document.getElementById("d");
    var line = document.createElement("div");
    line.className = "debug-line";
    line.appendChild(document.createTextNode(message));
    debug.appendChild(line);
    debug.scrollTop = debug.scrollHeight;
  }

  function getCount() {
    var match = document.cookie.match(/(?:^|;\s*)c=([^;]+)/);
    return match ? parseInt(match[1], 10) || 0 : 0;
  }

  function setCount(value) {
    document.cookie = "c=" + value + ";path=/;max-age=31536000";
  }

  function renderCount() {
    var count = String(getCount());
    while (count.length < 4) count = "0" + count;
    document.getElementById("c").innerHTML = count;
  }

  function increment(event) {
    if (event && event.preventDefault) event.preventDefault();
    setCount(getCount() + 1);
    renderCount();
    log("CLICK");
  }

  function init() {
    var button = document.getElementById("b");
    button.onclick = increment;
    button.ontouchend = increment;
    renderCount();
    log("LOADED");
    log("init=" + document.getElementById("c").innerHTML);
  }

  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", init, false);
  } else {
    window.onload = init;
  }
})();
