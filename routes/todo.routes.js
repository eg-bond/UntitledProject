const {Router} = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const Todo = require('../models/Todo');
const jwt = require('jsonwebtoken');
const router = Router();

router.post(
    '/sync_todo', //эндпоинт

    async (req, res) => {
        try {

            const {idGenerator, todoListArr, todoContentObj} = req.body
            console.log(idGenerator)
            console.log(todoListArr)
            console.log(todoContentObj)
            const todo = new Todo({idGenerator, todoListArr, todoContentObj});
            console.log(todo)
            await todo.save()

            res.status(201).json({message: 'Синхронизация todo прошла успешно'})

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'}) //посмотреть коды ошибок
        }
    });

router.get(
    '/get_todo', //эндпоинт

    async (req, res) => {
        try {

            const idGenerator = 2

            const todo = await Todo.findOne({idGenerator })

            if (!todo) {
                return res.status(400).json({message: 'Инфа не найдена'})
            }

            const {todoListArr, todoContentObj} = todo

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