import React, { useState, useEffect } from 'react';
import { CreditCard, FileText, Download, ChevronRight, X, AlertCircle } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';

// Updated Rupee icon component with simpler, cleaner design
const RupeeIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 3h12M6 8h12M13 21l-3-13" />
    <path d="M6 13h3c3 0 5-2 5-5" />
  </svg>
);

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
  currency: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const FeeDetails = () => {
  const [balance] = useState<FeeBalance>({
    totalDue: 500, // Set a test amount for the Razorpay demo
    currency: 'INR'
  });

  const [payments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load Razorpay script on component mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: balance.currency
    }).format(amount);
  };

  const handlePayNow = () => {
    setIsLoading(true);
    
    // In the handlePayNow function
    const options = {
      key: 'rzp_live_VVQ3SO2EEv78so', // Updated with your actual Razorpay key
      amount: balance.totalDue * 100, // Razorpay expects amount in paise
      currency: balance.currency,
      name: 'AI-Connect',
      description: 'Tuition Fee Payment',
      image: 'https://your-logo-url.com/logo.png', // Replace with your logo URL
      handler: function(response: any) {
        // This function runs after successful payment
        console.log('Payment successful:', response);
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        
        // Here you would typically call your backend API to verify and record the payment
        // For now, we're just logging to console
      },
      prefill: {
        name: 'Student Name', // In real implementation, get from student profile
        email: 'student@example.com', // In real implementation, get from student profile
        contact: '9876543210' // In real implementation, get from student profile
      },
      theme: {
        color: '#3c4e92' // Match your navbar color
      },
      modal: {
        ondismiss: function() {
          setIsLoading(false);
        }
      }
    };

    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Error initializing Razorpay", err);
      alert("Unable to load payment gateway. Please try again later.");
      setIsLoading(false);
    }
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

          {/* Simplified Payment Block */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-secondary mb-2">Payment Due</p>
                  <p className="text-3xl font-bold text-text-primary">{formatCurrency(balance.totalDue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <button
                onClick={handlePayNow}
                disabled={isLoading || balance.totalDue <= 0}
                className={`w-full py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                  ${isLoading || balance.totalDue <= 0 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                    : 'bg-navbar text-white hover:bg-opacity-90'}`}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay Now
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 text-center mt-4">Secure payment via Razorpay</p>
            </div>
          </div>

          {/* Payment History - Empty State */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-text-primary">Payment History</h2>
            </div>
            
            <div className="p-12 flex flex-col items-center justify-center">
              <AlertCircle size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No Payment History</h3>
              <p className="text-gray-400 text-center max-w-md">
                You don't have any payment records yet. Your payment history will appear here once you make your first payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDetails;