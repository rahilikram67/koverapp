import { Box, Chip, List, ListItem, ListItemText, ListSubheader, Paper } from "@material-ui/core"
import { styled } from "@material-ui/styles"
import MainLayout from "app/core/layouts/MainLayout/MainLayout"
import { WorkersCRON } from "background-process/queue/config"
import { BlitzPage, Routes } from "blitz"
import categories from "data/extraction/harrods/categories.json"
import React, { useState } from "react"

const ChipListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}))

const Harrods: BlitzPage = () => {
  const [currentTab, setCurrentTab] = useState("mapping")

  const onTabChange = (_, value: string) => {
    setCurrentTab(value)
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
      <Box padding="10px" bgcolor="#f7f7f7">
        <List
          dense
          subheader={
            <ListSubheader sx={{ backgroundColor: "#f7f7f7", fontWeight: "bold" }}>
              Categories
            </ListSubheader>
          }
        >
          <Paper
            sx={{
              display: "flex",
              justifyContent: "start",
              flexWrap: "wrap",
              listStyle: "none",
              backgroundColor: "white",
              p: 0.5,
              m: 0,
            }}
            component="ul"
            elevation={0}
          >
            {categories.categories.map((category) => {
              return (
                <ChipListItem key={category.url}>
                  <Chip
                    label={category.name}
                    onClick={() => window.open(categories.baseUrl + category.url, "_blank")}
                    variant="outlined"
                    size="small"
                  />
                </ChipListItem>
              )
            })}
          </Paper>
        </List>
      </Box>
    </>
  )
}

Harrods.suppressFirstRenderFlicker = true

Harrods.authenticate = { redirectTo: Routes.LoginPage() }

Harrods.getLayout = (page) => <MainLayout title="Harrods">{page}</MainLayout>

export default Harrods
