import { useState } from 'react'
import { baseApi } from '@src/store/api/baseApi'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

// Extend the base API with user management endpoints
const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
    }),
    updateUserStatus: builder.mutation<void, { userId: string; status: User['status'] }>({
      query: ({ userId, status }) => ({
        url: `/users/${userId}/status`,
        method: 'PATCH',
        body: { status },
      }),
    }),
  }),
})

export const { useGetUsersQuery, useUpdateUserStatusMutation } = userApi

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: users = [], isLoading } = useGetUsersQuery()
  const [updateStatus] = useUpdateUserStatusMutation()

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="bg-dark-6 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-45"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-dark-6 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-8">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-8">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-grey-60">{user.email}</td>
                  <td className="px-6 py-4 text-sm">{user.role}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => updateStatus({
                        userId: user.id,
                        status: user.status === 'active' ? 'inactive' : 'active'
                      })}
                      className="text-red-45 hover:text-red-60"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UserManagement 