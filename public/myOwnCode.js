(function() {
  var title = document.getElementsByTagName("title")[0];
  var oldTitle = title.innerHTML;

  const pingInterval = 5000;

  window.addEventListener("load", function() {
    //prevent freeze
    setTimeout(function() {
      title.innerHTML = oldTitle + " prevent freeze";
      setTimeout(function() {
        title.innerHTML = oldTitle;
      }, 2000);
    }, 2000);

    setInterval(function() {
      fetch(window.location.href + "/ping");
    }, pingInterval);
  });
})();