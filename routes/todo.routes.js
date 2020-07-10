const {Router} = require('express');
const config = require('config');
const User = require('../models/User');
const Todo = require('../models/Todo');
const jwt = require('jsonwebtoken');
const router = Router();

router.post(
    '/sync_todo', //эндпоинт

    async (req, res) => {
        try {
            const {idGenerator, todoListArr, todoContentObj, token} = req.body

            const decoded = jwt.verify(token, config.get('jwtSecret'))
            const {userId} = decoded

            const user = await User.findOne({_id: userId})
            const todo = await Todo.findOne({owner: userId})

            if (todo) {
                await todo.updateOne({idGenerator, todoListArr, todoContentObj})
            } else {
                const todo = new Todo({idGenerator, todoListArr, todoContentObj, owner: user.id});
                await todo.save()
            }

            res.status(201).json({message: 'Синхронизация todo прошла успешно'})

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'}) //посмотреть коды ошибок
        }
    });

router.post(
    '/get_todo', //эндпоинт

    async (req, res) => {
        try {
            const {token} = req.body

            const decoded = jwt.verify(token, config.get('jwtSecret'))
            const {userId} = decoded

            const todo = await Todo.findOne({owner: userId})

            if (!todo) {
                return res.status(400).json({message: 'Инфа не найдена'})
            }

            const {idGenerator,todoListArr, todoContentObj} = todo

            res.json({
                statusCode: 0,
                message: null,
                todoData: {
                    idGenerator,
                    todoListArr,
                    todoContentObj
                }

            })

        } catch (e) {
            res.status(500).json({
                statusCode: 1,
                message: 'Что-то пошло не так, попробуйте снова',
                todoData: null
            })
        }
    });


module.exports = router;