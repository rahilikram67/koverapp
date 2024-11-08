import { LoginForm } from "app/auth/components/LoginForm"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, useRouter } from "blitz"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <LoginForm
        onSuccess={() => {
          const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
          router.push(next)
        }}
      />
    </div>
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <Layout title="Login">{page}</Layout>

export default LoginPage
