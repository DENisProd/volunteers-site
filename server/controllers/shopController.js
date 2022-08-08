const Product = require("../models/Product");
const Organization = require("../models/Organization")
const User = require("../models/User")

class shopController {
    async create(req, res) {
        try {
            const {
                name, description, price, delivery
            } = req.body

            if (!req.params.id) return res.status(400).json({message: 'некорректный запрос'})
            let org = await Organization.findById(req.params.id)
            if (!org) return res.status(400).json({message: 'некорректный запрос'})

            const product = new Product({
                img: req.file ? req.file.path.replace('uploads\\', '') : '',
                name, description, price, delivery,
                contactUser: req.user.id,
                contactOrganization: req.params.id
            })

            await product.save()

            return res.status(201).json({message: "Товар создан"})

        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Ошибка при создании товара"})
        }
    }

    async getAll(req, res) {
        try {
            const prods = await Product.find({}, {contactUser: 0}).populate('contactOrganization', {name: 1, telegram: 1, id: 1})
            return res.status(200).json({
                prods
            })

        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Ошибка при получении товаров"})
        }
    }

    async getOne(req, res) {
        try {
            if (!req.params.id) return res.status(400).json({message: "Некорректный запрос"})
            let prods = await Product.findById(req.params.id).populate('contactOrganization', {name: 1, telegram: 1, id: 1})
            prods.views++
            await prods.save()
            if(prods.contactUser.toString()===req.user.id) {
                return res.status(200).json({
                    prod: {
                        id: prods._id,
                        contactOrganization: prods.contactOrganization,
                        createdDate: prods.createdDate,
                        delivery: prods.delivery,
                        description: prods.description,
                        images: prods.images,
                        img: prods.img,
                        name: prods.name,
                        price: prods.price,
                        views: prods.views | 0,
                        buyCount: prods.buyCount | 0
                    },
                    isCreator: true
                })
            } else {
                return res.status(200).json({
                    prod: {
                        id: prods._id,
                        contactOrganization: prods.contactOrganization,
                        createdDate: prods.createdDate,
                        delivery: prods.delivery,
                        description: prods.description,
                        images: prods.images,
                        img: prods.img,
                        name: prods.name,
                        price: prods.price,
                    }
                })
            }

        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Ошибка при получении товара"})
        }
    }

    async addImage(req, res) {
        try {
            if (!req.params.id) return res.status(400).json({message: "Некорректный запрос"})
            let prod = await Product.findById(req.params.id)
            if (!prod) return res.status(400).json({message: 'некорректный запрос'})
            if (prod.contactUser.toString()!==req.user.id)  return res.status(400).json({message: "У вас нет прав"})
            prod.images.push(req.file ? req.file.path.replace('uploads\\', '') : '')
            await prod.save()

            return res.status(201).json({message: "Изображение добавлено"})

        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Ошибка при добавлении изображения"})
        }
    }

    async deleteOne(req, res) {
        try {
            if (!req.params.id) return res.status(400).json({message: "Некорректный запрос"})

            const prod = await Product.findById(req.params.id)
            if (!prod) return res.status(400).json({message: "Товар не найден"})
            if (prod.contactUser.toString()!==req.user.id)  return res.status(400).json({message: "У вас нет прав"})
            await Product.deleteOne({_id: req.params.id})
            return res.status(200).json({message: "Товар удален"})

        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Ошибка при создании товара"})
        }
    }

    async buy(req, res) {
        try {
            if (!req.params.id) return res.status(400).json({message: "Некорректный запрос"})

            let prod = await Product.findById(req.params.id)
            if (!prod) return res.status(400).json({message: "Товар не найден"})
            let user = await User.findById(req.user.id)

            if (user.coins>=prod.price) {
                user.coins-=prod.price
                user.buyedItems.push(prod._id)
                await user.save()
                return res.status(200).json({message: "Вы купили товар"})
            }
            return res.status(400).json({message: "Недостаточно средств на счету"})

        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Ошибка при покупке товара"})
        }
    }

    isProdExists(id) {
        const prod = Product.findById(id)
        if (prod) return true
        return false
    }
}

module.exports = new shopController()