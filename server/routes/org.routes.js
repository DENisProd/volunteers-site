const Router = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const blurAuthMiddleware = require ("../middleware/blurAuth.middleware")
const uploadMiddleware = require("../middleware/upload.middleware")
const Organization = require("../models/Organization")
const router = new Router()
const organizationController = require("../controllers/organizationController")

router.get('/', authMiddleware, organizationController.getAllByUser)
router.get('/:id', blurAuthMiddleware, organizationController.getById)
router.post('/', authMiddleware, uploadMiddleware.single('file'), organizationController.create)

router.patch('/:id', authMiddleware, async (req, res) => {
    try{
        if(!req.params.id)
            return res.status(400).json({message: 'Некорректный запрос'})

        const {description, location, email, telegram, phone, img} = req.body
        
        const organization = await Organization.findOne({_id: req.params.id})
        if (!organization)
            return res.status(400).json({message: 'Организации с таким id не существует'})

        organization.description = description
        organization.location = location
        organization.email = email
        organization.telegram = telegram
        organization.phoneNumber = phone
        organization.img = img

        await organization.save()

        return res.status(201).json({message:'Организация создана'})

    } catch (e) {
        console.log(e)
        return res.status(400).json({message: 'Ошибка'})
    }
})

module.exports = router