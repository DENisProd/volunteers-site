const multer = require('multer')
const uuid = require('uuid')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (file.fieldname === "profile") {
            cb(null, 'uploads/profiles/')
        } else {
            cb(null, 'uploads/')
        }
    },
    filename(req, file, cb) {

        if (file.fieldname === "profile") {
            cb(null, `${uuid.v4()}_profile.jpg`)
            console.log("it is profile")
        } else {
            cb(null, `${uuid.v4()}.jpg`)
        }
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const limits = {
    fileSize: 1024 * 1024 * 5
}


module.exports = multer({storage, fileFilter, limits})