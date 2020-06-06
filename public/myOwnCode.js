//prevent freeze
(function() {
  var title = document.getElementsByTagName("title")[0];
  var oldTitle = title.innerHTML;

  window.addEventListener("load", function() {
    setTimeout(function() {
      title.innerHTML = oldTitle + " prevent freeze";
      setTimeout(function() {
        title.innerHTML = oldTitle;
      }, 2000);
    }, 2000);
  });
})();

//override WebSocket call
//WebSocket = require('ws');