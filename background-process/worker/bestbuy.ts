import { log } from "@blitzjs/display"
import { Prisma, PrismaClient } from "@prisma/client"
import getRedisConnection from "background-process/connection"
import bestBuyQueue from "background-process/queue/bestbuy"
import {
  BestBuyCategory,
  BestBuyProduct,
  BestBuyQueryPayload,
  BEST_BUY_QUEUE,
} from "background-process/types/bestbuy"
import { REPEATABLE_JOB_ID } from "background-process/types/default"
import { Job, Worker } from "bullmq"
import * as currencyFormatter from "currency-formatter"
import categories from "data/extraction/bestbuy/categories.json"
import mapping from "data/extraction/bestbuy/mapping.json"
import FirebaseDatabase from "firebase/FirebaseDatabase"
import elasticSearchLogger from "integrations/elk/logger"
import moment from "moment"
import timer from "utils/timer"

const db = new PrismaClient()
const MAX_PAGE_SIZE = 100 // MAX in Bestbuy API
class Bestbuy {
  private static bby

  static async getBestBuy() {
    if (this.bby) return this.bby

    const bestbuyRecord = await db.bestbuy.findFirst({
      select: {
        apiKey: true,
      },
    })

    if (!bestbuyRecord) {
      return null
    }

    const { apiKey } = bestbuyRecord

    this.bby = require("bestbuy")(apiKey)

    return this.bby
  }
}

const addProductsToUniverse = async (products: BestBuyProduct[], underwriterClassId: string) => {
  log.info(`Product: ${products.length} products has been retrienved for payload `)

  await Promise.all(
    products.map(async (product) => {
      // adding product to firebase
      //await addProductToFirebase(product)

      // adding products to PostgreSql database
      const date = product.releaseDate ? moment(product.releaseDate, "YYYY-MM-DD") : null

      const payload: Prisma.UniverseCreateInput = {
        name: product[mapping.name],
        brand: product[mapping.manufacturer],
        productId: `${product.sku}`,
        source: "BEST_BUY",
        underwriterClassId,
        categories: product[mapping.categoryPath].map((category) => category.name),
        description: product[mapping.shortDescription],
        manufactureDate: date?.toISOString(),
        manufactureDateStr: date?.format("MMMM YYYY"),
        variant: product[mapping.color],
        // valueHistory: {
        //   create: {
        //     assetValue: product[mapping.salePrice],
        //     source: "api.bestbuy.com",
        //   },
        // },
      }
      await addProductsToSql(payload, product[mapping.salePrice])
    })
  )
}

const addProductsToSql = async (
  payload: Prisma.UniverseCreateInput,
  newAssetValue: number | string
) => {
  const currentProduct = await db.universe.findFirst({
    where: {
      productId: `${payload.productId}`,
    },
    select: {
      id: true,
      valueHistory: {
        select: {
          assetValue: true,
        },
        orderBy: [
          {
            updatedAt: "asc",
          },
        ],
      },
    },
  })
  const newPrice = newAssetValue
    ? currencyFormatter.unformat(`${newAssetValue}` || "0", { code: "SGD" })
    : -1

  if (newPrice < 0)
    return log.warning(`Stopping for BestBuy newProduct:${payload.productId} price not available`)
  payload.valueHistory = {
    create: {
      assetValue: newPrice,
      source: "api.bestbuy.com",
    },
  }
  Object.assign(payload, { latestValue: newPrice })
  try {
    if (currentProduct) {
      //testing start
      if (currentProduct?.valueHistory?.slice(-1)[0]?.assetValue === newPrice)
        return log.warning(
          `Stopping for BestBuy currentProduct:${currentProduct.id} newProduct:${payload.productId} both are having same value:${newPrice} for today`
        )
      await db.universe.update({
        data: {
          ...payload,
        } as any,
        // can you hear me?
        where: {
          id: currentProduct.id,
        },
      })
      log.info(
        `[Bestbuy Worker - Local] Updated Product: ${payload.name} with SKU: ${payload.productId}`
      )
      elasticSearchLogger.info(
        `[Bestbuy Worker - Local] Updated Product: ${payload.name} with SKU: ${payload.productId}`,
        payload
      )
    } else {
      await db.universe.create({
        data: {
          ...payload,
        } as any,
      })
      // testing end
      log.info(
        `[Bestbuy Worker - Local] Added Product: ${payload.name} with SKU: ${payload.productId}`
      )
      elasticSearchLogger.info(
        `[Bestbuy Worker - Local] Added Product: ${payload.name} with SKU: ${payload.productId}`,
        payload
      )
    }
  } catch (e) {
    log.error("[Bestbuy Worker - Local] Error Adding New Product " + e.message)
    elasticSearchLogger.error(
      `[Bestbuy Worker - Local] Error Adding New Product => ${e.message}`,
      payload
    )
  }
}

