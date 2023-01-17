import CircularProgressFallback from "app/core/components/CircularProgressFallback"
import { Suspense } from "react"
import DashboardStatistics from "./components/DashboardStatistics"

const Dashboard = () => {
  return (
    <Suspense fallback={<CircularProgressFallback height="auto" />}>
      <DashboardStatistics />
    </Suspense>
  )
}

export default Dashboard
