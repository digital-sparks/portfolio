const button = document.querySelector('.play-button');
const video = document.querySelector('video');

button.addEventListener('click', () => {
  video.pause();
  video.currentTime = 0;
  setTimeout(() => {
    video.play();
  }, 1800);
});
