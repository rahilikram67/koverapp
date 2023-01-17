import { Box, List, ListItem, ListItemText, ListSubheader } from "@material-ui/core"
import MainLayout from "app/core/layouts/MainLayout/MainLayout"
import { BlitzPage, Routes } from "blitz"
import React from "react"

const Settings: BlitzPage = () => {
  return (
    <>
      <Box padding="10px" bgcolor="#f7f7f7">
        <List
          dense
          subheader={
            <ListSubheader sx={{ backgroundColor: "#f7f7f7", fontWeight: "bold" }}>
              Attached Firebase Instance Information
            </ListSubheader>
          }
        >
          <ListItem sx={{ backgroundColor: "white" }}>
            <ListItemText
              primary="Project ID"
              secondary={process.env.BLITZ_PUBLIC_FIREBASE_PROJECT_ID || "N/A"}
            />
          </ListItem>
          <ListItem sx={{ backgroundColor: "white" }}>
            <ListItemText primary="Collection Name" secondary={"Universe"} />
          </ListItem>
        </List>
      </Box>
    </>
  )
}

Settings.suppressFirstRenderFlicker = true

Settings.authenticate = { redirectTo: Routes.LoginPage() }

Settings.getLayout = (page) => <MainLayout title="Settings">{page}</MainLayout>

export default Settings
