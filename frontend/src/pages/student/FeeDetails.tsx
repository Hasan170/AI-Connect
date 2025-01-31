import React, { useState } from 'react';
import { DollarSign, CreditCard, Clock, AlertCircle, FileText, Download, ChevronRight, X } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  type: 'class' | 'materials' | 'registration';
  invoice?: string;
}

interface FeeBalance {
  totalDue: number;
  nextPayment: number;
  dueDate: string;
  currency: string;
}

const TermsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-text-primary">Payment Terms & Conditions</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4 text-gray-600">
          <h4 className="font-semibold text-text-primary">1. Payment Schedule</h4>
          <p>All payments are due by the specified due date. Late payments may incur additional charges.</p>
          
          <h4 className="font-semibold text-text-primary">2. Payment Methods</h4>
          <p>We accept credit cards, debit cards, and bank transfers. All transactions are secure and encrypted.</p>
          
          <h4 className="font-semibold text-text-primary">3. Refund Policy</h4>
          <p>Refund requests must be made within 7 days of payment. Processing time is 5-7 business days.</p>
          
          <h4 className="font-semibold text-text-primary">4. Late Payment</h4>
          <p>A late fee of 5% will be applied to payments received after the due date.</p>
          
          <h4 className="font-semibold text-text-primary">5. Account Suspension</h4>
          <p>Access to classes may be suspended if payment remains overdue for more than 15 days.</p>
        </div>
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-navbar text-white py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

const FeeDetails = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [balance] = useState<FeeBalance>({
    totalDue: 1250,
    nextPayment: 250,
    dueDate: '2025-02-15',
    currency: 'USD'
  });

  const [payments] = useState<Payment[]>([
    {
      id: '1',
      date: '2025-02-01',
      amount: 250,
      status: 'paid',
      type: 'class',
      invoice: 'INV-2025-001'
    },
    {
      id: '2',
      date: '2025-02-15',
      amount: 250,
      status: 'pending',
      type: 'class'
    },
    {
      id: '3',
      date: '2025-01-15',
      amount: 50,
      status: 'paid',
      type: 'materials',
      invoice: 'INV-2025-002'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: balance.currency
    }).format(amount);
  };

  const handlePayNow = () => {
    console.log('Processing payment...');
  };

  return (
    <div className="flex">
      <StudentSidebar onNotebookClick={() => {}} />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">Fee Details</h1>
            <p className="text-text-secondary mt-2">Manage your payments and view transaction history</p>
          </div>

          {/* Balance Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-secondary mb-2">Total Balance Due</p>
                  <p className="text-3xl font-bold text-text-primary">{formatCurrency(balance.totalDue)}</p>
                </div>
                <DollarSign className="text-navbar" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-secondary mb-2">Next Payment</p>
                  <p className="text-3xl font-bold text-text-primary">{formatCurrency(balance.nextPayment)}</p>
                </div>
                <CreditCard className="text-navbar" size={24} />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Clock size={16} className="text-gray-400" />
                <p className="text-sm text-gray-500">Due: {new Date(balance.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <button
                onClick={handlePayNow}
                className="w-full bg-navbar text-white py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Pay Now
              </button>
              <p className="text-sm text-gray-500 text-center mt-4">Secure payment gateway</p>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-text-primary">Payment History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="capitalize">{payment.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.invoice ? (
                          <button className="text-navbar hover:text-opacity-80 flex items-center gap-1">
                            <Download size={16} />
                            {payment.invoice}
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-navbar" size={20} />
              <h2 className="text-lg font-semibold text-text-primary">Payment Information</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>Please ensure timely payments to maintain uninterrupted access to classes.</p>
              <p>For any payment-related queries, contact our support team.</p>
              <div 
                onClick={() => setShowTerms(true)}
                className="flex items-center gap-2 text-navbar hover:text-opacity-80 cursor-pointer"
              >
                <FileText size={16} />
                <span>View Payment Terms</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>

          <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
        </div>
      </div>
    </div>
  );
};

export default FeeDetails;