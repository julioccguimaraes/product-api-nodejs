const Category = require("../models/Category")

class CategoryController {
    async getAll(req, res) {
        const categories = await Category.findAll()
        res.json(categories)
    }

    async create(req, res) {
        const { name } = req.body

        if (!name || name.length < 2 || name.length > 255) {
            res.status(400)
            res.json({ err: "Name is invalid! Name must be greater than 2 and less than 255 characters!" })
            return
        }

        await Category.new(req.body)

        res.status(200)
        res.send("Category created!")
    }

    async edit(req, res) {
        const { name } = req.body

        if (name && (name.length < 2 || name.length > 255)) {
            res.status(400)
            res.json({ err: "Name is invalid! Name must be greater than 2 and less than 255 characters!" })
            return
        }

        const id = req.params.id
        const category = await Category.findById(id)

        if (category) {
            const result = await Category.update(id, req.body)

            if (result.status) {
                res.status(200)
                res.send("Category updated!")
            } else {
                res.status(406)
                res.json({ err: result.err })
            }
        } else {
            res.status(404)
            res.json({ err: "Category does not exist!" })
        }
    }

    async delete(req, res) {
        const id = req.params.id
        const result = await Category.delete(id)

        if (result.status) {
            res.status(200)
            res.send("Category deleted!")
        } else {
            res.status(406)
            res.json({ err: result.err })
        }
    }

    async findById(req, res) {
        const id = req.params.id
        const category = await Category.findById(id)

        if (category) {
            res.status(200)
            res.json(category)
        } else {
            res.status(404)
            res.json({})
        }
    }
}

module.exports = new CategoryController()