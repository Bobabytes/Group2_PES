import { useState, useEffect } from "react";
import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import PayslipPDFViewer from "@/components/custom/PayslipPDFViewer";
import LeaveRequestForm from "@/components/custom/LeaveRequestForm";
import { DollarSign, Calendar, FileText, TrendingUp, Eye, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Simple LeaveHistory component since it's missing
const LeaveHistory = ({ leaveRequests = [] }) => {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Leave History
      </h3>
      <div className="space-y-4">
        {leaveRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No leave requests yet</p>
            <p className="text-sm">Submit your first leave request to see it here</p>
          </div>
        ) : (
          leaveRequests.map((request) => (
            <div key={request.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium capitalize">{request.leaveType}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    request.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : request.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  </span>
                  <span>{request.daysRequested} days</span>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>{request.requestNumber}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightPayslips, setHighlightPayslips] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);

  // MOCK DATA
  const stats = [
    {
      title: "Current Salary",
      value: "$5,400",
      description: "Monthly gross salary",
      icon: DollarSign,
      borderColor: "border-l-primary",
      iconColor: "text-primary"
    },
    {
      title: "Next Payday",
      value: "Apr 30, 2024",
      description: "Upcoming payment",
      icon: Calendar,
      borderColor: "border-l-accent",
      iconColor: "text-accent"
    },
    {
      title: "YTD Earnings",
      value: "$16,200",
      description: "Year to date",
      icon: TrendingUp,
      borderColor: "border-l-green-400",
      iconColor: "text-green-400"
    },
    {
      title: "Leave Balance",
      value: "12 days",
      description: "Available this year",
      icon: FileText,
      borderColor: "border-l-blue-400",
      iconColor: "text-blue-400"
    },
  ];

  const payslips = [
    { 
      id: 1,
      month: "March 2024", 
      amount: 5400, 
      status: "Paid",
      pdfUrl: "/payslips/sample-payslip-1.pdf",
      downloadUrl: "/payslips/sample-payslip-1.pdf"
    },
    { 
      id: 2,
      month: "February 2024", 
      amount: 5400, 
      status: "Paid",
      pdfUrl: "/payslips/sample-payslip-2.pdf",
      downloadUrl: "/payslips/sample-payslip-2.pdf"
    },
    { 
      id: 3,
      month: "January 2024", 
      amount: 5200, 
      status: "Paid",
      pdfUrl: "/payslips/sample-payslip-3.pdf",
      downloadUrl: "/payslips/sample-payslip-3.pdf"
    },
  ];

  const quickActions = [
    { 
      label: "View Payslips", 
      onClick: () => {
        setHighlightPayslips(true);
        const payslipsSection = document.getElementById('payslips-section');
        if (payslipsSection) {
          payslipsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
        toast.info("Showing your payslips...");
        setTimeout(() => setHighlightPayslips(false), 2000);
      }
    },
    { 
      label: "Request Leave", 
      onClick: () => setShowLeaveForm(true)
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewPayslip = (payslip) => {
    try {
      if (!payslip.pdfUrl) {
        throw new Error("No PDF URL provided for this payslip");
      }
      
      setSelectedPayslip({
        url: payslip.pdfUrl,
        name: `${payslip.month} Payslip.pdf`,
        month: payslip.month,
        amount: payslip.amount,
        status: payslip.status
      });
      toast.success(`Opening ${payslip.month} payslip...`);
    } catch (error) {
      toast.error("Failed to open payslip: " + error.message);
    }
  };

  const handleDownloadPayslip = async (payslip) => {
    try {
      if (!payslip.downloadUrl) {
        throw new Error("No download URL provided");
      }

      const link = document.createElement('a');
      link.href = payslip.downloadUrl;
      link.download = `${payslip.month} Payslip.pdf`;
      link.click();
      toast.success(`Downloading ${payslip.month} payslip...`);
    } catch (error) {
      toast.error(`Download failed: ${error.message}`);
    }
  };

  const handleDownloadAll = async () => {
    try {
      for (const payslip of payslips) {
        try {
          const link = document.createElement('a');
          link.href = payslip.downloadUrl;
          link.download = `${payslip.month} Payslip.pdf`;
          link.click();
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.warn(`Failed to download ${payslip.month}:`, error.message);
        }
      }
      toast.success("Started downloading all payslips");
    } catch (error) {
      toast.error("Failed to download payslips");
    }
  };

  const handleLeaveRequestSubmit = (leaveRequest) => {
    setLeaveRequests(prev => [leaveRequest, ...prev]);
    toast.success("Leave request submitted successfully!");
  };

  const retryLoading = () => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Loading State - FIXED: No <p> containing <div>
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // Error State - FIXED: No <p> containing <div>
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Unable to Load Dashboard</h2>
          <div className="text-muted-foreground mb-4">{error}</div>
          <Button onClick={retryLoading}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="animate-in slide-in-from-top duration-700">
        <h1 className="text-3xl font-bold mb-2">Employee Dashboard</h1>
        <div className="text-muted-foreground">Welcome back! Here's your payroll overview.</div>
      </div>
      
      {/* Stats Grid */}
      <div className="animate-in fade-in duration-700 delay-150">
        <StatsGrid stats={stats} />
      </div>
      
      {/* Quick Actions and Leave History */}
      <div className="grid gap-6 md:grid-cols-2 animate-in fade-in duration-700 delay-300">
        <QuickActions actions={quickActions} />
        <LeaveHistory leaveRequests={leaveRequests} />
      </div>
      
      {/* Payslips Section */}
      <div 
        id="payslips-section"
        className={`animate-in fade-in duration-700 delay-500 transition-all duration-500 ${
          highlightPayslips ? 'ring-2 ring-primary rounded-lg p-2 bg-primary/5' : ''
        }`}
      >
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Payslips</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownloadAll}
              disabled={payslips.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
          <div className="space-y-4">
            {payslips.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <div>No payslips available</div>
              </div>
            ) : (
              payslips.map((payslip) => (
                <div key={payslip.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{payslip.month}</h4>
                    <div className="text-sm text-muted-foreground">Amount: ${payslip.amount.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      payslip.status === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payslip.status}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPayslip(payslip)}
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPayslip(payslip)}
                      className="gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      <PayslipPDFViewer
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        pdfUrl={selectedPayslip?.url || ''}
        fileName={selectedPayslip?.name || ''}
        payslipData={selectedPayslip}
      />

      {/* Leave Request Form Modal */}
      <LeaveRequestForm
        isOpen={showLeaveForm}
        onClose={() => setShowLeaveForm(false)}
        onSubmit={handleLeaveRequestSubmit}
      />
    </div>
  );
};

export default EmployeeDashboard;