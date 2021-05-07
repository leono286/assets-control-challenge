const maxHorizontalStep = 13, maxVerticalStep = 18, totalSteps = 261, horizontalStepSize = 7.6923, verticalStepSize = 5.5555;
let duration = 5000; // 5 seg
let startAnimationTime, animId, frameUpdateTimeGap, currentStep;

const target = document.querySelector('.target');
const slider = document.querySelector('.slider-wrapper input');
const output = document.querySelector('.slider-wrapper .current-value .value');
const durationSelector = document.querySelector('.duration-selector');

const frame = (timestamp) => {
  if (startAnimationTime === 0) {
    startAnimationTime = timestamp;
  }

  if (startAnimationTime === -1) {
    const animationElapsedTime = currentStep / totalSteps * duration;
    startAnimationTime = timestamp - animationElapsedTime;
  }

  const elapsedTime = timestamp - startAnimationTime;
  const targetStep = Math.round(elapsedTime / duration * totalSteps);

  if (targetStep !== currentStep) {
    currentStep = targetStep;
    applyTransition();
  } 
  animId = window.requestAnimationFrame(frame);
}

const applyTransition = () => {
  if (currentStep > totalSteps) {
    currentStep = 0;
    startAnimationTime = 0;
  } 

  const targetXStep = currentStep % (maxHorizontalStep + 1);
  const targetYStep = Math.floor(currentStep / (maxHorizontalStep + 1));

  const newXPos = targetXStep * horizontalStepSize;
  const newYPos = targetYStep * verticalStepSize;
  updateSlider(Math.floor(currentStep / totalSteps * 100));

  target.style.backgroundPosition = `${newXPos}% ${newYPos}%`;
}

const resumeAnimation = () => {
  startAnimationTime = -1;
  animId = requestAnimationFrame(frame);
}

const releaseSlider = () => {
  slider.classList.remove('active');
  if (animId) {
    resumeAnimation();
  }
}

const updateAnimation = (event) => {
  slider.classList.add('active');
  window.cancelAnimationFrame(animId);
  const value = event.target.value;
  currentStep = value >= 100 ? 260 : Math.floor(value / 100 * totalSteps);
  window.requestAnimationFrame(applyTransition);
}

const updateSlider = (value) => {
  slider.value = value;
  output.innerHTML = value;
}

const updateDuration = (event) => {
  duration = event.target.value;
  window.cancelAnimationFrame(animId);
  init();
  applyTransition();
  if (animId) {
    resumeAnimation();
  }
}

const initSlider = () => {
  slider.addEventListener('input', updateAnimation);
  slider.addEventListener('change', releaseSlider);
}

const togglePlayback = () => {
  if (animId) {
    window.cancelAnimationFrame(animId);
    animId = null;
  } else {
    resumeAnimation();
  }
}

const initDurationSelector = () => {
  durationSelector.addEventListener('change', updateDuration);
}

const initPlayPauseFeature = () => {
  target.addEventListener('click', togglePlayback);
}

const init = () => {
  frameUpdateTimeGap = duration / totalSteps;
  currentStep = 0;
  startAnimationTime = 0;
}

initSlider();
initDurationSelector();
initPlayPauseFeature();
init();

