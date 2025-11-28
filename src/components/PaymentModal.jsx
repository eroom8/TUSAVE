import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mpesaAPI } from '@/services/api';

const PaymentModal = ({ open, onOpenChange, user, onPaymentSuccess }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const predefinedAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handlePredefinedAmount = (predefinedAmount) => {
    setAmount(predefinedAmount.toString());
    setError('');
  };

  const handlePayment = async () => {
    // Validate amount
    if (!amount || amount === '0') {
      setError('Please enter a valid amount');
      return;
    }

    const amountNumber = parseInt(amount);
    if (amountNumber < 1) {
      setError('Minimum amount is KSh 1');
      return;
    }

    if (amountNumber > 150000) {
      setError('Maximum amount is KSh 150,000');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const paymentData = {
        phone: user.phone,
        amount: amountNumber,
        accountReference: `CHAMA_${user.name.toUpperCase().replace(/\s+/g, '_')}_${Date.now()}`
      };

      const response = await mpesaAPI.stkPush(paymentData);
      
      if (response.success) {
        // Show success message
        alert('Payment initiated successfully! Please check your phone to complete the M-Pesa transaction.');
        
        // Reset form
        setAmount('');
        
        // Close modal
        onOpenChange(false);
        
        // Notify parent component
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      } else {
        setError(response.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[#2c6e49] text-xl">Make Contribution</DialogTitle>
          <DialogDescription className="text-[#4c956c]">
            Enter the amount you want to contribute to the Chama
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Predefined Amounts */}
          <div className="space-y-3">
            <Label className="text-[#1e4f34]">Quick Select Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {predefinedAmounts.map((predefinedAmount) => (
                <Button
                  key={predefinedAmount}
                  type="button"
                  variant="outline"
                  className={`h-12 border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white ${
                    amount === predefinedAmount.toString() ? 'bg-[#2c6e49] text-white' : ''
                  }`}
                  onClick={() => handlePredefinedAmount(predefinedAmount)}
                >
                  KSh {predefinedAmount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-[#1e4f34]">
              Or Enter Custom Amount
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className="pr-20 text-lg border-[#a3d9a5] focus:border-[#2c6e49]"
                min="10"
                max="150000"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-[#4c956c] text-sm">KES</span>
              </div>
            </div>
            <p className="text-xs text-[#4c956c]">
              Minimum: KSh 10 | Maximum: KSh 150,000
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Payment Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-medium text-blue-800 text-sm mb-2">Payment Instructions:</h4>
            <ul className="text-blue-700 text-xs space-y-1">
              <li>• Enter your M-Pesa PIN when prompted on your phone</li>
              <li>• You will receive a confirmation message from M-Pesa</li>
              <li>• Transaction will be reflected in your dashboard shortly</li>
              <li>• Keep your phone nearby during the process</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 bg-[#2c6e49] hover:bg-[#1e4f34] text-white"
              onClick={handlePayment}
              disabled={loading || !amount || amount === '0'}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay KSh ${amount ? parseInt(amount).toLocaleString() : '0'}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;