const knex = require("../config/db")
const Logger = require("../config/logger")

class Product {
    async new(product) {
        const { name, sku, price, description, quantity, image, categories } = product

        try {
            // add product
            knex.insert({ name, sku, price, description, quantity, image }, ['product_id']).into("products")
                .then(function (result) {
                    // add categories to product
                    categories.forEach(async function (category_id) {
                        await knex.insert({ product_id: result[0], category_id }).table("product_to_category")
                    })
                })
        } catch (err) {
            Logger.error(err)
        }
    }

    async update(id, product) {
        const { name, sku, price, description, quantity, categories } = product

        try {
            // update product
            await knex.update({ name, sku, price, description, quantity }).where({ product_id: id }).table("products")

            // update image
            if (product.image) {
                this.updateImage(id, product.image)
            }

            // delete old product categories
            await knex.where({ product_id: id }).table("product_to_category").delete()

            // add new categories to product
            categories.forEach(async function (category_id) {
                await knex.insert({ product_id: id, category_id }).table("product_to_category")
            })

            return { status: true }
        } catch (err) {
            return { status: false, err: err }
        }
    }

    async delete(id) {
        const product = await this.findById(id)

        if (product) {
            try {
                // delete product
                await knex.delete(product).where({ product_id: id }).table("products")

                // delete product categories
                await knex.where({ product_id: id }).table("product_to_category").delete()
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }
        } else {
            return { status: false, err: "Product does not exist!" }
        }
    }

    async findAll() {
        try {
            const result = await knex.select('*').table("products")
            return result
        } catch (err) {
            Logger.error(err)
            return []
        }
    }

    async getProductCategories(id) {
        try {
            const result = await knex.select('c.*').table("product_to_category as p2c").where('p2c.product_id', id).leftJoin('categories as c', 'p2c.category_id', 'c.category_id')

            return result
        } catch (err) {
            Logger.error(err)
            return []
        }
    }

    async findById(id) {
        try {
            const result = await knex.select('*').where({ product_id: id }).table("products")

            // get product categories
            const categories = await this.getProductCategories(id)

            if (result.length > 0) {
                // return the product and its categories
                return { ...result[0], categories }
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
            const result = await knex.select("*").where({ name: name }).table("products")

            // get product categories
            const categories = await this.getProductCategories(id)

            if (result.length > 0) {
                // return the product and its categories
                return { ...result[0], categories }
            } else {
                return undefined
            }
        } catch (err) {
            Logger.error(err)
            return undefined
        }
    }

    async findSKU(sku) {
        try {
            const result = await knex.select("*").from("products").where({ sku: sku })

            if (result.length > 0) {
                return true
            } else {
                return false
            }
        } catch (err) {
            Logger.error(err)
            return false
        }
    }

    async updateImage(id, image) {
        try {
            await knex.update({ image }).where({ product_id: id }).table("products")
        } catch (err) {
            Logger.error(err)
        }
    }
}

module.exports = new Product()