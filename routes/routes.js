const express = require("express")
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const CategoryController = require("../controllers/CategoryController")

// middleware: enable upload images
const upload = require("../middleware/multerMiddleware")

router.get('/product', ProductController.getAll);
router.post('/product', upload.single("image_field"), ProductController.create);
router.put('/product/:id', upload.single("image_field"), ProductController.edit);
router.delete('/product/:id', ProductController.delete);
router.get('/product/:id', ProductController.findById);

router.get('/category', CategoryController.getAll);
router.post('/category', CategoryController.create);
router.put('/category/:id', CategoryController.edit);
router.delete('/category/:id', CategoryController.delete);
router.get('/category/:id', CategoryController.findById);

module.exports = router;