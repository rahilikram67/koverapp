import { IconButton } from "@material-ui/core"
import Divider from "@material-ui/core/Divider"
import MuiDrawer from "@material-ui/core/Drawer"
import { experimentalStyled as styled } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import React, { ReactElement } from "react"
import { MainMenu } from "../../MainMenu"

interface Props {
  drawerWidth: number
  open: boolean
  toggleDrawer: () => void
}

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open, drawerWidth }: { theme?: any; open: boolean; drawerWidth: number }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      }),
    },
  })
)

function SideDrawer({ drawerWidth, open, toggleDrawer }: Props): ReactElement {
  return (
    <Drawer variant="permanent" open={open} drawerWidth={drawerWidth}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <MainMenu />
    </Drawer>
  )
}

export default SideDrawer
