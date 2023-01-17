import Avatar from "@material-ui/core/Avatar"
import Container from "@material-ui/core/Container"
import CssBaseline from "@material-ui/core/CssBaseline"
import Grid from "@material-ui/core/Grid"
import MaterialLink from "@material-ui/core/Link"
import Typography from "@material-ui/core/Typography"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import { makeStyles } from "@material-ui/styles"
import { Form, FORM_ERROR } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import { AuthenticationError, Link, Routes, useMutation } from "blitz"
import React from "react"
import login from "../mutations/login"
import { Login } from "../validations"

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

type LoginFormProps = {
  onSuccess?: () => void
}

export function LoginForm(props: LoginFormProps) {
  const classes = useStyles()
  const [loginMutation, { isLoading, isError, isSuccess }] = useMutation(login)

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Form
          className={classes.form}
          noValidate
          submitText="Login"
          schema={Login}
          initialValues={{ email: "", password: "" }}
          isLoading={isLoading}
          onSubmit={async (values) => {
            try {
              await loginMutation(values)
              props.onSuccess?.()
            } catch (error) {
              if (error instanceof AuthenticationError) {
                return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
              } else {
                return {
                  [FORM_ERROR]:
                    "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
                }
              }
            }
          }}
        >
          <LabeledTextField name="email" label="Email" placeholder="Email" />
          <LabeledTextField
            name="password"
            label="Password"
            placeholder="Password"
            type="password"
          />

          <Grid container>
            <Grid item xs>
              <Link href={Routes.ForgotPasswordPage()}>
                <MaterialLink href="#" underline="hover">
                  Forgot your password?
                </MaterialLink>
              </Link>
            </Grid>
          </Grid>
        </Form>
      </div>
    </Container>
  )
}

export default LoginForm
