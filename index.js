const express = require("express")
const app = express()

const router = require("./routes/routes")
const bodyParser = require('body-parser')
const Logger = require("./config/logger")
const cors = require("./middleware/cors")
const morganMiddleware = require("./middleware/morganMiddleware")
const config = require("config")

// middlewares
// enable cross-origin resource sharing
app.use(cors)
// requisition log
app.use(morganMiddleware)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// routes
app.use("/", router);

const serverPort = config.get("serverPort") || 3000

app.listen(serverPort, () => {
    Logger.info("server is running")
});