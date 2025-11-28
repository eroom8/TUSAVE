import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { transactionsAPI } from '@/services/api';

const TransactionHistory = ({ open, onOpenChange, user }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (open) {
      fetchTransactions();
    }
  }, [open, currentPage]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionsAPI.getMyTransactions();
      if (response.success) {
        setTransactions(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[#2c6e49] text-xl">Transaction History</DialogTitle>
          <DialogDescription className="text-[#4c956c]">
            View all your Chama contributions and payments
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#2c6e49] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : transactions.length > 0 ? (
            <>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <Card key={transaction._id} className="border-[#a3d9a5]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {transaction.status || 'Completed'}
                            </div>
                            <div>
                              <p className="font-medium text-[#1e4f34] capitalize">
                                {transaction.paymentType || 'Contribution'}
                              </p>
                              <p className="text-sm text-[#4c956c]">
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#2c6e49]">
                            KSh {transaction.amount?.toLocaleString()}
                          </p>
                          <p className="text-sm text-[#4c956c]">
                            Receipt: {transaction.mpesaReceiptNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 pt-4">
                  <Button
                    variant="outline"
                    className="border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-[#4c956c]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    className="border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#edffe8] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#4c956c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-[#4c956c] text-lg">No transactions found</p>
              <p className="text-sm text-[#4c956c] mt-1">Your transaction history will appear here</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionHistory;