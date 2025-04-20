import { useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import BlockIcon from '@mui/icons-material/Block';
import UnblockIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';

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

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 180,
      flex: 1,
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 200,
      flex: 1,
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <span className={`px-3 py-1 rounded-md text-xs ${
          params.value === 'Active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'subscriptionStatus',
      headerName: 'Subscription',
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <span className={`px-3 py-1 rounded-md text-xs ${
          params.value === 'Active' ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'
        }`}>
          {params.value}
        </span>
      ),
    },
    { 
      field: 'lastLogin', 
      headerName: 'Last Login', 
      width: 180,
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      flex: 1.5,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex items-center gap-2 px-2 min-w-[280px]">
          {params.row.status === 'Active' ? (
            <button
              onClick={() => handleBlockUser(params.row.id)}
              className="bg-red-45 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-red-60 whitespace-nowrap"
            >
              <BlockIcon fontSize="small" />
              <span>Block</span>
            </button>
          ) : (
            <button
              onClick={() => handleUnblockUser(params.row.id)}
              className="bg-green-700 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-green-800 whitespace-nowrap"
            >
              <UnblockIcon fontSize="small" />
              <span>Unblock</span>
            </button>
          )}
          {params.row.subscriptionStatus === 'Active' && (
            <button
              onClick={() => handleCancelSubscription(params.row.id)}
              className="bg-yellow-700 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-yellow-800 whitespace-nowrap"
            >
              <CancelIcon fontSize="small" />
              <span>Cancel Sub</span>
            </button>
          )}
          <button
            onClick={() => handleViewDetails(params.row)}
            className="bg-dark-15 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-dark-20"
          >
            <MoreVertIcon fontSize="small" />
          </button>
        </div>
      ),
    },
  ];

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
            <SearchIcon className="absolute left-3 top-2.5 text-grey-70" />
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
              <PersonIcon className="text-red-45 text-3xl" />
            </div>
          </div>
          <div className="bg-dark-8 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-grey-70">Active Subscriptions</p>
                <h3 className="text-2xl font-bold text-white mt-1">890</h3>
              </div>
              <BlockIcon className="text-red-45 text-3xl" />
            </div>
          </div>
          <div className="bg-dark-8 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-grey-70">Recent Activity</p>
                <h3 className="text-2xl font-bold text-white mt-1">45</h3>
              </div>
              <HistoryIcon className="text-red-45 text-3xl" />
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="lg:col-span-4 bg-dark-8 rounded-lg">
          <DataGrid
            rows={users}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            className="border-none"
            sx={{
              border: 'none',
              '.MuiDataGrid-root': {
                border: 'none',
                backgroundColor: 'transparent',
              },
              '.MuiDataGrid-main': {
                backgroundColor: '#1A1A1A',
                border: 'none',
              },
              '.MuiDataGrid-cell': {
                borderColor: '#333',
                borderBottom: 'none',
                color: '#fff',
                overflow: 'visible !important',
                whiteSpace: 'normal',
                '&:focus': {
                  outline: 'none',
                },
              },
              '.MuiDataGrid-row': {
                color: '#fff',
                borderBottom: '1px solid #333',
                '&:hover': {
                  backgroundColor: '#262626',
                },
                '&:last-child': {
                  borderBottom: 'none',
                },
              },
              '.MuiDataGrid-columnHeaders': {
                backgroundColor: '#1A1A1A',
                borderBottom: '2px solid #333',
                borderTop: 'none',
                color: '#999',
                '.MuiDataGrid-columnHeaderTitle': {
                  color: '#999',
                  fontWeight: '600',
                },
              },
              '.MuiDataGrid-footerContainer': {
                backgroundColor: '#1A1A1A',
                borderTop: '1px solid #333',
                border: 'none',
              },
              '.MuiTablePagination-root': {
                color: '#999',
              },
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                color: '#999',
              },
              '.MuiTablePagination-select': {
                color: '#fff',
              },
              '.MuiCheckbox-root': {
                color: '#666',
                '&.Mui-checked': {
                  color: '#E30000',
                },
              },
              '.MuiDataGrid-cellContent': {
                color: '#fff',
              },
              '.MuiDataGrid-menuIcon': {
                color: '#666',
              },
              '.MuiDataGrid-sortIcon': {
                color: '#666',
              },
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                outline: 'none',
              },
              '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                outline: 'none',
              },
            }}
          />
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
                <CancelIcon />
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
                  <BlockIcon />
                  <span>Block User</span>
                </button>
              ) : (
                <button
                  onClick={() => handleUnblockUser(selectedUser.id)}
                  className="bg-green-700 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-green-800"
                >
                  <UnblockIcon />
                  <span>Unblock User</span>
                </button>
              )}
              {selectedUser.subscriptionStatus === 'Active' && (
                <button
                  onClick={() => handleCancelSubscription(selectedUser.id)}
                  className="bg-yellow-700 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-yellow-800"
                >
                  <CancelIcon />
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