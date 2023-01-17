import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core"
import { LoadingButton } from "@material-ui/lab"
import clearQueue from "app/modules/harrods/mutations/clearQueue"
import { WorkersCRON } from "background-process/queue/config"
import { useMutation, useQuery } from "blitz"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import categories from "../../../../data/extraction/bestbuy/categories.json"
import queueCategories from "../mutations/queueCategories"
import updateBestbuyMutation from "../mutations/updateCategoriesBestbuy"
import getBestbuy from "../queries/getBestbuy"
import getBestbuyExtractionProgress from "../queries/getBestbuyExtractionProgress"

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const BestbuyDataExtractionPanel = () => {
  const { handleSubmit, register, watch, setValue } = useForm()

  const selectedCategories = watch("categories")

  const [stopQueue, { isLoading: isClearing, data: clearQueueData, isError: hasErrorClearing }] =
    useMutation(clearQueue)

  const [updateBestbuy, { isLoading: bestBuyIsLoading }] = useMutation(updateBestbuyMutation)

  const [progress] = useQuery(getBestbuyExtractionProgress, null, {
    // refetchInterval: 4 * 1000,
  })
  const [record] = useQuery(getBestbuy, null)

  const [startQueueing, { isLoading, data, isError }] = useMutation(queueCategories)

  const [buttonDisable, setButtonDisable] = useState(false)

  useEffect(() => {
    if (data) {
      toast.remove()
      toast.success("Bestbuy Queueing Started!")
    }
  }, [data])

  useEffect(() => {
    if (isError) {
      toast.remove()
      toast.error("Unable to start data extraction process. Please try again!")
    }
  }, [isError])

  useEffect(() => {
    if (record) {
      setValue("apiKey", record.apiKey)
      setValue("categories", record.categories)
    }
  }, [record, setValue])

  useEffect(() => {
    if (progress.totalJobsInWorking > 0) setButtonDisable(true)
    else setButtonDisable(false)
  }, [progress])

  const onSubmit = async (values: any) => {
    try {
      await updateBestbuy(values)
      toast.success("Record updated successfully!")
    } catch (error) {
      toast.error("Unable to update record. Please try again!")
    }
  }

  return (
    <>
      <Box padding="10px" bgcolor="#f7f7f7">
        <List
          dense
          subheader={
            <ListSubheader sx={{ backgroundColor: "#f7f7f7", fontWeight: "bold" }}>
              Frequence of crawling
            </ListSubheader>
          }
        >
          <ListItem sx={{ backgroundColor: "white" }}>
            <ListItemText primary={WorkersCRON.text} secondary={WorkersCRON.cron} />
          </ListItem>
        </List>
      </Box>
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl sx={{ width: "100%" }} variant={"filled"}>
          <TextField
            label="API Key"
            placeholder="Enter Bestbuy API key"
            {...register("apiKey")}
            required
          />
        </FormControl>

        <FormControl sx={{ width: "100%", marginTop: "20px" }} variant={"filled"}>
          <InputLabel id="categories-label">Categories *</InputLabel>
          <Select
            required
            labelId="categories-label"
            multiple
            value={selectedCategories || []}
            // input={<OutlinedInput id="select-multiple-categories" label="Categories" />}
            renderValue={(selectedCategories) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selectedCategories.map((id) => (
                  <Chip key={id} label={categories.find((cat) => cat.id === id)?.name} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
            {...register("categories")}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display="flex" justifyContent="flex-end" pt={2}>
          <LoadingButton
            variant="contained"
            loading={bestBuyIsLoading}
            disabled={bestBuyIsLoading}
            type="submit"
          >
            Submit
          </LoadingButton>
        </Box>
      </form>

      {process.env.BLITZ_PUBLIC_DEBUG_MODE === "true" && (
        <Box display="flex" justifyContent="flex-end" pt={2}>
          <LoadingButton
            variant="contained"
            loading={isLoading}
            disabled={isLoading || buttonDisable || !record?.apiKey}
            onClick={() => {
              startQueueing()
              setButtonDisable(true)
            }}
          >
            {!record?.apiKey ? "Please Set Api Key" : "Start Data Extraction"}
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            loading={isClearing}
            disabled={isClearing || isLoading}
            onClick={() => stopQueue({ source: "BEST_BUY" })}
            color="error"
          >
            Clear Queue
          </LoadingButton>
        </Box>
      )}
    </>
  )
}

export default BestbuyDataExtractionPanel
