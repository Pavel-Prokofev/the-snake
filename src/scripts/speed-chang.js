export const snakeSpeed = (() => {
  let gameSpeedDelay = 200; // Скорость змейки. 
  let maxSpeed = 'normal';

  // Функция изменения максимальной скорости змеи.
  const changeMaxSpeed = (newMaxSpeed) => {
    maxSpeed = newMaxSpeed;
    document.querySelector(`#${newMaxSpeed}`).checked = 1;
  }

  // Инициализируем скорость при загрузке.
  const initSpeed = (() => {
    const savedMaxSpeed = localStorage.getItem('snake-max-speed');
    if (savedMaxSpeed) {
      changeMaxSpeed(savedMaxSpeed);
    }
  })();

  // Слушатель загрузки. 
  document.addEventListener('DOMContentLoaded', () => {
    // Кллекция чеков скорости.
    const speedChecks = document.querySelector('.max-speed').querySelectorAll('.fieldset__radio');
    // Вешаем слушателей на чеки.
    speedChecks.forEach((check) => {
      check.onclick = () => {
        const newMaxSpeed = check.getAttribute('id');
        localStorage.setItem('snake-max-speed', newMaxSpeed);
        changeMaxSpeed(newMaxSpeed);
      };
    });
  });

  // Сброс скорости к начальной.
  const speedReset = () => {
    gameSpeedDelay = 200;
  };

  // Функция увеличения скорости движения.
  const increaseTheSpeed = () => {
    if (gameSpeedDelay > 180) {
      gameSpeedDelay -= 6;
    } else if (gameSpeedDelay > 160) {
      gameSpeedDelay -= 5;
    } else if ((gameSpeedDelay > 110)) {
      gameSpeedDelay -= 4; //easy
    } else if ((gameSpeedDelay > 80) && ((maxSpeed === 'normal') || (maxSpeed === 'hard') || (maxSpeed === 'impossible'))) {
      gameSpeedDelay -= 3; //normal
    } else if ((gameSpeedDelay > 50) && (maxSpeed === 'hard') || (maxSpeed === 'impossible')) {
      gameSpeedDelay -= 2; //hard
    } else if ((gameSpeedDelay > 20) && (maxSpeed === 'impossible')) {
      gameSpeedDelay -= 1; //impossible
    };
  };

  return { gameSpeedDelay, increaseTheSpeed, speedReset };
})();



