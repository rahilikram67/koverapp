import Box from "@material-ui/core/Box"
import CssBaseline from "@material-ui/core/CssBaseline"
import { Head } from "blitz"
import React, { ReactNode, useState } from "react"
import Content from "./content/Content"
import SideDrawer from "./content/Drawer"
import Header from "./content/Header"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const drawerWidth: number = 240

export default function MainLayout({ title, children }: LayoutProps) {
  const [open, setOpen] = useState(true)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Header open={open} drawerWidth={drawerWidth} toggleDrawer={toggleDrawer} />

        <SideDrawer open={open} drawerWidth={drawerWidth} toggleDrawer={toggleDrawer} />

        <Content title={title}>{children}</Content>
      </Box>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700;900&display=swap");

        html,
        body {
          padding: 0;
          margin: 0;
          font-family: "Montserrat", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }
      `}</style>
    </>
  )
}
