/* global browser */
(function() {

  if (window.hasRun) {
    return;
  }

  window.hasRun = true;
  const API_KEY = 'dc6zaTOxFJmzC';


  function getURLForType(type) {
    return fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${type}&offset=0&limit=25`);
  }

  function replaceImages(type) {

    const images = document.querySelectorAll('img');

    getURLForType(type)
      .then(async (response) => {

        const json = await response.json();
        const gifs = json.data;

        images.forEach(imgElement => {

          const srcUrl = gifs[Math.floor(Math.random() * 25)].images.original.url;

          imgElement.src = srcUrl;

        });

      });
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'therapy') {
      replaceImages(message.type);
    } else if (message.command === 'reset') {
      location.reload();
    }
  });

})();
