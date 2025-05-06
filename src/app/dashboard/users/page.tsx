'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  NoSymbolIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisVerticalIcon,
  UserIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useCreateUserMutation, useGetPaginatedUsersQuery, useGetUserStatsQuery, useToggleUserActiveMutation } from '../../store/api/userApi';
import { useCancelSubscriptionMutation } from '../../store/api/subscriptionApi';



interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  subscriptionId: string | null;
  preferences: {
    quality: string;
    notifications: boolean;
    autoplay: boolean;
  };
  createdAt: string;
  updatedAt: string;
  lastLoginTime?: string; // match API field name
}

const columnHelper = createColumnHelper<User>();

export default function UserManagement() {
  const [toggleUserActive, { isLoading: togglingUser }] = useToggleUserActiveMutation();
  const [cancelSubscription] = useCancelSubscriptionMutation();



  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer',
  });
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: stats } = useGetUserStatsQuery();
  const {
    data,
    isLoading,
    refetch: refetchUsers, // <-- capture refetch
  } = useGetPaginatedUsersQuery({ page, limit, search: searchTerm });

  const handleCreateUser = async () => {
    try {
      let createdUser = await createUser({
        name: createUserForm.name,
        email: createUserForm.email,
        password: createUserForm.password,
        role: createUserForm.role
      }).unwrap();
      toast.success('User created successfully');
      setShowCreateUserModal(false);
      refetchUsers();
    } catch (error: any) {
      let errorObject = error?.data?.errors || {};
      Object.values(errorObject).forEach((msg) => {
        toast.error(msg+"");
      });

    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCreateUserForm(prev => ({ ...prev, [field]: value }));
  };
  const handleBlockUnblock = async () => {
    try {
      await toggleUserActive(selectedUser!._id).unwrap();
      toast.success(`User has been ${selectedUser?.isActive ? 'blocked' : 'activated'}`);
      setShowUserDetails(false);
      refetchUsers(); // <-- refresh list
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription().unwrap();
      toast.success('Subscription cancelled');
      setShowUserDetails(false);
      refetchUsers(); // <-- refresh list
    } catch (err) {
      toast.error('Failed to cancel subscription');
    }
  };


  const users = useMemo(() => {
    if (!data) return [];
    return data.users.map((user: any) => ({
      ...user,
      lastLoginTime: user.lastLoginTime ? new Date(user.lastLoginTime).toLocaleString() : 'Never'
    }));
  }, [data]);

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('isActive', {
      header: 'Status',
      cell: (info) => (
        <span className={`px-3 py-1 rounded-md text-xs ${info.getValue() ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
          {info.getValue() ? 'Active' : 'Blocked'}
        </span>
      )
    }),
    columnHelper.accessor('subscriptionId', {
      header: 'Subscription',
      cell: (info) => (
        <span className={`px-3 py-1 rounded-md text-xs ${info.getValue() ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'}`}>
          {info.getValue() ? 'Active' : 'None'}
        </span>
      )
    }),
    columnHelper.accessor('lastLoginTime', {
      header: 'Last Login',
      cell: (info) => <div>{info.getValue()}</div>
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <button
          onClick={() => handleViewDetails(info.row.original)}
          className="bg-dark-15 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-dark-20"
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>
      )
    })
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <div className="flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-dark-10 text-grey-70 px-4 py-2 pl-10 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-red-45"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 text-grey-70 h-5 w-5" />
          </div>
          <div>    <button
            onClick={() => setShowCreateUserModal(true)}
            className="bg-red-45 text-white px-4 py-2 rounded-md hover:bg-red-60"
          >
            Create User
          </button></div>

        </div>

      </div>
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-8 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">Create New User</h2>

            <div className="space-y-4">
              <div>
                <label className="text-grey-70 block mb-1">Name</label>
                <input
                  type="text"
                  value={createUserForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-dark-10 text-white"
                />
              </div>

              <div>
                <label className="text-grey-70 block mb-1">Email</label>
                <input
                  type="email"
                  value={createUserForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-dark-10 text-white"
                />
              </div>

              <div>
                <label className="text-grey-70 block mb-1">Password</label>
                <input
                  type="password"
                  value={createUserForm.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-dark-10 text-white"
                />
              </div>

              <div>
                <label className="text-grey-70 block mb-1">Role</label>
                <select
                  value={createUserForm.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-dark-10 text-white"
                >
                  <option value="viewer">Viewer</option>
                  <option value="creator">Creator</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="px-4 py-2 text-grey-70 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                disabled={isCreating}
                className="bg-red-45 hover:bg-red-60 text-white px-4 py-2 rounded-md"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatBox title="Total Users" value={stats?.totalUsers || 0} Icon={UserIcon} />
        <StatBox title="Active Users" value={stats?.activeUsers || 0} Icon={ClockIcon} />
        <StatBox title="Active Subscriptions" value={stats?.activeSubscriptions || 0} Icon={CheckCircleIcon} />
      </div>

      <div className="bg-dark-8 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-gray-800">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={data && data.users.length < limit}
              className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <span className="text-sm text-gray-400">
              Page {page}
            </span>
          </div>
        </div>
      </div>

      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-8 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button onClick={() => setShowUserDetails(false)} className="text-grey-70 hover:text-white">
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Name" value={selectedUser.name} />
              <DetailItem label="Email" value={selectedUser.email} />
              <DetailItem label="Role" value={selectedUser.role} />
              <DetailItem label="Join Date" value={new Date(selectedUser.createdAt).toLocaleDateString()} />
              <DetailItem label="Subscription" value={selectedUser.subscriptionId ? 'Active' : 'None'} />
              <DetailItem label="Last Login" value={selectedUser.lastLoginTime || 'Never'} />
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleBlockUnblock}
                className={`${selectedUser.isActive ? 'bg-red-45 hover:bg-red-60' : 'bg-green-600 hover:bg-green-700'
                  } text-white px-4 py-2 rounded flex items-center space-x-2`}
              >
                {selectedUser.isActive ? <NoSymbolIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                <span>{selectedUser.isActive ? 'Block User' : 'Activate User'}</span>
              </button>

              {selectedUser.subscriptionId && (
                <button
                  onClick={handleCancelSubscription}
                  className="bg-yellow-700 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-yellow-800"
                >
                  <XCircleIcon className="h-5 w-5" />
                  <span>Cancel Subscription</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function StatBox({ title, value, Icon }: { title: string; value: number; Icon: any }) {
  return (
    <div className="bg-dark-8 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-grey-70">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <Icon className="text-red-45 h-8 w-8" />
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-grey-70">{label}</p>
      <p className="text-white">{value}</p>
    </div>
  );
}
