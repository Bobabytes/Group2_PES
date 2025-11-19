import { useState, useEffect } from "react";
import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import PayslipPDFViewer from "@/components/custom/PayslipPDFViewer";
import { DollarSign, Calendar, FileText, TrendingUp, Eye, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EmployeeDashboard = () => {
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightPayslips, setHighlightPayslips] = useState(false);

  // MOCK DATA: REPLACE WITH DATABASE QUERIES LATER
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

  // LOCAL SAMPLE PDFs STRUCTURE
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
    { 
      id: 4,
      month: "December 2023", 
      amount: 5200, 
      status: "Paid",
      pdfUrl: "/payslips/sample-payslip-4.pdf",
      downloadUrl: "/payslips/sample-payslip-4.pdf"
    },
  ];

  // QUICK BUTTONS: FUNCTIONALITY CHANGES PER ROLE
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
      onClick: () => toast.info("Opening leave request form...") 
    },
  ];

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (Math.random() < 0.2) {
        setError("Failed to load dashboard data. Please try again.");
      }
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

      // For local files, we can create a direct download link
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
          
          // Add a small delay between downloads
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

  const retryLoading = () => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Unable to Load Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
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
        <p className="text-muted-foreground">Welcome back! Here's your payroll overview.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="animate-in fade-in duration-700 delay-150">
        <StatsGrid stats={stats} />
      </div>
      
      {/* Payslips and Quick Actions */}
      <div 
        id="payslips-section"
        className={`grid gap-6 md:grid-cols-2 animate-in fade-in duration-700 delay-300 transition-all duration-500 ${
          highlightPayslips ? 'ring-2 ring-primary rounded-lg p-2 bg-primary/5' : ''
        }`}
      >
        {/* Payslip List with PDF Integration */}
        <div className="list-card">
          <div className="list-card-header">
            <h3 className="list-card-title">Recent Payslips</h3>
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
          <div className="list-card-content p-0">
            {payslips.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No payslips available</p>
              </div>
            ) : (
              payslips.map((payslip) => (
                <div key={payslip.id} className="list-item">
                  <div className="list-item-main">
                    <h4 className="list-item-title">{payslip.month}</h4>
                    <p className="list-item-subtitle">Amount: ${payslip.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      payslip.status === 'Paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : payslip.status === 'Failed'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
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

        {/* Quick Actions */}
        <QuickActions actions={quickActions} />
      </div>

      {/* PDF Viewer Modal */}
      <PayslipPDFViewer
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        pdfUrl={selectedPayslip?.url || ''}
        fileName={selectedPayslip?.name || ''}
        payslipData={selectedPayslip}
      />
    </div>
  );
};

export default EmployeeDashboard;