/* Using BullMQ */

import IORedis from "ioredis"

const getRedisConnection = (): IORedis.Redis => {
  return new IORedis({
    host: process.env.REDIS_HOST || "127.0.0.1", // Redis host
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379, // Redis port
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
  })
}

export default getRedisConnection
