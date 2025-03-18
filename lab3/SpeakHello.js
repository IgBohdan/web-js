(function () {
  const speakWord = "Hello";

  function speek(name) {
    console.log(speakWord + " " + name);
  }

  window.speekHello = speek;
})();
