import { useQuery } from "@blitzjs/core"
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
} from "@material-ui/core"
import { OpenInNew } from "@material-ui/icons"
import { Box } from "@material-ui/system"
import getProductsRecord from "../queries/getProductsRecord"

const links = {
  elk: [
    {
      title: "Bestbuy Logs",
      link: process.env.BLITZ_PUBLIC_ELK_BESTBUY_LINK || "",
    },
    {
      title: "Harrods Logs",
      link: process.env.BLITZ_PUBLIC_ELK_HARRODS_LINK || "",
    },
    {
      title: "Firebase Error Logs",
      link: process.env.BLITZ_PUBLIC_ELK_FIREBASE_LINK || "",
    },
  ],
  pm2: [
    {
      title: "PM2 Logs",
      link: process.env.BLITZ_PUBLIC_PM2_LINK || "",
    },
  ],
}

const DashboardStatistics = () => {
  const [records] = useQuery(getProductsRecord, {})

  const handleOpenLink = (link: string) => {
    window.open(link, "_blank")
  }

  return (
    <>
      <Box padding="10px" bgcolor="#f7f7f7">
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <Card elevation={1}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  BestBuy Records
                </Typography>
                <Typography variant="h5" component="div">
                  {records.count.bestbuy}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={6}>
            <Card elevation={1}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Harrods Records
                </Typography>
                <Typography variant="h5" component="div">
                  {records.count.harrods}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <br />
      <Box padding="10px" bgcolor="#f7f7f7">
        <List
          dense
          subheader={
            <ListSubheader sx={{ backgroundColor: "#f7f7f7", fontWeight: "bold" }}>
              ELK
            </ListSubheader>
          }
        >
          {links.elk.map((log, index) => (
            <ListItem
              key={index}
              sx={{ backgroundColor: "white" }}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="open link in new tab"
                  onClick={() => handleOpenLink(log.link)}
                >
                  <OpenInNew />
                </IconButton>
              }
            >
              <ListItemText primary={log.title} />
            </ListItem>
          ))}
        </List>
        <List
          dense
          subheader={
            <ListSubheader sx={{ backgroundColor: "#f7f7f7", fontWeight: "bold" }}>
              PM2
            </ListSubheader>
          }
        >
          {links.pm2.map((log, index) => (
            <ListItem
              key={index}
              sx={{ backgroundColor: "white" }}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="open link in new tab"
                  onClick={() => handleOpenLink(log.link)}
                >
                  <OpenInNew />
                </IconButton>
              }
            >
              <ListItemText primary={log.title} />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  )
}

export default DashboardStatistics
