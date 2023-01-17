import { Paper, Typography } from "@material-ui/core"
import Box from "@material-ui/core/Box"
import React, { ReactElement, ReactNode } from "react"
import { useStyles } from "./content.style"
import { Copyright } from "./Copyright"

interface ContentProps {
  title?: string
  children: ReactNode
}

function Content({ title, children }: ContentProps): ReactElement {
  const classes = useStyles()

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
        flexGrow: 1,
        height: `calc(100vh - 63px) !important`,
        overflow: "auto",
        marginTop: "63px",
        width: "100%",
        padding: 4,
      }}
    >
      {title && (
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
      )}
      <Paper className={classes.contentContainer} elevation={0}>
        {children}
      </Paper>
      <Copyright />
    </Box>
  )
}

export default Content
