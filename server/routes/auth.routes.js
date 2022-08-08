const Router = require("express")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const config = require("config")
const jwt = require("jsonwebtoken")
const {check, validationResult} = require("express-validator")
const router = new Router()

router.post('/registration',
    [
        check('email', "Некорректный email").isEmail(),
        check('password', "Длина пароля должна быть больше 3 и меньше 12 символов").isLength({min:3,max:12})
    ],
    async(req, res) => {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Некорректный запрос", errors})
            }

            const {email, password, password1, firstName, lastName, birthday} = req.body

            const candidate = await User.findOne({email})

            if (candidate)
                return res.status(400).json({message: `Пользователь с такой почтой уже существует`})

            if (password!==password1)
                return res.status(400).json({message: `Пароли не совпадают`})

            const hashPassword = await bcrypt.hash(password, 8)
            const user = new User({email, password: hashPassword, firstName, lastName, birthday})
            await user.save()

            return res.status(201).json({message: "Вы успешно зарегистрировались"})
        } catch (e) {
            res.send({message: "Ошибка сервера"})
        }
    })


router.post('/login',
    async(req, res) => {
        try {
            const {email, password} = req.body

            const user = await User.findOne({email})
            if (!user)
                return res.status(404).json({message: "Пользователь не найден"})

            const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid)
                return res.status(400).json({message: "Неверный пароль"})

            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "5h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar,
                    coins: user.coins
                }
            })

        } catch (e) {
            res.send({message: "Ошибка сервера"})
        }
    })

module.exports = router