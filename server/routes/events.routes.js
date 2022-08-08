const Router = require("express")
const Event = require("../models/Event")
const config = require("config")
const {check, validationResult} = require("express-validator")
const authMiddleware = require("../middleware/auth.middleware")
const uploadMiddleware = require("../middleware/upload.middleware")
const router = new Router()
const uuid = require('uuid')
const eventController = require("../controllers/eventController")
const eventPanelController = require("../controllers/eventPanelController")

const Organization = require("../models/Organization")
const blurAuthMiddleware = require("../middleware/blurAuth.middleware")

router.post('/:id', authMiddleware, uploadMiddleware.single('file'), async(req, res) => {
    try {
        const {
            title, description, location, startDate, endDate, tags, difficulty, participateWays,
            vacancySphere, workType, vacancyName, requirements, tasks, deadlines, age, contactEmail,
            conditions, salary, fullDescription,
            awards, coins, services
        } = req.body

        if (!req.params.id) return res.status(400).json({message: 'некорректный запрос'}) 
        let org = await Organization.findById(req.params.id)
        if (!org) return res.status(400).json({message: 'некорректный запрос'}) 
        
        const link = uuid.v4()
        const event = new Event({
            img: req.file ? req.file.path.replace('uploads\\','') : '',
            title, description, location, startDate, tags, difficulty, participateWays,
            fullInfo: {
                company: org.name, 
                vacancySphere, workType, vacancyName, requirements, tasks, deadlines, age, contactEmail, fullDescription
            },
            workInfo: {
                conditions, salary,
            },
            helperInfo: {
                awards, coins, services
            },
            author: req.params.id,
            presenseLink: link
        })

        org.createdEvents.push(event._id.toString())

        await org.save()
        await event.save()

        return res.status(201).json({message: "Мероприятие создано"})

    } catch (e) {
        console.log(e)
        return res.status(400).json({message: "Ошибка при создании мероприятия"})
    }
})

router.delete('/:id', authMiddleware, eventController.delete)


router.get('/', eventController.getAll)
router.get('/search/text', eventController.search)
router.get('/sort', eventController.sort)
router.get('/panel/:id', authMiddleware, eventPanelController.getInfo)
router.post('/panel/hours/:id', authMiddleware, eventPanelController.addHours)
router.post('/panel/persense/:link', authMiddleware, eventPanelController.setPersenseToUser)
router.get('/subs/:id', authMiddleware, eventPanelController.subscribe)
router.get('/persense/params', authMiddleware, eventPanelController.setPersense)
router.get('/:id', blurAuthMiddleware, eventController.getAll)


module.exports = router