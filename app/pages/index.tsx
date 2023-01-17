import MainLayout from "app/core/layouts/MainLayout/MainLayout"
import { BlitzPage, Routes } from "blitz"
import Dashboard from "../modules/dashboard/dashboard"

const Home: BlitzPage = () => {
  // const [records] = useQuery(getRecords, {})
  // console.log("records", records)
  return (
    <div>
      <Dashboard />
    </div>
  )
}

Home.suppressFirstRenderFlicker = true

Home.authenticate = { redirectTo: Routes.LoginPage() }

Home.getLayout = (page) => <MainLayout title="Dashboard">{page}</MainLayout>

export default Home
