import { ListItemButton } from "@material-ui/core"
import List from "@material-ui/core/List"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import BarChartIcon from "@material-ui/icons/BarChart"
import DashboardIcon from "@material-ui/icons/Dashboard"
import PeopleIcon from "@material-ui/icons/People"
import SettingsIcon from "@material-ui/icons/Settings"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import { Link, useRouter } from "blitz"
import React from "react"

export const MainMenu = () => {
  const router = useRouter()

  const { pathname: selectedPath } = router

  return (
    <List>
      <Link href="/">
        <ListItemButton selected={selectedPath === "/"}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </Link>

      <Link href="bestbuy">
        <ListItemButton selected={selectedPath === "/bestbuy"}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Best Buy" />
        </ListItemButton>
      </Link>

      <Link href="harrods">
        <ListItemButton selected={selectedPath === "/harrods"}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Harrods" />
        </ListItemButton>
      </Link>

      <Link href="universe">
        <ListItemButton selected={selectedPath === "/universe"}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Explore Universe" />
        </ListItemButton>
      </Link>

      <Link href="settings">
        <ListItemButton selected={selectedPath === "/settings"}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </Link>
    </List>
  )
}
