import { useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

interface Transaction {
  id: number;
  date: string;
  amount: number;
  type: 'payout' | 'earning';
  status: 'completed' | 'pending' | 'processing';
  reference: string;
  source: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: '2024-03-01',
    amount: 1500.00,
    type: 'payout',
    status: 'completed',
    reference: 'PAY-2024-001',
    source: 'Bank Transfer'
  },
  {
    id: 2,
    date: '2024-03-05',
    amount: 250.50,
    type: 'earning',
    status: 'completed',
    reference: 'EARN-2024-002',
    source: 'Video: Getting Started with Crypto Trading'
  },
  {
    id: 3,
    date: '2024-03-10',
    amount: 750.00,
    type: 'payout',
    status: 'processing',
    reference: 'PAY-2024-003',
    source: 'PayPal'
  }
];

export default function PayoutTransactions() {
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [payoutData, setPayoutData] = useState({
    method: 'bank',
    amount: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
    swiftCode: '',
    upiId: '',
  });
  const [error, setError] = useState('');

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex items-center space-x-2">
          <CalendarTodayIcon sx={{ fontSize: 16 }} className="text-grey-70" />
          <span>{new Date(params.value).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <div className={`flex items-center space-x-1 ${params.row.type === 'earning' ? 'text-green-500' : 'text-red-45'}`}>
          <MonetizationOnIcon sx={{ fontSize: 16 }} />
          <span>${params.value.toFixed(2)}</span>
        </div>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <span className={`px-3 py-1 rounded-md text-xs ${
          params.value === 'earning' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'
        }`}>
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <span className={`px-3 py-1 rounded-md text-xs ${
          params.value === 'completed' ? 'bg-green-900 text-green-300' :
          params.value === 'processing' ? 'bg-yellow-900 text-yellow-300' :
          'bg-blue-900 text-blue-300'
        }`}>
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </span>
      ),
    },
    {
      field: 'reference',
      headerName: 'Reference',
      width: 150,
    },
    {
      field: 'source',
      headerName: 'Source',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <button 
          className="text-grey-70 hover:text-white"
          title="Download Receipt"
          onClick={(e) => {
            e.stopPropagation();
            // Handle receipt download
          }}
        >
          <DownloadIcon fontSize="small" />
        </button>
      ),
    },
  ];

  const totalEarnings = mockTransactions
    .filter(t => t.type === 'earning')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayouts = mockTransactions
    .filter(t => t.type === 'payout' && t.status === 'processing')
    .reduce((sum, t) => sum + t.amount, 0);

  const availableBalance = totalEarnings - mockTransactions
    .filter(t => t.type === 'payout' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const handlePayoutSubmit = () => {
    // Validate form
    if (!payoutData.amount || parseFloat(payoutData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(payoutData.amount) > availableBalance) {
      setError('Amount exceeds available balance');
      return;
    }

    if (payoutData.method === 'bank') {
      if (!payoutData.accountName || !payoutData.accountNumber || !payoutData.bankName || !payoutData.swiftCode) {
        setError('Please fill in all bank details');
        return;
      }
    } else if (payoutData.method === 'upi') {
      if (!payoutData.upiId) {
        setError('Please enter UPI ID');
        return;
      }
      // Validate UPI ID format (example@upi or example@bank)
      const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
      if (!upiRegex.test(payoutData.upiId)) {
        setError('Please enter a valid UPI ID (e.g., username@upi)');
        return;
      }
    }

    // TODO: Handle payout request submission
    console.log('Submitting payout request:', payoutData);
    setShowPayoutDialog(false);
    resetPayoutForm();
  };

  const resetPayoutForm = () => {
    setPayoutData({
      method: 'bank',
      amount: '',
      accountName: '',
      accountNumber: '',
      bankName: '',
      swiftCode: '',
      upiId: '',
    });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPayoutData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Payout Transactions</h1>
        <button
          className="bg-red-45 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-60"
          onClick={() => setShowPayoutDialog(true)}
        >
          <PaymentsIcon />
          <span>Request Payout</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-8 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <MonetizationOnIcon className="text-green-500" />
            <h3 className="text-grey-70">Total Earnings</h3>
          </div>
          <p className="text-2xl font-bold text-white">${totalEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-dark-8 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <AccountBalanceWalletIcon className="text-blue-500" />
            <h3 className="text-grey-70">Available Balance</h3>
          </div>
          <p className="text-2xl font-bold text-white">${availableBalance.toFixed(2)}</p>
        </div>
        <div className="bg-dark-8 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <ReceiptIcon className="text-yellow-500" />
            <h3 className="text-grey-70">Pending Payouts</h3>
          </div>
          <p className="text-2xl font-bold text-white">${pendingPayouts.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-dark-8 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-dark-8 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
        >
          <option value="all">All Types</option>
          <option value="earning">Earnings</option>
          <option value="payout">Payouts</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-dark-8 rounded-lg">
        <DataGrid
          rows={mockTransactions}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 20, 50]}
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
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
              outline: 'none',
            },
          }}
        />
      </div>

      {/* Payout Request Dialog */}
      {showPayoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-8 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Request Payout</h2>
              <button
                onClick={() => {
                  setShowPayoutDialog(false);
                  resetPayoutForm();
                }}
                className="text-grey-70 hover:text-white"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-grey-70 mb-2">Payout Method</label>
                <select
                  name="method"
                  value={payoutData.method}
                  onChange={handleInputChange}
                  className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              <div>
                <label className="block text-grey-70 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-grey-70">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={payoutData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full bg-dark-10 text-white pl-8 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-grey-70 text-sm mt-1">Available balance: ${availableBalance.toFixed(2)}</p>
              </div>

              {payoutData.method === 'bank' ? (
                <>
                  <div>
                    <label className="block text-grey-70 mb-2">Account Holder Name</label>
                    <input
                      type="text"
                      name="accountName"
                      value={payoutData.accountName}
                      onChange={handleInputChange}
                      className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                      placeholder="Enter account holder name"
                    />
                  </div>
                  <div>
                    <label className="block text-grey-70 mb-2">Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={payoutData.accountNumber}
                      onChange={handleInputChange}
                      className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                      placeholder="Enter account number"
                    />
                  </div>
                  <div>
                    <label className="block text-grey-70 mb-2">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={payoutData.bankName}
                      onChange={handleInputChange}
                      className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div>
                    <label className="block text-grey-70 mb-2">SWIFT/BIC Code</label>
                    <input
                      type="text"
                      name="swiftCode"
                      value={payoutData.swiftCode}
                      onChange={handleInputChange}
                      className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                      placeholder="Enter SWIFT/BIC code"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-grey-70 mb-2">UPI ID</label>
                  <input
                    type="text"
                    name="upiId"
                    value={payoutData.upiId}
                    onChange={handleInputChange}
                    className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                    placeholder="Enter UPI ID (e.g., username@upi)"
                  />
                  <p className="text-grey-70 text-sm mt-1">Enter your UPI ID in the format: username@upi</p>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowPayoutDialog(false);
                    resetPayoutForm();
                  }}
                  className="px-4 py-2 text-grey-70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayoutSubmit}
                  className="bg-red-45 text-white px-6 py-2 rounded-lg hover:bg-red-60"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 