const addProductToFirebase = async (product: BestBuyProduct) => {
  const date = product.releaseDate ? moment(product.releaseDate, "YYYY-MM-DD") : null

  const payload = {
    name: product[mapping.name],
    brand: product[mapping.manufacturer],
    productId: `${product.sku}`,
    source: "BEST_BUY",
    underwriterClassId:
      product[mapping.categoryPath][product[mapping.categoryPath].length - 1]?.name || "N/A",
    categories: product[mapping.categoryPath].map((category) => category.name),
    description: product[mapping.shortDescription],
    manufactureDate: date?.toISOString() ?? null,
    manufactureDateStr: date?.format("MMMM YYYY") ?? null,
    variant: product[mapping.color],
    valueHistory: [
      {
        retrievalDate: moment().toISOString(),
        assetValue: product[mapping.salePrice],
        source: "api.bestbuy.com",
      },
    ],
  }

  try {
    const fb = FirebaseDatabase.getInstance()
    const docRef = fb.collection("Universe-BestBuy").doc(payload.productId.toString())
    const doc = await docRef.get()
    if (doc.exists) {
      let oldPayload = doc.data() || {}
      payload.valueHistory = [...payload.valueHistory, ...oldPayload?.valueHistory]
      docRef.update(payload)
      elasticSearchLogger.info(
        `[Bestbuy Worker - Firebase] Updated Product: ${payload.name} with SKU: ${payload.productId}`,
        payload
      )
    } else {
      docRef.set(payload)
      elasticSearchLogger.info(
        `[Bestbuy Worker - Firebase] Added Product: ${payload.name} with SKU: ${payload.productId}`,
        payload
      )
    }
  } catch (e) {
    log.info(e)
    elasticSearchLogger.error(
      `[Bestbuy Worker - Firebase] Error pushing product to firebase => ${e.message}`,
      payload
    )
  }
}

const processBestBuyJob = async (job: Job<BestBuyCategory, any, string>) => {
  /* Start Processing Bestbuy Extraction */

  const category = job.data

  log.info("[Bestbuy Worker] Working on Category: " + category.id)

  /**
   * Comments
   */

  const bestbuy = await Bestbuy.getBestBuy()

  // If the connection is null, don't do anything

  if (!bestbuy) {
    log.error("[Bestbuy Worker] Unable to connect to bestbuy!")
    elasticSearchLogger.error(`[Bestbuy Worker] Unable to connect to bestbuy!`, {
      category,
    })
    return
  }

  /* Meta Data */
  const pageSize = MAX_PAGE_SIZE
  let currentPage = 1
  const show = Object.values(mapping).join(",")
  try {
    let products: BestBuyQueryPayload = await bestbuy.products(`(categoryPath.id=${category.id})`, {
      show: show,
      pageSize,
    })

    log.info(
      `[BESTBUY] on page:${products.currentPage} products-length:${products.products.length}`
    )

    for (let el of products.products) {
      log.info(
        `[BESTBUY] name:${el.name} {and} catetoryPath:${el.categoryPath.map((e) => e.id).join(",")}`
      )
    }

    await addProductsToUniverse(products.products, category.name)

    let totalPages = products.totalPages
    log.info(`id:${category.id}  pages length:${totalPages}`)

    for (let page = currentPage + 1; page <= totalPages; page++) {
      await timer(60)

      products = await bestbuy.products(`(categoryPath.id=${category.id})`, {
        show: show,
        page,
        pageSize,
      })
      log.info(`[BESTBUY] on page:${page} products-length:${products.products.length}`)

      for (let el of products.products) {
        log.info(
          `[BESTBUY] name:${el.name} {and} catetoryPath:${el.categoryPath
            .map((e) => e.id)
            .join(",")}`
        )
      }

      await addProductsToUniverse(products.products, category.name)
    }

    log.success(
      `[Bestbuy Worker] Finished Data Extraction for Category ${category.name} (${category.id})`
    )
    elasticSearchLogger.info(
      `[Bestbuy Worker Success] Finished Data Extraction for Category ${category.name} (${category.id})`
    )
  } catch (err) {
    log.info(`error:${JSON.stringify(err)}`)
  }
}

const enqueueCategories = async () => {
  const record = await db.bestbuy.findFirst({
    select: {
      categories: true,
    },
  })

  if (record) {
    await Promise.all(
      record.categories.map(async (catId: string) => {
        const category = categories.find((cat) => cat.id === catId)
        if (category) {
          await bestBuyQueue.add(`processBestbuyCategory-${category.id}`, category, {
            delay: 5000,
          })
          log.info(`[Bestbuy Worker] Enqueued: ${category.name}`)
        }
      })
    )
  }
}

const bestBuyWorker = new Worker(
  BEST_BUY_QUEUE,
  async (job: Job<BestBuyCategory, any, string>) => {
    if (job.data.id === REPEATABLE_JOB_ID) {
      enqueueCategories()
    } else if (process.env.ENABLE_BESTBUY_EXTRACTION === "true") {
      try {
        processBestBuyJob(job)
      } catch (e) {
        elasticSearchLogger.error("[Bestbuy Worker Error]: " + e.message, e)
      }
    }
  },
  {
    connection: getRedisConnection(),
    limiter: {
      max: 1,
      // duration: 30 * 60 * 1000,  // 30 minutes
      duration: 10000, // 10 seconds
    },
  }
)

export default bestBuyWorker
