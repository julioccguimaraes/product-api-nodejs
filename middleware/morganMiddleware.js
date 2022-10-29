const morgan = require("morgan")
const config = require("config")
const Logger = require("../config/logger")

const stream = {
    write: (message) => Logger.http(message)
}

const skip = () => {
    const env = config.get("env") || "development"
    return env !== "development"
}

const morganMiddleware = morgan(
    ":method :url :res[content-lenght] - :response-time ms",
    { stream, skip }
)

module.exports = morganMiddleware
