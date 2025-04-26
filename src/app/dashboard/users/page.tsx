'use client';

import { useState } from 'react';
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

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Blocked';
  subscriptionPlan: string;
  subscriptionStatus: 'Active' | 'Cancelled';
  lastLogin: string;
  joinDate: string;
}

// Mock data for demonstration
const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'User',
    status: 'Active',
    subscriptionPlan: 'Premium',
    subscriptionStatus: 'Active',
    lastLogin: '2024-02-20 14:30',
    joinDate: '2023-12-01',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Admin',
    status: 'Blocked',
    subscriptionPlan: 'Basic',
    subscriptionStatus: 'Cancelled',
    lastLogin: '2024-02-19 09:15',
    joinDate: '2023-11-15',
  },
  // Add more mock users as needed
];

const columnHelper = createColumnHelper<User>();

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleBlockUser = (userId: number) => {
    // Implement user blocking logic here
    console.log('Blocking user:', userId);
  };

  const handleUnblockUser = (userId: number) => {
    // Implement user unblocking logic here
    console.log('Unblocking user:', userId);
  };

  const handleCancelSubscription = (userId: number) => {
    // Implement subscription cancellation logic here
    console.log('Cancelling subscription for user:', userId);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

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
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span className={`px-3 py-1 rounded-md text-xs ${
          info.getValue() === 'Active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('subscriptionStatus', {
      header: 'Subscription',
      cell: (info) => (
        <span className={`px-3 py-1 rounded-md text-xs ${
          info.getValue() === 'Active' ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('lastLogin', {
      header: 'Last Login',
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center gap-2 px-2 min-w-[280px]">
          {info.row.original.status === 'Active' ? (
            <button
              onClick={() => handleBlockUser(info.row.original.id)}
              className="bg-red-45 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-red-60 whitespace-nowrap"
            >
              <NoSymbolIcon className="h-5 w-5" />
              <span>Block</span>
            </button>
          ) : (
            <button
              onClick={() => handleUnblockUser(info.row.original.id)}
              className="bg-green-700 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-green-800 whitespace-nowrap"
            >
              <CheckCircleIcon className="h-5 w-5" />
              <span>Unblock</span>
            </button>
          )}
          {info.row.original.subscriptionStatus === 'Active' && (
            <button
              onClick={() => handleCancelSubscription(info.row.original.id)}
              className="bg-yellow-700 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-yellow-800 whitespace-nowrap"
            >
              <XCircleIcon className="h-5 w-5" />
              <span>Cancel Sub</span>
            </button>
          )}
          <button
            onClick={() => handleViewDetails(info.row.original)}
            className="bg-dark-15 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-dark-20"
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <div className="flex space-x-4">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Stats */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-8 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-grey-70">Total Users</p>
                <h3 className="text-2xl font-bold text-white mt-1">1,234</h3>
              </div>
              <UserIcon className="text-red-45 h-8 w-8" />
            </div>
          </div>
          <div className="bg-dark-8 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-grey-70">Active Subscriptions</p>
                <h3 className="text-2xl font-bold text-white mt-1">890</h3>
              </div>
              <NoSymbolIcon className="text-red-45 h-8 w-8" />
            </div>
          </div>
          <div className="bg-dark-8 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-grey-70">Recent Activity</p>
                <h3 className="text-2xl font-bold text-white mt-1">45</h3>
              </div>
              <ClockIcon className="text-red-45 h-8 w-8" />
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="lg:col-span-4 bg-dark-8 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b border-gray-800">
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
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
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <span className="text-sm text-gray-400">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </span>
            </div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-2 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-8 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setShowUserDetails(false)}
                className="text-grey-70 hover:text-white"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-grey-70">Name</p>
                <p className="text-white">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-grey-70">Email</p>
                <p className="text-white">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-grey-70">Role</p>
                <p className="text-white">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-grey-70">Join Date</p>
                <p className="text-white">{selectedUser.joinDate}</p>
              </div>
              <div>
                <p className="text-grey-70">Subscription Plan</p>
                <p className="text-white">{selectedUser.subscriptionPlan}</p>
              </div>
              <div>
                <p className="text-grey-70">Last Login</p>
                <p className="text-white">{selectedUser.lastLogin}</p>
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              {selectedUser.status === 'Active' ? (
                <button
                  onClick={() => handleBlockUser(selectedUser.id)}
                  className="bg-red-45 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-red-60"
                >
                  <NoSymbolIcon className="h-5 w-5" />
                  <span>Block User</span>
                </button>
              ) : (
                <button
                  onClick={() => handleUnblockUser(selectedUser.id)}
                  className="bg-green-700 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-green-800"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Unblock User</span>
                </button>
              )}
              {selectedUser.subscriptionStatus === 'Active' && (
                <button
                  onClick={() => handleCancelSubscription(selectedUser.id)}
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