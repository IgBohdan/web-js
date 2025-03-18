(function () {
  const speakWord = "Good bye";

  function speek(name) {
    console.log(speakWord + " " + name);
  }

  window.speekGoodBye = speek;
})();
