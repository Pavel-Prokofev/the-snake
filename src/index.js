import './index.css';

// Нзначаем HTML константы.
const board = document.querySelector('#game-board');
const startScreen = document.querySelector('#start-screen');
const currentScore = document.querySelector('#current-score');
const highestScore = document.querySelector('#highest-score');

const test = document.querySelector('.game-zone__border');

// Назначаем игровые переменные.
const gridSize = 24;
const startPosition = Math.floor(gridSize / 2);
let snake = [{ x: startPosition, y: startPosition }];
let food;
let actualHighestScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


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
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
};

// Генерим еду в случайном месте.
const generateFood = () => {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  food = { x, y };
};

//  Рисуем еду.
const drawFood = () => {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
};

// Рисуем игровую карту, змею и еду.
const draw = () => {
  if (gameStarted) {
    board.innerHTML = ''; // Перезагружаем содержимое поля перед следующей итерацией.
    drawSnake(); // Вызываем функцию отрисовки змеи.
    drawFood(); // Вызываем функцию отрисовки еды.
    updateScore(); // Вызываем функцию обновления счёта.
  };
};


// Функция увеличения скорости движения.
const increaseTheSpeed = () => {
  if (gameSpeedDelay > 180) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 160) {
    gameSpeedDelay -= 4;
  } else if (gameSpeedDelay > 120) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 80) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 40) {
    gameSpeedDelay -= 1;
  } else if (gameSpeedDelay > 20) {
    gameSpeedDelay -= 0.5;
  };
};

// Функция остановки игры.
const stopGame = () => {
  clearInterval(gameInterval);
  gameStarted = false;
  startScreen.classList.add('start-screen_visible');
  board.innerHTML = '';
};

// Функция обновления максимального счёта.
const updateHighestScore = () => {
  const actualCurrentScore = snake.length - 1;
  if (actualHighestScore < actualCurrentScore) {
    actualHighestScore = actualCurrentScore;
    highestScore.textContent = actualHighestScore.toString().padStart(3, '0');
  }
};

// Функция обновления текущего счёта.
const updateScore = () => {
  const actualCurrentScore = snake.length - 1;
  currentScore.textContent = actualCurrentScore.toString().padStart(3, '0');
};

// Функция перезапуска игры после столкновения.
const resetGame = () => {
  updateHighestScore();
  stopGame();
  snake = [{ x: startPosition, y: startPosition }];
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
  console.log(test.innerHTML);
  console.log(board.innerHTML);
};

// Проверка столкновений со стеной и с самим собой.
const checkCollision = () => {
  const head = snake[0];
  // Столкновение со стеной.
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  };
  // Столкновение с хвоcтом.
  if (snake.length > 3) {
    for (let i = 3; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        resetGame();
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
  if (head.x === food.x && head.y === food.y) {
    // при "поедании" пропускаем удаление конца змеи, чтобы её удлинить.
    generateFood(); // Генерируем новые координаты еды.
    clearInterval(gameInterval); // Удаляем последний интервал дабы избежать наложений и ошибок.
    increaseTheSpeed(); // Увеличиваем скорость движения уменьшая интервал.
    gameInterval = setInterval(() => {
      move(); // Сдвинулись.
      checkCollision(); // Проверка столкновений.
      draw(); // Отрисовали.
    }, gameSpeedDelay);
  } else {
    snake.pop(); // Удаляем последний элемент змейки.
  };
};

// Функция запуска игры
const startGame = () => {
  gameStarted = true; // Флаг начатой игры.
  startScreen.classList.remove('start-screen_visible');
  generateFood(); // Определяем место генерации первой еды.
  gameInterval = setInterval(() => {
    move(); // Сдвинулись.
    checkCollision(); // Проверка столкновений.
    draw(); // Отрисовали.
  }, gameSpeedDelay);
};

// Обработчик слушателя кликов.
const handleKeyPress = (evt) => {
  if (!gameStarted && (evt.code === 'Spase' || evt.key === ' ')) {
    startGame();
  } else {
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

document.addEventListener('keydown', handleKeyPress);