import { log } from "@blitzjs/display"
import { Prisma, PrismaClient } from "@prisma/client"
import getRedisConnection from "background-process/connection"
import harrodsQueue from "background-process/queue/harrods"
import { REPEATABLE_JOB_NAME } from "background-process/types/default"
import {
  HarrodsCategory,
  HarrodsProduct,
  HARRODS_QUEUE,
  SubProductBody,
} from "background-process/types/harrods"
import { Job, Worker } from "bullmq"
import * as cheerio from "cheerio"
import * as currencyFormatter from "currency-formatter"
import { default as categories, default as harrods } from "data/extraction/harrods/categories.json"
import mapping from "data/extraction/harrods/mapping.json"
import FirebaseDatabase from "firebase/FirebaseDatabase"
import elasticSearchLogger from "integrations/elk/logger"
import moment from "moment"
import puppeteer from "puppeteer"
import timer from "utils/timer"

const db = new PrismaClient()

const addProductToUniverse = async (product: HarrodsProduct) => {
  const { productId } = product

  const currentProduct = await db.universe.findFirst({
    where: {
      productId: `${productId}`,
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

  const newPrice = product.price
    ? currencyFormatter.unformat(product.price || "0", { code: "SGD" })
    : -1

  const lastValue = currentProduct?.valueHistory.slice(-1)[0]

  // Below it checks if the same asset value is stored last time, then we won't be adding a new entry.
  if (currentProduct?.valueHistory?.slice(-1)[0]?.assetValue === newPrice)
    return log.info(
      `Stopping for Harrods currentProduct:${currentProduct.id} newProduct:${product.productId} both are having same value:${newPrice} for today`
    )
  if (newPrice < 0)
    return log.info(`Stopping for Harrods newProduct:${product.productId} price not available`)

  //adding harrods product to firebase
  //await addProductToFirebase(product)

  //adding harrods product to postgresql

  //testing start
  const payload: Prisma.UniverseCreateInput = {
    name: product.name,
    brand: product.brand,
    productId: product.productId,
    source: "HARRODS",
    underwriterClassId: product.underwriterClassId,
    categories: product.categories,
    variant: product.variant,
    valueHistory: {
      create: {
        assetValue: newPrice,
        source: product.source,
      },
    },
  }
  //testing end
  Object.assign(payload, { latestValue: newPrice })
  try {
    if (currentProduct) {
      await db.universe.update({
        data: {
          ...payload,
        } as any,
        where: {
          id: currentProduct.id,
        },
      })

      log.info(
        `[Harrods Worker - Local] Updated Product: ${product.name} with URL: ${product.productId}`
      )
      elasticSearchLogger.info(
        `[Harrods Worker - Local] Updated Product: ${payload.name} with SKU: ${payload.productId}`,
        payload
      )
    } else {
      await db.universe.create({
        data: {
          ...payload,
        } as any,
      })

      log.info(
        `[Harrods Worker - Local] Added Product: ${product.name} with URL: ${product.productId}`
      )
      elasticSearchLogger.info(
        `[Harrods Worker - Local] Added Product: ${payload.name} with SKU: ${payload.productId}`,
        payload
      )
    }
  } catch (e) {
    log.error("[Harrods Worker - Local] Error Adding New Product " + e.message)
    elasticSearchLogger.error(
      `[Harrods Worker - Local] Error Adding New Product => ${e.message}`,
      payload
    )
  }
}

const addProductToFirebase = async (product: HarrodsProduct) => {
  const payload = {
    name: product.name,
    brand: product.brand,
    productId: product.productId,
    source: "HARRODS",
    underwriterClassId: product.underwriterClassId,
    categories: product.categories,
    // description: product.description,
    variant: product.variant,
    valueHistory: [
      {
        retrievalDate: moment().toISOString(),
        assetValue: product.price
          ? currencyFormatter.unformat(product.price || "0", { code: "SGD" })
          : -1,
        source: product.source,
      },
    ],
  }

  try {
    const fb = FirebaseDatabase.getInstance()
    const docRef = fb.collection("Universe-Harrods").doc(payload.productId.toString())
    const doc = await docRef.get()
    if (doc.exists) {
      let oldPayload = doc.data() || {}
      payload.valueHistory = [...payload.valueHistory, ...oldPayload?.valueHistory]
      docRef.update(payload)
      elasticSearchLogger.info(
        `[Harrods Worker - Firebase] Updated Product: ${payload.name} with SKU: ${payload.productId}`,
        payload
      )
    } else {
      docRef.set(payload)
      elasticSearchLogger.info(
        `[Harrods Worker - Firebase] Added Product: ${payload.name} with SKU: ${payload.productId}`,
        payload
      )
    }
  } catch (e) {
    log.info(e)
    elasticSearchLogger.error(
      `[Harrods Worker - Firebase] Error pushing product to firebase => ${e.message}`,
      payload.name
    )
  }
}

const processHarrodsJobs = async (job: Job<HarrodsCategory, any, string>) => {
  /* Start Processing Harrods Extraction */

  const category = job.data

  log.info("[Harrods Worker] Working on Category: " + category.url)

  const browser = await puppeteer.launch({ headless: false })

  try {
    /* Start extracting data here */

    const lastPage: number = await getLastPage(browser, category.url)

    for (let harrodsPage = 1; harrodsPage <= lastPage; harrodsPage++) {
      if (mapping) {
        const URL = `${harrods.baseUrl}${category.url}${
          harrodsPage > 1 ? `?pageindex=${harrodsPage}` : ""
        }`

        await timer(Math.floor(Math.random() * 30) + 3)

        const products = await getAllProductsFromPage(browser, URL)

        for (let productPage = 0; productPage < products.length - 1; productPage++) {
          await timer(Math.floor(Math.random() * 30) + 3)

          if (products[productPage]) {
            await getProductInfo(browser, products[productPage], category.name)
          }
        }
      }
    }

    log.success(
      `[Harrods Worker] Finished Data Extraction for Category ${category.name} (${category.url})`
    )
    elasticSearchLogger.info(
      `[Harrods Worker] Finished Data Extraction for Category ${category.name} (${category.url})`
    )
  } catch (e) {
    console.log(e)

    log.error(
      `[Harrods Worker] Failed Data Extraction for Category ${category.name} (${category.url})`
    )
    elasticSearchLogger.error(
      `[Harrods Worker] Finished Data Extraction for Category ${category.name} (${category.url})`
    )
  } finally {
    await browser.close()
  }
}

const getAllProductsFromPage = async (browser: puppeteer.Browser, url: string) => {
  const context = await browser.createIncognitoBrowserContext()

  const page = await context.newPage()

  const subProducts: SubProductBody[] = []

  try {
    await page.goto(url)

    await page.waitForSelector("#siteContent", {
      timeout: 30000,
    })

    const content = await page.content()

    const $ = cheerio.load(content)

    const baseURL: string = harrods.baseUrl.replace("/en-sg", "")

    // getting product details

    $("[data-test='productCard-container']").map((i, element: any) => {
      const anchor = $(element).attr("href")?.split("/") ?? []
      const productId = anchor[anchor.length - 1] ?? ""
      const productBody: SubProductBody = {
        productId: productId,
        brand: $(element).find(mapping.brand).text(),
        name: $(element).find(mapping.name).text(),
        source: `${baseURL}${$(element).attr("href")}`,
      }
      productId && subProducts.push(productBody)
    })
  } catch (e) {
    log.error(`[Harrods Worker] Error in getAllProductsFromPage function: ${e.message}`)
  } finally {
    await page.close()

    await context.close()
  }

  return subProducts
}

const getProductInfo = async (
  browser: puppeteer.Browser,
  product: SubProductBody | undefined,
  underwriterClassId: string
) => {
  if (product) {
    const context = await browser.createIncognitoBrowserContext()

    const page = await context.newPage()
    await page.goto(product.source)

    await page.waitForSelector("#siteContent", {
      timeout: 30000,
    })
    await timer(2)

    try {
      const innerContent = await page.content()

      const $ = cheerio.load(innerContent)

      const categories: string[] = []

      // getting categories
      $(mapping.categoryPath).each((_, element: cheerio.Element) => {
        if (!JSON.stringify(categories).includes($(element).text())) {
          categories.push($(element).text())
        }
      })

      const price = $(mapping.assetValue).text()

      if (parseFloat(price) < 200 && categories.includes("REPLACE_WITH_CATEGORY_TO_IGNORE")) return // This will not execute the code below if condition is met.

      const productInfo: HarrodsProduct = {
        ...product,
        variant: $(mapping.variant).text(),
        price: price,
        description: $(mapping.description).text(),
        categories: categories,
        underwriterClassId,
      }

      await addProductToUniverse(productInfo)
    } catch (e) {
      log.error(`[Harrods Worker] Error in getProductInfo function: ${e.message}`)
    } finally {
      await page.close()

      await context.close()
    }
  }
}

const getLastPage = async (browser: puppeteer.Browser, url: string) => {
  const context = await browser.createIncognitoBrowserContext()

  const page = await context.newPage()

  try {
    await page.goto(harrods.baseUrl + url)

    await page.waitForSelector("#siteContent", {
      timeout: 30000,
    })

    const content = await page.content()

    const $ = cheerio.load(content)

    // getting last page
    const lastPage = $(".css-1baulvz > a:last-child").text()

    return parseInt(lastPage)
  } catch (e) {
    log.error(`[Harrods Worker] Error in getLastPage function: ${e.message}`)

    return -1
  } finally {
    await page.close()

    await context.close()
  }
}

const enqueueCategories = async () => {
  await Promise.all(
    categories.categories.map(async (category: HarrodsCategory) => {
      await harrodsQueue.add(`processHarrodsCategory`, category, {
        delay: 5000,
      })
    })
  )
}

const harrodsWorker = new Worker(
  HARRODS_QUEUE,
  async (job: Job<HarrodsCategory, any, string>) => {
    if (job.data.name === REPEATABLE_JOB_NAME) {
      enqueueCategories()
    } else if (process.env.ENABLE_HARRODS_EXTRACTION === "true") {
      processHarrodsJobs(job)
    }
  },
  {
    connection: getRedisConnection(),
    limiter: {
      max: 1,
      duration: 5 * 60 * 1000, // 5 minutes
    },
  }
)

export default harrodsWorker
