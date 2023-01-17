import { Typography } from "@material-ui/core"
import CssBaseline from "@material-ui/core/CssBaseline"
import { Theme, ThemeProvider } from "@material-ui/core/styles"
import { Box } from "@material-ui/system"
import LoginForm from "app/auth/components/LoginForm"
import { theme } from "app/core/theme/Theme"
import {
  AppProps,
  AuthenticationError,
  AuthorizationError,
  ErrorBoundary,
  ErrorComponent,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
} from "blitz"
import React from "react"
import { Toaster } from "react-hot-toast"

declare module "@material-ui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}

const ForbiddenDashboard = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h6">Dashboard access is forbidden!</Typography>
    </Box>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary
        FallbackComponent={RootErrorFallback}
        onReset={useQueryErrorResetBoundary().reset}
      >
        {process.env.BLITZ_PUBLIC_HIDE_DASHBOARD === "true" ? (
          <ForbiddenDashboard />
        ) : (
          getLayout(<Component {...pageProps} />)
        )}
      </ErrorBoundary>
      <Toaster />
    </ThemeProvider>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}
