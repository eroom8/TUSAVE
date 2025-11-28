import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboardAPI } from '@/services/api';

const Statements = ({ open, onOpenChange, user }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const fetchMonthlySummary = async (year) => {
    setLoading(true);
    try {
      const response = await dashboardAPI.getMonthlySummary(year);
      if (response.success) {
        setMonthlySummary(response.data.monthlySummary || []);
      }
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchMonthlySummary(selectedYear);
    }
  }, [open, selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(parseInt(year));
  };

  const downloadStatement = async (month, year) => {
    // This would typically generate and download a PDF statement
    alert(`Downloading statement for ${month}/${year}`);
    // Implement PDF generation and download logic here
  };

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-KE', { month: 'long' });
  };

  const calculateTotal = () => {
    return monthlySummary.reduce((total, month) => total + (month.totalAmount || 0), 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[#2c6e49] text-xl">Monthly Statements</DialogTitle>
          <DialogDescription className="text-[#4c956c]">
            View and download your monthly contribution statements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Year Selector */}
          <div className="flex items-center justify-between">
            <label className="text-[#1e4f34] font-medium">Select Year:</label>
            <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-32 border-[#a3d9a5]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#2c6e49] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : monthlySummary.length > 0 ? (
            <>
              {/* Annual Summary */}
              <Card className="border-[#a3d9a5] bg-[#edffe8]">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#4c956c] text-sm">Annual Total ({selectedYear})</p>
                      <p className="text-2xl font-bold text-[#2c6e49]">
                        KSh {calculateTotal().toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      className="bg-[#2c6e49] hover:bg-[#1e4f34] text-white"
                      onClick={() => downloadStatement('full', selectedYear)}
                    >
                      Download Annual Statement
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Breakdown */}
              <div className="space-y-3">
                <h3 className="text-[#1e4f34] font-medium">Monthly Breakdown</h3>
                {monthlySummary.map((month) => (
                  <Card key={`${month.year}-${month.month}`} className="border-[#a3d9a5]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#1e4f34]">
                            {month.monthName || getMonthName(month.month)} {month.year}
                          </p>
                          <p className="text-sm text-[#4c956c]">
                            {month.transactionCount || 0} transaction(s)
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#2c6e49]">
                              KSh {month.totalAmount?.toLocaleString() || '0'}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white"
                            onClick={() => downloadStatement(month.month, month.year)}
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#edffe8] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#4c956c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-[#4c956c] text-lg">No data available for {selectedYear}</p>
              <p className="text-sm text-[#4c956c] mt-1">Your monthly statements will appear here</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Statements;