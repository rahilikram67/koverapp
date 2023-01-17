import { Box, ButtonGroup, List, ListItem, ListItemText, ListSubheader } from "@material-ui/core"
import { LoadingButton } from "@material-ui/lab"
import { useMutation } from "blitz"
import categories from "data/extraction/harrods/categories.json"
import React, { useEffect } from "react"
import toast from "react-hot-toast"
import clearQueue from "../mutations/clearQueue"
import queueCategories from "../mutations/queueCategories"

const HarrodsDataExtractionPanel = () => {
  const [startQueueing, { isLoading, data, isError }] = useMutation(queueCategories)
  const [stopQueue, { isLoading: isClearing, data: clearQueueData, isError: hasErrorClearing }] =
    useMutation(clearQueue)

  useEffect(() => {
    if (data) {
      toast.remove()
      toast.success("Harrods Queueing Started!")
    }
  }, [data])

  useEffect(() => {
    if (isError) {
      toast.remove()
      toast.error("Unable to start data extraction process. Please try again!")
    }
  }, [isError])

  useEffect(() => {
    if (clearQueueData) {
      toast.remove()
      toast.success("Harrods Queue Cleared!")
    }
  }, [clearQueueData])

  useEffect(() => {
    if (hasErrorClearing) {
      toast.remove()
      toast.error("Unable to clear Harrods queue jobs. Please try again!")
    }
  }, [hasErrorClearing])

  return (
    <>
      <List subheader={<ListSubheader disableSticky>Categories</ListSubheader>}>
        {categories.categories.map((category) => (
          <ListItem sx={{ backgroundColor: "aliceblue" }} key={category.url}>
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
      <Box display="flex" justifyContent="flex-end" pt={2}>
        <ButtonGroup variant="contained">
          <LoadingButton
            variant="contained"
            loading={isLoading}
            disabled={isLoading || isClearing}
            onClick={() => startQueueing()}
          >
            Start Data Extraction
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            loading={isClearing}
            disabled={isClearing || isLoading}
            onClick={() => stopQueue({ source: "HARRODS" })}
            color="error"
          >
            Clear Queue
          </LoadingButton>
        </ButtonGroup>
      </Box>
    </>
  )
}

export default HarrodsDataExtractionPanel
