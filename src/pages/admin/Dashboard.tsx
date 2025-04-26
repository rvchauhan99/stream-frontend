import { useAppSelector } from '@src/store/hooks'
import { selectCurrentUser } from '@src/store/slices/authSlice'

const DashboardPage = () => {
  const user = useAppSelector(selectCurrentUser)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Overview Card */}
        <div className="bg-dark-6 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Welcome Back{user?.name ? `, ${user.name}` : ''}!</h2>
          <p className="text-grey-60">Here's your admin dashboard overview</p>
        </div>

        {/* Stats Card */}
        <div className="bg-dark-6 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-grey-60">Total Users</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div>
              <p className="text-grey-60">Active Sessions</p>
              <p className="text-2xl font-bold">56</p>
            </div>
          </div>
        </div>

        {/* Activity Card */}
        <div className="bg-dark-6 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center text-grey-60">
              <span className="w-2 h-2 bg-red-45 rounded-full mr-2"></span>
              New user registration
            </div>
            <div className="flex items-center text-grey-60">
              <span className="w-2 h-2 bg-red-45 rounded-full mr-2"></span>
              Content update
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage 