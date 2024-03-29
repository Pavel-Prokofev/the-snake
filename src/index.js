import './index.css';

import { setTheme } from './scripts/set-theme.js';
import { snakeSpeed } from './scripts/speed-chang.js';

// Нзначаем HTML константы.
const board = document.querySelector('#game-board');
const startScreen = document.querySelector('#start-screen');
const menuScreen = document.querySelector('#menu-screen');
const pauseScreen = document.querySelector('#pause-screen');
const gameOverScreen = document.querySelector('#game-over-screen');
const currentScore = document.querySelector('#current-score');
const highestScore = document.querySelector('#highest-score');

const test = document.querySelector('.game-zone__border');

// Назначаем игровые переменные.
const gridSize = 24;
const startPosition = Math.floor(gridSize / 2);
let snake = [{ x: startPosition, y: startPosition }, { x: startPosition, y: startPosition + 1 }];
let food;
let bonusFood;


let actualHighestScore = localStorage.getItem('snake-highest-score') || 0;
highestScore.textContent = actualHighestScore.toString().padStart(3, '0'); // !!! Не забыть при рефакторинге вынести вместе со всем счётом в отдельный блок !!!
console.log(actualHighestScore)
let bonusScore = 0;


let direction = 'up';
let gameInterval;
let gameStarted = false;
let menuOpen = false;
let pause = false;


// Определение позиции змеи или еды.
const setPosition = (element, position) => {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
};

// Создание змеи или пищевого кубика (div).
const createGameElement = (tag, className) => {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
};

// Рисуем змею.
const drawSnake = () => {
  snake.forEach((segment, position) => {
    const snakeElement = createGameElement('div', 'snake');
    // Положение головы.
    if (position === 0) {
      snakeElement.classList.add('snake__head', `snake__element_${direction}`);
    }
    // Положение хвоста.
    if ((snake.length > 1) && (position === (snake.length - 1))) {
      snakeElement.classList.add('snake__tail');
      if ((segment.x > snake[position - 1].x) && (segment.y === snake[position - 1].y)) {
        snakeElement.classList.add('snake__element_right');
      }
      if ((segment.x < snake[position - 1].x) && (segment.y === snake[position - 1].y)) {
        snakeElement.classList.add('snake__element_left');
      }
      if ((segment.x === snake[position - 1].x) && (segment.y > snake[position - 1].y)) {
        snakeElement.classList.add('snake__element_down');
      }
    }
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
};

// Генерим еду в случайном месте.
const generateFood = () => {
  let x = Math.floor(Math.random() * gridSize) + 1;
  let y = Math.floor(Math.random() * gridSize) + 1;
  let unique = false;

  while (!unique) { // Исключаем возможность появления еды на змее
    if (snake.every(item => ((item.x !== x) && (item.y !== y)))
      && (food ? ((food.x !== x) && (food.y !== y)) : true)
      && (bonusFood ? ((bonusFood.x !== x) && (bonusFood.y !== y)) : true)
    ) {
      unique = true;
    } else {

      x = Math.floor(Math.random() * gridSize) + 1;
      y = Math.floor(Math.random() * gridSize) + 1;
    };
  }

  return { x, y };
};

//  Рисуем еду.
const drawFood = () => {
  const foodElement = createGameElement('div', 'food');
  setPosition(foodElement, food);
  board.appendChild(foodElement);
};

// Рисуем игровую карту, змею и еду.
const draw = () => {
  if (gameStarted && !gameOverScreen.classList.contains('skreen-box_visible')) {
    board.innerHTML = ''; // Перезагружаем содержимое поля перед следующей итерацией.
    drawSnake(); // Вызываем функцию отрисовки змеи.
    drawFood(); // Вызываем функцию отрисовки еды.
    updateScore(); // Вызываем функцию обновления счёта.
  };
};

// Функция остановки игры.
const stopGame = () => {
  gameStarted = false;
  gameOverScreen.classList.remove('skreen-box_visible');
  startScreen.classList.add('skreen-box_visible');
  board.innerHTML = '';
};

// Функция обновления максимального счёта.
const updateHighestScore = () => {
  const actualCurrentScore = snake.length - 2 + bonusScore;
  if (actualHighestScore < actualCurrentScore) {
    actualHighestScore = actualCurrentScore;
    localStorage.setItem('snake-highest-score', actualCurrentScore);
    highestScore.textContent = actualHighestScore.toString().padStart(3, '0');
  }
};

// Функция обновления текущего счёта.
const updateScore = () => {
  const actualCurrentScore = snake.length - 2 + bonusScore;
  currentScore.textContent = actualCurrentScore.toString().padStart(3, '0');
};


// Функция перезапуска игры после столкновения.
const resetGame = () => {
  updateHighestScore();
  stopGame();
  snake = [{ x: startPosition, y: startPosition }, { x: startPosition, y: startPosition + 1 }];
  direction = 'up';
  snakeSpeed.speedReset();
  bonusScore = 0;
  updateScore();
};

// Проверка столкновений со стеной и с самим собой.
const checkCollision = () => {
  const head = snake[0];
  // Столкновение со стеной.
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    clearInterval(gameInterval);
    gameOverScreen.classList.add('skreen-box_visible');
    let gameOver = setTimeout(resetGame, 5000);
  };
  // Столкновение с хвоcтом.
  if (snake.length > 3) {
    for (let i = 3; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        clearInterval(gameInterval);
        gameOverScreen.classList.add('skreen-box_visible');
        let gameOver = setTimeout(resetGame, 5000);
      };
    };
  };
};

// Движение змеи.
const move = () => {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y--
      break;
    case 'right':
      head.x++
      break;
    case 'down':
      head.y++
      break;
    case 'left':
      head.x--
      break;
    default:
      break;
  };
  // Создаём иллюзию движения.
  snake.unshift(head); // Добавляем на первое место в масиве новый по направлению движения.
  if (head.x === food.x && head.y === food.y) { //Покушали

    // Бонус за еду у бортика.
    if (food.x === 1 || food.y === 1 || food.x === gridSize || food.y === gridSize) {
      bonusScore += 1;
      if ((food.x === 1 && food.y === 1)
        || (food.x === 1 && food.y === gridSize)
        || (food.x === gridSize && food.y === 1)
        || (food.x === gridSize && food.y === gridSize)) {
        bonusScore += 1;
      };
    }

    // при "поедании" пропускаем удаление конца змеи, чтобы её удлинить.
    food = generateFood(); // Генерируем новые координаты еды.
    clearInterval(gameInterval); // Удаляем последний интервал дабы избежать наложений и ошибок.
    snakeSpeed.increaseTheSpeed(); // Увеличиваем скорость движения уменьшая интервал.
    gameInterval = setInterval(() => {
      move(); // Сдвинулись.
      checkCollision(); // Проверка столкновений.
      draw(); // Отрисовали.
    }, snakeSpeed.gameSpeedDelay);
  } else {
    snake.pop(); // Удаляем последний элемент змейки.
  };
};

// Функция запуска игры
const startGame = () => {
  gameStarted = true; // Флаг начатой игры.
  startScreen.classList.remove('skreen-box_visible');
  food = generateFood(); // Определяем место генерации первой еды.
  gameInterval = setInterval(() => {
    move(); // Сдвинулись.
    checkCollision(); // Проверка столкновений.
    draw(); // Отрисовали.
  }, snakeSpeed.gameSpeedDelay);
};

const openedMenu = () => {
  startScreen.classList.remove('skreen-box_visible');
  menuScreen.classList.add('skreen-box_visible');
  menuOpen = true;
}

const closedMenu = () => {
  menuScreen.classList.remove('skreen-box_visible');
  startScreen.classList.add('skreen-box_visible');
  menuOpen = false;
}

// Обработчик слушателя кликов.
const handleKeyPress = (evt) => {
  if (!gameStarted && (evt.code === 'Spase' || evt.key === ' ') && !menuOpen && !pause) {
    startGame();
  } else if (gameStarted && (evt.code === 'Spase' || evt.key === ' ') && !menuOpen && !pause
    && !gameOverScreen.classList.contains('skreen-box_visible')) {
    clearInterval(gameInterval); // Удаляем последний интервал дабы избежать наложений и ошибок.
    pause = true;
    pauseScreen.classList.add('skreen-box_visible');
  }
  else if (gameStarted && (evt.code === 'Spase' || evt.key === ' ') && !menuOpen && pause) {
    gameInterval = setInterval(() => {
      move(); // Сдвинулись.
      checkCollision(); // Проверка столкновений.
      draw(); // Отрисовали.
    }, snakeSpeed.gameSpeedDelay);
    pause = false;
    pauseScreen.classList.remove('skreen-box_visible');
  } else if (gameStarted && !pause) {
    switch (evt.key) {
      case 'ArrowUp':
      case 'W':
      case 'w':
      case 'Ц':
      case 'ц':
        !snake[1] ? direction = 'up' :
          (snake[0].y <= snake[1].y) ? direction = 'up' : direction;
        break;
      case 'ArrowRight':
      case 'D':
      case 'd':
      case 'В':
      case 'в':
        !snake[1] ? direction = 'right' :
          (snake[0].x >= snake[1].x) ? direction = 'right' : direction;
        break;
      case 'ArrowDown':
      case 'S':
      case 's':
      case 'Ы':
      case 'ы':
        !snake[1] ? direction = 'down' :
          (snake[0].y >= snake[1].y) ? direction = 'down' : direction;
        break;
      case 'ArrowLeft':
      case 'A':
      case 'a':
      case 'Ф':
      case 'ф':
        !snake[1] ? direction = 'left' :
          (snake[0].x <= snake[1].x) ? direction = 'left' : direction;
        break;
      default:
        break;
    };
  };
};

const handleClick = (evt) => {
  if ((evt.target.id === 'menu-open-button') && !gameStarted && !menuOpen) {
    openedMenu();
  } else if ((evt.target.id === 'menu-close-button') && !gameStarted && menuOpen) {
    closedMenu();
  }
}

document.addEventListener('keydown', handleKeyPress);
document.addEventListener('click', handleClick);