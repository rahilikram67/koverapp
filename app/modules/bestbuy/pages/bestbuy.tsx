import { Box } from "@material-ui/core"
import CircularProgressFallback from "app/core/components/CircularProgressFallback"
import MainLayout from "app/core/layouts/MainLayout/MainLayout"
import { BlitzPage, Routes } from "blitz"
import React, { Suspense } from "react"
import BestbuyDataExtractionPanel from "../components/BestbuyDataExtractionPanel"

const BestBuy: BlitzPage = () => {
  return (
    <>
      <Box sx={{ py: 2 }}>
        <Suspense fallback={<CircularProgressFallback height="auto" />}>
          <BestbuyDataExtractionPanel />
        </Suspense>
      </Box>
    </>
  )
}

BestBuy.suppressFirstRenderFlicker = true

BestBuy.authenticate = { redirectTo: Routes.LoginPage() }

BestBuy.getLayout = (page) => <MainLayout title="Best Buy">{page}</MainLayout>

export default BestBuy
