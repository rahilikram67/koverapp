import dotenv from "dotenv"
import winston from "winston"
import { ElasticsearchTransport } from "winston-elasticsearch"

dotenv.config()

const esTransport = new ElasticsearchTransport({
  indexPrefix: "koverapp",
  indexSuffixPattern: "DD.MM.YYYY",
  clientOpts: {
    node: process.env.ELASTIC_SEARCH_ENDPOINT,
    auth: {
      username: process.env.ELASTIC_SEARCH_USERNAME || "",
      password: process.env.ELASTIC_SEARCH_PASSWORD || "",
    },
  },
})

const elasticSearchLogger = winston.createLogger({
  transports: [esTransport],
})

elasticSearchLogger.on("error", (error) => {
  console.error("Error in logger caught", error)
})
esTransport.on("error", (error) => {
  console.error("Error in logger caught", error)
})

export default elasticSearchLogger
