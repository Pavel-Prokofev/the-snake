
// Есть одна трудность. Webpack не понимает относительный путь для точки выхода. 
// Поэтому в свойство path нужно обязательно записывать абсолютный путь,
// то есть путь от корневой папки.
// Это можно сделать автоматически. В Node.js есть утилита, 
// которая превращает относительный путь в абсолютный. Она называется path,
// а подключить его в файл можно функцией require:

const path = require('path'); // подключаем path к конфигу вебпак. Утилита для конвертации относительного пути в абсолютный.
const HtmlWebpackPlugin = require('html-webpack-plugin'); // подключите плагин для конвертации HTML
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // подключили плагин, который будет каждый раз при сборке проекта удалять содержимое папки dist.  
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // подключите к проекту mini-css-extract-plugin для объединения css файлов.


module.exports = {
  entry: { main: './src/index.js' },  //  Точка входа, место в через которое Webpack будет собирать код нашего Джаба Скрипта 
  output: {                 //  точка выхода. Это итоговый файл, куда Webpack сложит весь JS-код. Её нужно указать в объекте output. 
    //  path: './dist/',        //  У этого объекта 3 свойства: путь к точке выхода (Смотри выше),  

    path: path.resolve(__dirname, 'dist'),  //  Вместо относительного пути, который мы указали в свойстве path, теперь стоит вызов метода path.resolve. 
    //  Ему переданы два аргумента: ссылка на текущую папку __dirname и относительный путь к точке выхода.

    filename: 'main.js',    //  имя файла, куда Webpack положит код,
    publicPath: ''  //  и свойство для обновления путей внутри CSS- и HTML-файлов.
  },
  mode: 'development', // добавили режим разработчика
  devServer: {
    static: path.resolve(__dirname, './dist'), // путь, куда "смотрит" режим разработчика
    compress: true, // это ускорит загрузку в режиме разработки
    port: 8080, // порт, чтобы открывать сайт по адресу localhost:8080, но можно поменять порт !! не забывай !!

    open: true // сайт будет открываться сам при запуске npm run dev
  },
  module: {   //  Так мы говорим Вебпак использовать транспилятор Бабель
    rules: [ // rules — это массив правил
      // добавим в него объект правил для бабеля
      {
        // регулярное выражение, которое ищет все js файлы
        test: /\.js$/,
        // при обработке этих файлов нужно использовать babel-loader
        use: 'babel-loader',
        // исключает папку node_modules, файлы в ней обрабатывать не нужно
        exclude: '/node_modules/'
      },
      {
        // регулярное выражение, которое ищет все файлы с такими расширениями чтоб добавить в сборку картинки и шрифты.
        test: /\.(png|svg|ico|jpg|gif|webp|avif|woff(2)?|eot|ttf|otf)$/,
        type: 'asset/resource' // В отличие от JS-кода нам не потребуется использовать дополнительный пакет для транспиляции кода.
        // Достаточно указать то, в каком виде Webpack перенесёт файлы в папку dist. За это отвечает свойство type. 
        // Его значение asset/resource позволяет переносить исходные файлы в конечную сборку в том же формате.
      },
      {
        // применять это правило только к CSS-файлам
        test: /\.css$/,
        // при обработке этих файлов нужно использовать
        // MiniCssExtractPlugin.loader и css-loader
        use: [MiniCssExtractPlugin.loader, {       //Теперь за обработку файлов стилей и подключение их в HTML будет отвечать «Вебпак».
                                                   // Чтобы рассказать ему о CSS, импортируйте главный css-файл в index.js: import './styles/index.css';
          loader: 'css-loader',
          options: { importLoaders: 1 } //Если вы используете директиву @import в css-файлах, после подключения postcss-loader, 
                                        //нужно изменить то, как подключается css-loader.
                                        //В конце css-loader необходимо передать опцию importLoaders со значением 1

        },
        'postcss-loader' //добавили postcss-loader
      ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html' // путь к файлу index.html
    }),
    new CleanWebpackPlugin(),   // подключение плагина для удаления тарого bild при пересборке или иользовании локальным сервом
    new MiniCssExtractPlugin() // подключение плагина для объединения файлов css
  ]
}

  // Webpack изменяет имена файлов при сборке, поэтому пути к картинкам будут неправильными.
  // Проблему легко решить, если отдать работу с такими картинками Webpack. Чтобы это сделать, импортируем каждое изображение в JS-файл:

  // теперь картинки можно импортировать,
  // вебпак добавит в переменные правильные пути

// import jordanImage from './images/jordan.jpg';
// import jamesImage from './images/james.jpg';
// import bryantImage from './images/bryant.jpg';

// const whoIsTheGoat = [

  // меняем исходные пути на переменные

//   { name: 'Michael Jordan', image: jordanImage },
//   { name: 'Lebron James', link: jamesImage },
//   { name: 'Kobe Bryant', link: bryantImage },
// ]; 

  //  Сперва импорт картинок в JS может казаться странным. В чистом JS такое работать не будет,
  //  но теперь за все импорты в нашем проекте отвечает Webpack.
  //  Есть и второй способ работать с такими изображениями:

  // теперь картинки можно импортировать,
  // вебпак добавит в переменные правильные пути

// const jordanImage = new URL('./images/jordan.jpg', import.meta.url);
// const jamesImage = new URL('./images/james.jpg', import.meta.url);
// const bryantImage = new URL('./images/bryant.jpg', import.meta.url)

// const whoIsTheGoat = [

  // меняем исходные пути на переменные

//   { name: 'Michael Jordan', image: jordanImage },
//   { name: 'Lebron James', link: jamesImage },
//   { name: 'Kobe Bryant', link: bryantImage },
// ]; 

  //  Этот способ отличается от первого только тем, что работает и без запуска Webpack.
  //  Свойство import.meta.url — служебный параметр, который указывает на адрес файла.