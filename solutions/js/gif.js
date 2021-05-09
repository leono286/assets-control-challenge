let gifTotalFrames;
let currentProgressInFrames = 0, currentProgressInPerc = 0, isPlaying = false, playingOnSeek = false, duration = 5000; // 5 seg

const target = document.querySelector('.target');
const gif = target.querySelector('img');
const slider = document.querySelector('.slider-wrapper input');
const output = document.querySelector('.slider-wrapper .current-value .value');
const durationSelector = document.querySelector('.duration-selector');

let gifPlayback = new SuperGif({ gif, progressbar_height: 0, auto_play: 0 });

const initPlayback = () => {
  gifTotalFrames = gifPlayback.get_length();
  gifPlayback.pause();
  target.classList.remove('loading');
  target.addEventListener('click', togglePlayback);
  requestAnimationFrame(updateTracking);
}

const initSlider = () => {
  slider.addEventListener('input', updateAnimationOnSeek);
  slider.addEventListener('change', releaseSlider);
}

const togglePlayback = () => {
  if (gifPlayback.get_playing()) {
    gifPlayback.pause();
  } else {
    gifPlayback.play();
  }
}

const updateGifPlayback = () => {
  gifPlayback.move_to(`${currentProgressInFrames}%`);
}

const releaseSlider = () => {
  slider.classList.remove('active');
  if (playingOnSeek) {
    playingOnSeek = false;
    gifPlayback.play();
  }
}

const updateAnimationOnSeek = (event) => {
  const value = event.target.value;

  slider.classList.add('active');
  if (gifPlayback.get_playing()) {
    playingOnSeek = true;
    gifPlayback.pause();
  }
  currentProgressInFrames = Math.round(value * gifTotalFrames/ 100);
  updateGifPlayback();
}

const updateSlider = () => {
  slider.value = currentProgressInPerc;
  output.innerHTML = currentProgressInPerc;
}

const updateTracking = () => {
  const currentFrame = gifPlayback.get_current_frame();
  const progressInPerc = Math.round(currentFrame / gifTotalFrames * 100);
  if (currentFrame !== currentProgressInFrames || progressInPerc !== currentProgressInPerc) {
    currentProgressInFrames = currentFrame;
    currentProgressInPerc = progressInPerc;
    updateSlider();
  }
  requestAnimationFrame(updateTracking);
}

const init = () => {
  initSlider();
  initPlayback();
  target.classList.remove('loading');
}

gifPlayback.load(init);
