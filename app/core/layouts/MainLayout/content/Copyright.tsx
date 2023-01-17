import Typography from "@material-ui/core/Typography"

export function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {`Copyright © ${new Date().getFullYear()}.`}
    </Typography>
  )
}
