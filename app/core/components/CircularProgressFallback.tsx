import { Box, CircularProgress } from "@material-ui/core"
import React from "react"

const CircularProgressFallback = ({ height = "100vh" }) => {
  return (
    <Box display="flex" justifyContent="center" height={height}>
      <CircularProgress />
    </Box>
  )
}

export default CircularProgressFallback
