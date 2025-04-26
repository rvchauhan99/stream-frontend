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
  CurrencyDollarIcon,
  WalletIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

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

const columnHelper = createColumnHelper<Transaction>();

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

  const handleDownload = (id: number) => {
    // Handle receipt download
    console.log('Downloading receipt for transaction:', id);
  };

  const columns = [
    columnHelper.accessor('date', {
      header: 'Date',
      cell: (info) => (
        <div className="flex items-center space-x-2">
          <CalendarDaysIcon className="h-5 w-5 text-grey-70" />
          <span>{new Date(info.getValue()).toLocaleDateString()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => (
        <div className={`flex items-center space-x-1 ${info.row.original.type === 'earning' ? 'text-green-500' : 'text-red-45'}`}>
          <CurrencyDollarIcon className="h-5 w-5" />
          <span>${info.getValue().toFixed(2)}</span>
        </div>
      ),
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => (
        <span className={`px-3 py-1 rounded-md text-xs ${
          info.getValue() === 'earning' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'
        }`}>
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span className={`px-3 py-1 rounded-md text-xs ${
          info.getValue() === 'completed' ? 'bg-green-900 text-green-300' :
          info.getValue() === 'processing' ? 'bg-yellow-900 text-yellow-300' :
          'bg-blue-900 text-blue-300'
        }`}>
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </span>
      ),
    }),
    columnHelper.accessor('reference', {
      header: 'Reference',
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('source', {
      header: 'Source',
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <button
          onClick={() => handleDownload(info.row.original.id)}
          className="text-grey-70 hover:text-white"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: mockTransactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
          <CurrencyDollarIcon className="h-5 w-5" />
          <span>Request Payout</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-8 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            <h3 className="text-grey-70">Total Earnings</h3>
          </div>
          <p className="text-2xl font-bold text-white">${totalEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-dark-8 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <WalletIcon className="h-8 w-8 text-blue-500" />
            <h3 className="text-grey-70">Available Balance</h3>
          </div>
          <p className="text-2xl font-bold text-white">${availableBalance.toFixed(2)}</p>
        </div>
        <div className="bg-dark-8 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <CreditCardIcon className="h-8 w-8 text-yellow-500" />
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
      <div className="bg-dark-8 rounded-lg overflow-hidden">
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
                <XMarkIcon className="h-6 w-6" />
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