// enable upload files
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "assets/images/product/")
    },
    filename: function(req, file, callback) {
        const ext = path.extname(file.originalname)

        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.svg') {
            return callback(new Error('Only images are allowed'))
        }

        callback(null, file.originalname + Date.now() + ext)
    }
})

const upload = multer({storage})

module.exports = upload