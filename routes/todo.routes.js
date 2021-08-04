const { Router } = require('express')
const config = require('config')
const User = require('../models/User')
const Todo = require('../models/Todo')
const jwt = require('jsonwebtoken')
const router = Router()

router.post(
  '/sync_todo', //эндпоинт

  async (req, res) => {
    try {
      const { idGenerator, todoTitles, todoContent, token } = req.body

      const decoded = jwt.verify(token, config.get('jwtSecret'))
      const { userId } = decoded

      const user = await User.findOne({ _id: userId })
      const todo = await Todo.findOne({ owner: userId })

      if (todo) {
        await todo.updateOne({ idGenerator, todoTitles, todoContent })
      } else {
        const todo = new Todo({
          idGenerator,
          todoTitles,
          todoContent,
          owner: user.id,
        })
        await todo.save()
      }

      res
        .status(201)
        .json({ statusCode: 0, message: 'Синхронизация todo прошла успешно' })
    } catch (e) {
      res.status(500).json({
        statusCode: 1,
        message: 'Что-то пошло не так, попробуйте снова',
      })
    }
  }
)

router.post(
  '/get_todo', //эндпоинт

  async (req, res) => {
    try {
      const { token } = req.body

      const decoded = jwt.verify(token, config.get('jwtSecret'))
      const { userId } = decoded

      const todo = await Todo.findOne({ owner: userId })

      if (!todo) {
        return res.status(204).json({
          statusCode: 11,
          message: 'todo is empty',
        })
      }

      const { idGenerator, todoTitles, todoContent } = todo

      res.json({
        statusCode: 0,
        message: 'TodoData успешно загружены с сервера',
        todoData: {
          idGenerator,
          todoTitles,
          todoContent,
        },
      })
    } catch (e) {
      res.status(500).json({
        statusCode: 1,
        message: 'Что-то пошло не так, попробуйте снова',
        todoData: null,
      })
    }
  }
)

module.exports = router
