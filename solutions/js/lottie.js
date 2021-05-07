const lottieDuration = 8700; // 8.7s according to lottie editor.
let currentProgress = 0, isPlaying = false, playingOnSeek = false, duration = 5000; // 5 seg


const player = document.querySelector("lottie-player");
const target = document.querySelector('.target');
const slider = document.querySelector('.slider-wrapper input');
const output = document.querySelector('.slider-wrapper .current-value .value');
const durationSelector = document.querySelector('.duration-selector');

player.load(animationData);


const initPlayback = () => {
  target.addEventListener('click', togglePlayback);
  player.addEventListener('frame', updateTracking);
  player.addEventListener('play', () => { updatePlayingState(true) });
  player.addEventListener('pause', () => { updatePlayingState(false) });
}

const updatePlayingState = (state) => {
  isPlaying = state;
}

const initSlider = () => {
  slider.addEventListener('input', updateAnimationOnSeek);
  slider.addEventListener('change', releaseSlider);
}

const togglePlayback = () => {
  player.togglePlay();
}

const updateLottie = () => {
  player.seek(`${currentProgress}%`);
}

const releaseSlider = () => {
  slider.classList.remove('active');
  if (playingOnSeek) {
    playingOnSeek = false;
    player.play();
  }
}

const updateAnimationOnSeek = (event) => {
  const value = event.target.value;

  slider.classList.add('active');
  if (isPlaying) {
    playingOnSeek = true;
    player.pause();
  }
  currentProgress = value;
  updateLottie();
}

const updateSlider = () => {
  slider.value = currentProgress;
  output.innerHTML = currentProgress;
}

const updateTracking = (frameData) => {
  const progress = Math.round(frameData.detail.seeker);
  if (currentProgress !== progress) {
    currentProgress = progress;
    updateSlider();
  }
}

const setSpeed = () => {
  const speed = lottieDuration / duration;
  player.setSpeed(speed);
}

const updateDuration = (event) => {
  duration = event.target.value;
  let playingOnDurationChange;
  if (isPlaying) {
    playingOnDurationChange = true;
  }
  player.stop();
  updateLottie();
  setSpeed();
  playingOnDurationChange && player.play();
}

const initDurationSelector = () => {
  durationSelector.addEventListener('change', updateDuration);
}

const init = () => {
  initSlider();
  initPlayback();
  initDurationSelector();
  setSpeed(); 
}

init();




