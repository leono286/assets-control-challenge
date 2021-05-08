
let videoDuration; // 8.7s according to video editor.
let currentProgress = 0, isPlaying = false, playingOnSeek = false, duration = 5000; // 5 seg


const video = document.querySelector("video");
const target = document.querySelector('.target');
const slider = document.querySelector('.slider-wrapper input');
const output = document.querySelector('.slider-wrapper .current-value .value');
const durationSelector = document.querySelector('.duration-selector');


const initPlayback = () => {
  video.addEventListener('canplaythrough', () => {
    videoDuration = video.duration;
    setSpeed();
  });
  target.addEventListener('click', togglePlayback);
  video.addEventListener('timeupdate', () => { updateTracking() });
}

const initSlider = () => {
  slider.addEventListener('input', updateAnimationOnSeek);
  slider.addEventListener('change', releaseSlider);
}

const togglePlayback = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

const updatevideo = () => {
  video.currentTime = currentProgress;
}

const releaseSlider = () => {
  slider.classList.remove('active');
  if (playingOnSeek) {
    playingOnSeek = false;
    video.play();
  }
}

const updateAnimationOnSeek = (event) => {
  const value = event.target.value;

  slider.classList.add('active');
  if (!video.paused) {
    playingOnSeek = true;
    video.pause();
  }
  currentProgress = (value / 100 * videoDuration).toFixed(3);
  updatevideo();
}

const updateSlider = () => {
  slider.value = currentProgress;
  output.innerHTML = currentProgress;
}

const updateTracking = () => {
  const progress = Math.round(video.currentTime / videoDuration * 100);
  if (currentProgress !== progress) {
    currentProgress = progress;
    updateSlider();
  }
}

const setSpeed = () => {
  const speed = ((videoDuration * 1000).toFixed() / duration );
  video.playbackRate = speed;
}

const updateDuration = (event) => {
  duration = event.target.value;
  let playingOnDurationChange;
  if (!video.paused) {
    playingOnDurationChange = true;
  }
  video.pause();
  currentProgress = 0;
  updatevideo();
  setSpeed();
  playingOnDurationChange && video.play();
}

const initDurationSelector = () => {
  durationSelector.addEventListener('change', updateDuration);
}

const init = () => {
  initSlider();
  initPlayback();
  initDurationSelector();
  
}

init();




