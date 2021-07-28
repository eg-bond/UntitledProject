const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const router = Router()

// /api/auth/register
router.post(
  '/register', //эндпоинт
  [
    //валидации
    check('email', 'Некорректный email').isEmail(),
  ],
  async (req, res) => {
    //функция регистрации, тут пропишем всю логику обработки регистрационной страницы
    try {
      //асинхронщина, оборачиваем в try .. catch

      const errors = validationResult(req) //присваиваем константе результат валидаций

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(), //.array() - возвращает массив ошибок
          message: 'Некорректные данные при регистрации',
        })
      }

      const { name, lastname, nickname, email, pass } = req.body

      const isEmailUnique = await User.findOne({ email })
      const isNicknameUnique = await User.findOne({ nickname })

      if (isEmailUnique) {
        return res.status(400).json({
          statusCode: 1,
          message: 'Пользователь с таким email уже существует',
        })
      }
      if (isNicknameUnique) {
        return res.status(400).json({
          statusCode: 1,
          message: 'Пользователь с таким nickname уже существует',
        })
      }

      const hashedPassword = await bcrypt.hash(pass, 12) //хешируем пароль

      const user = new User({
        name,
        lastname,
        nickname,
        email,
        pass: hashedPassword,
      }) //создаем пользователя с помощью модели User

      await user.save() //ждем пока новый user сохранится в БД

      res.status(201).json({
        statusCode: 0,
        message: 'Пользователь успешно зарегестрирован',
      }) // после сохранения пользователя выводим сообщение
    } catch (e) {
      res.status(500).json({
        statusCode: 1,
        message: 'Что-то пошло не так, попробуйте снова',
      }) //посмотреть коды ошибок
    }
  }
)

// /api/auth/login
router.post(
  '/login', //эндпоинт
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('pass', 'Введите пароль').exists(), //проверяем, существует ли пароль в форме
  ],
  async (req, res) => {
    //функция регистрации, тут пропишем всю логику обработки регистрационной страницы

    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          statusCode: 1,
          message: 'Некорректные данные при входе в систему',
          errors: errors.array(),
        })
      }

      const { email, pass } = req.body

      const user = await User.findOne({ email })
      if (!user) {
        return res
          .status(400)
          .json({ statusCode: 1, message: 'Пользователь не найден' })
      }

      const isMatch = await bcrypt.compare(pass, user.pass)
      if (!isMatch) {
        return res
          .status(400)
          .json({ statusCode: 1, message: 'Неверный пароль, попробуйте снова' })
      }

      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h',
      })

      res.json({
        statusCode: 0,
        message: '',
        authData: {
          userId: user.id,
          name: user.name,
          lastname: user.lastname,
          nickname: user.nickname,
          email: user.email,
        },
        token,
      })
    } catch (e) {
      res.status(500).json({
        statusCode: 1,
        message: 'Что-то пошло не так, попробуйте снова',
        authData: null,
        token: null,
      })
    }
  }
)

// /api/auth/me
// производит авторизацию по токену
router.post(
  '/me', //эндпоинт
  async (req, res) => {
    try {
      const { token } = req.body

      const decoded = jwt.verify(token, config.get('jwtSecret'))
      const { userId } = decoded

      const user = await User.findOne({ _id: userId })

      res.json({
        statusCode: 0,
        message: '',
        authData: {
          userId: user.id,
          name: user.name,
          lastname: user.lastname,
          nickname: user.nickname,
          email: user.email,
        },
      })
    } catch (e) {
      res.status(500).json({
        statusCode: 1,
        message: 'ошибка',
        authData: null,
      })
    }
  }
)

module.exports = router
