const maxHorizontalStep = 13, maxVerticalStep = 18, totalSteps = 261, horizontalStepSize = 7.6923, verticalStepSize = 5.5555;
let duration = 5000; // 5 seg
let startAnimationTime, animId, frameUpdateTimeGap, currentStep, previousStep;

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
    updateCurrentStep(targetStep);
    applyTransition();
  }
  animId = window.requestAnimationFrame(frame);
}

const applyTransition = () => {
  if (currentStep >= totalSteps) {
    updateCurrentStep(0);
    startAnimationTime = 0;
  }

  updateSlider(Math.floor(currentStep / totalSteps * 100));

  const targetClass = '.step-' + `${currentStep}`.padStart(3, '0');
  document.querySelector('.active').classList.remove('active');
  document.querySelector(targetClass).classList.add('active');
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
  updateCurrentStep(value >= 100 ? 260 : Math.floor(value / 100 * totalSteps));
  window.requestAnimationFrame(applyTransition);
}

const updateCurrentStep = (newStep) => {
  previousStep = currentStep;
  currentStep = newStep
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
  updateCurrentStep(0);
  startAnimationTime = 0;
}

initSlider();
initDurationSelector();
initPlayPauseFeature();
init();

