const {Router} = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = Router();


// /api/auth/register
router.post(
    '/register', //эндпоинт
    [ //валидации
        check('email', 'Некорректный email').isEmail()

    ],
    async (req, res) => { //функция регистрации, тут пропишем всю логику обработки регистрационной страницы
        try { //асинхронщина, оборачиваем в try .. catch

            const errors = validationResult(req); //присваиваем константе результат валидаций

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(), //.array() - возвращает массив ошибок
                    message: 'Некорректные данные при регистрации'
                })
            }

            const {name, lastname, nickname, email, pass} = req.body;

            const isEmailUnique = await User.findOne({email});
            const isNicknameUnique = await User.findOne({nickname});

            if (isEmailUnique) {
                return res.status(400).json({message: 'Пользователь с таким email уже существует'})
            }
            if (isNicknameUnique) {
                return res.status(400).json({message: 'Пользователь с таким nickname уже существует'})
            }

            const hashedPassword = await bcrypt.hash(pass, 12); //хешируем пароль

            // const user = new User({name, lastname, nickname, email, pass: hashedPassword}); //создаем пользователя с помощью модели User
            const user = new User({name, lastname, nickname, email, pass: hashedPassword}); //создаем пользователя с помощью модели User

            await user.save(); //ждем пока новый user сохранится в БД

            res.status(201).json({message: 'Пользователь успешно зарегестрирован'})// после сохранения пользователя выводим сообщение

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'}) //посмотреть коды ошибок
        }
    });

// /api/auth/login
router.post(
    '/login', //эндпоинт
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('pass', 'Введите пароль').exists() //проверяем, существует ли пароль в форме
    ],
    async (req, res) => { //функция регистрации, тут пропишем всю логику обработки регистрационной страницы

        try { //асинхронщина, оборачиваем в try .. catch
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                })
            }

            const {email, pass} = req.body

            const user = await User.findOne({email})
            if (!user) {
                return res.status(400).json({message: 'Пользователь не найден'})
            }

            const isMatch = await bcrypt.compare(pass, user.pass)
            if (!isMatch) {
                return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
            }

            const token = jwt.sign(
                {email: user.email},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            );

            res.json({token, userId: user.id, name: user.name, lastname: user.lastname,
                nickname: user.nickname, email: user.email}) //по умолчанию статус 200, поэтому тут не пишем

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'}) //посмотреть коды ошибок
        }
    });

// /api/auth/me
router.post(
    '/me', //эндпоинт
    async (req, res) => { //функция регистрации, тут пропишем всю логику обработки регистрационной страницы

        try {
            const {token} = req.body

            const decoded = jwt.verify(token, config.get('jwtSecret'))
            const {email} = decoded

            const user = await User.findOne({email})

            res.json({userId: user.id, name: user.name, lastname: user.lastname,
                nickname: user.nickname, email: user.email}) //по умолчанию статус 200, поэтому тут не пишем

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'}) //посмотреть коды ошибок
        }
    });

module.exports = router;