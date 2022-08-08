const Router = require("express")
const Product = require("../models/Product")
const authMiddleware = require("../middleware/auth.middleware")
const uploadMiddleware = require("../middleware/upload.middleware")
const ShopController = require("../controllers/shopController")
const router = new Router()


router.post('/:id', authMiddleware, uploadMiddleware.single('shop-preview'), ShopController.create)
router.post('/image/:id', authMiddleware, uploadMiddleware.single('shop-preview'), ShopController.addImage)
router.delete('/:id', authMiddleware, ShopController.deleteOne)
router.get('/', authMiddleware, ShopController.getAll)
router.get('/:id', authMiddleware, ShopController.getOne)
router.get('/buy/:id', authMiddleware, ShopController.buy)

module.exports = router