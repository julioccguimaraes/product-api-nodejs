const knex = require("../config/db")
const Logger = require("../config/logger")

class Category {
    async new(category) {
        const { name } = category

        try {
            // add new category
            await knex.insert({ name }).table("categories")
        } catch (err) {
            Logger.error(err)
        }
    }

    async update(id, category) {
        try {
            // update category
            await knex.update(category).where({ category_id: id }).table("categories")
            return { status: true }
        } catch (err) {
            return { status: false, err: err }
        }
    }

    async delete(id) {
        const category = await this.findById(id)

        if (category) {
            try {
                // delete category
                await knex.delete(category).where({ category_id: id }).table("categories")

                // delete category in products
                await knex.where({ category_id: id }).table("product_to_category").delete()

                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }
        } else {
            return { status: false, err: "Category does not exist!" }
        }
    }

    async findAll() {
        try {
            const result = await knex.select(["category_id", "name"]).table("categories")
            return result
        } catch (err) {
            Logger.error(err)
            return []
        }
    }

    async findById(id) {
        try {
            const result = await knex.select(["category_id", "name"]).where({ category_id: id }).table("categories")

            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }
        } catch (err) {
            Logger.error(err)
            return undefined
        }
    }

    async findByName(name) {
        try {
            const result = await knex.select("*").where({ name: name }).table("categories")

            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }
        } catch (err) {
            Logger.error(err)
            return undefined
        }
    }
}

module.exports = new Category()