import { useState } from "react";
import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import { PayslipPDFViewer } from "@/components/custom/PayslipPDFViewer";
import { DollarSign, Calendar, FileText, TrendingUp, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmployeeDashboard = () => {
  const [selectedPayslip, setSelectedPayslip] = useState(null);

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

  // MOCK DATA: Payslips with PDF URLs
  const payslips = [
    { 
      month: "March 2024", 
      amount: 5400, 
      status: "Paid",
      pdfUrl: "/payslips/march-2024-payslip.pdf",
      downloadUrl: "/payslips/march-2024-payslip.pdf"
    },
    { 
      month: "February 2024", 
      amount: 5400, 
      status: "Paid",
      pdfUrl: "/payslips/february-2024-payslip.pdf",
      downloadUrl: "/payslips/february-2024-payslip.pdf"
    },
    { 
      month: "January 2024", 
      amount: 5200, 
      status: "Paid",
      pdfUrl: "/payslips/january-2024-payslip.pdf",
      downloadUrl: "/payslips/january-2024-payslip.pdf"
    },
  ];

  // QUICK BUTTONS: FUNCTIONALITY CHANGES PER ROLE
  const quickActions = [
    { 
      label: "View Payslips", 
      onClick: () => console.log("Navigate to payslips page") 
    },
    { 
      label: "Request Leave", 
      onClick: () => console.log("Open leave request form") 
    },
  ];

  const handleViewPayslip = (payslip) => {
    setSelectedPayslip({
      url: payslip.pdfUrl,
      name: `${payslip.month} Payslip.pdf`,
      month: payslip.month,
      amount: payslip.amount,
      status: payslip.status
    });
  };

  const handleDownloadPayslip = (payslip) => {
    const link = document.createElement('a');
    link.href = payslip.downloadUrl;
    link.download = `${payslip.month} Payslip.pdf`;
    link.click();
  };

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
      <div className="grid gap-6 md:grid-cols-2 animate-in fade-in duration-700 delay-300">
        {/* Payslip List with PDF Integration */}
        <div className="list-card">
          <div className="list-card-header">
            <h3 className="list-card-title">Recent Payslips</h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
          <div className="list-card-content p-0">
            {payslips.map((payslip, index) => (
              <div key={index} className="list-item">
                <div className="list-item-main">
                  <h4 className="list-item-title">{payslip.month}</h4>
                  <p className="list-item-subtitle">Amount: ${payslip.amount.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    payslip.status === 'Paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
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
            ))}
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