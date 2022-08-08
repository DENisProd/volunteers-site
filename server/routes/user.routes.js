const Router = require("express")
const User = require("../models/User")
const {check, validationResult} = require("express-validator")

const authMiddleware = require("../middleware/auth.middleware")
const uploadMiddleware = require("../middleware/upload.middleware")
const Event = require("../models/Event")
const router = new Router()

router.get('/', authMiddleware, async(req, res) => {

    const userInfoFromDB = await User.findOne({_id: req.user.id}).select({password: 0})
        .populate('createdEvents', {title: 1, description: 1, location: 1, startDate: 1, endDate: 1, created: 1})
        .populate('events', {title: 1, description: 1, location: 1, startDate: 1, endDate: 1, created: 1, img: 1})

    return res.status(200).json(userInfoFromDB)
})

router.post('/avatar', authMiddleware, uploadMiddleware.single('avatar'), async (req, res) => {
    try {
        let user = await User.findById(req.user.id)
        user.avatar = req.file ? req.file.path.replace('uploads\\', '') : ''
        await user.save()

        return res.status(200).json({message: "Фото измененоs"})
    } catch (e) {
        console.log(e)
        return res.status(400).json({message: 'Ошибка при загрузке фото'})
    }
})

router.post('/', authMiddleware,
    [
        check('birthday', "Required a date").isISO8601().toDate(),
        check('phoneNumber', "Phone number not correct").isNumeric({min:11,max:11})
    ], async(req, res) => {

    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: "Uncorrect request", errors})
        }

        const userInfoFromDB = await User.findById(req.user.id)

        userInfoFromDB.birthday = req.body.birthday
        userInfoFromDB.phoneNumber = req.body.phoneNumber

        await userInfoFromDB.save()

        return res.status(200).json({message: 'данные изменены'})
    } catch (e) {
        console.log(e)
        return res.status(400).json({message: 'Ошибка'})
    }


})

router.get('/check', authMiddleware, async (req, res) => {
    const user = await User.findOne({_id:req.user.id})
    if (!user)
        return res.status(404).json({message: "User not found"})

    return res.status(200).json({

        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            coins: user.coins
        }
    })
})

router.get('/top/', async (req, res) => {
    try {
        const users = await User.find({}, {avatar: 1, hours: 1, lastName: 1, firstName: 1, level: 1, takePart: 1, reviews: 1}).sort({hours: -1}).limit(6)
        return res.status(200).json({users})
    } catch(e) {
        console.log(e)
        return res.status(400).json({message: 'Ошибка'})
    }

})

router.get('/:id', authMiddleware, async (req, res) => {
    if(!req.params.id)
        return res.status(400).json({message: "Non correct request"})

    const user = await User.findOne({_id:req.params.id}, {password: 0})
    if (!user)
        return res.status(404).json({message: "User not found"})

    return res.status(200).json({
        user: user
    })

    // {
    //     id: user.id,
    //     email: user.email,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     avatar: user.avatar,
    //     registeredDate: user.registeredDate,
    //     hours: user.hours,
    //     events: user.events,
    //     createdEvents: user.createdEvents
    // }
})

// router.get('/events/:id', authMiddleware, async (req, res) => {
//     try {
//         if(!req.params.id)
//             return res.status(400).json({message: "Non correct request"})

//         const user = await User.findOne({_id:req.params.id})
//         if (!user)
//             return res.status(404).json({message: "User not found"})

//         const events = Event.find({user: {_id: req.params.id}}).exec (function (err, eve) {
//             return res.status(200).json({
//                 createdEvents: eve
//             })
//         });
//     } catch(e) {
//         console.log(e)
//         return res.status(400).json({message: 'Ошибка'})
//     }
    
// })

router.get('/add/hours', authMiddleware, async (req, res) => {
    try {
        // if(!req.query.id || !req.query.count)
        //     return res.status(400).json({message: "Некорректный запрос"})
        //
        // const user = await User.findOne({_id:req.params.id})
        // if (!user)
        //     return res.status(404).json({message: "Пользователь не найден"})
        //
        // Event.find({user: {_id: req.params.id}}).exec (function (err, eve) {
        //     return res.status(200).json({
        //         createdEvents: eve
        //     })
        // });
    } catch(e) {
        console.log(e)
        return res.status(400).json({message: 'Ошибка'})
    }
    
})



module.exports = router