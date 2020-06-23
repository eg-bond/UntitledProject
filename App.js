const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();

app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes')); //роут для авторизации
app.use('/api/todo', require('./routes/todo.routes')); //роут для заметок



const PORT = config.get('port')

async function start() { //функция для подключения к базе данных
    try {
        await mongoose.connect(config.get('mongoUri'), { //подключаемся к БД
            useNewUrlParser: true, //эти параметры нужны для нормального подключения
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    } catch (e) {
        console.log('Server Error:', e.message);
        process.exit(1); //глобальная объект nodeJS который завершает процесс
    }
}

start();

app.listen(PORT, () => console.log(`App started on port ${PORT}...`)) //
