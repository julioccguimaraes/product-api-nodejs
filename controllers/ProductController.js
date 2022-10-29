const Product = require("../models/Product")

class ProductController {
    async getAll(req, res) {
        const products = await Product.findAll()
        res.json(products)
    }

    async create(req, res) {
        const { name, sku } = req.body

        if (!name || name.length < 2 || name.length > 255) {
            res.status(400)
            res.json({ err: "Name is invalid! Name must be greater than 2 and less than 255 characters!" })
            return 
        }

        if (!sku || sku.length < 1 || sku.length > 255) {
            res.status(400)
            res.json({ err: "SKU is invalid! SKU must be greater than 1 and less than 255 characters!" })
            return
        }

        const SKUExists = await Product.findSKU(sku)

        if (SKUExists) {
            res.status(400)
            res.json({ err: "SKU is already registered!" })
            return
        }

        let image = ''

        if (req.file) {
            image = req.file.path
        }

        await Product.new({...req.body, image})

        res.status(200)
        res.send("Product created!")
    }

    async edit(req, res) {
        const { name, sku } = req.body

        if (name && (name.length < 1 || name.length > 255)) {
            res.status(400)
            res.json({ err: "Name is invalid! Name must be greater than 2 and less than 255 characters!" })
            return
        }

        if (sku && (sku.length < 1 || sku.length > 255)) {
            res.status(400)
            res.json({ err: "SKU is invalid! SKU must be greater than 1 and less than 255 characters!" })
            return
        }

        const id = req.params.id
        const product = await Product.findById(id)

        if (product) {
            if (sku) {
                const SKUExists = await Product.findSKU(sku)

                if (product.sku != sku && SKUExists) {
                    res.status(400)
                    res.json({ err: "SKU is already registered!" })
                    return
                }
            }

            let image = ''

            if (req.file) {
                image = req.file.path
            }

            const result = await Product.update(id, {...req.body, image})

            if (result.status) {
                res.status(200)
                res.send("Product updated!")
            } else {
                res.status(406)
                res.json({ err: result.err })
            }
        } else {
            res.status(404)
            res.json({ err: "Product does not exist!" })
        }
    }

    async delete(req, res) {
        const id = req.params.id
        const result = await Product.delete(id)

        if (result.status) {
            res.status(200)
            res.send("Product deleted!")
        } else {
            res.status(406)
            res.json({ err: result.err })
        }
    }

    async findById(req, res) {
        const id = req.params.id
        const product = await Product.findById(id)

        if (product) {
            res.status(200)
            res.json(product)
        } else {
            res.status(404)
            res.json({})
        }
    }
}

module.exports = new ProductController()