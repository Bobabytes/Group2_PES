// components/custom/EmployeeDashboard.jsx
import { useState, useEffect } from "react";
import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import PayslipPDFViewer from "@/components/custom/PayslipPDFViewer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, FileText, TrendingUp, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import { generatePayslipPDFFromDB } from "@/lib/pdfGenerator"; // We'll create this

const EmployeeDashboard = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch payslips from database
  const fetchPayslips = async () => {
    try {
      setLoading(true);
      
      
      // Example using fetch to your API endpoint
      const response = await fetch('/api/payslips');
      
      if (response.ok) {
        const data = await response.json();
        setPayslips(data.payslips || []);
      } else {
        // Fallback to mock data if API fails
        setPayslips(getMockPayslips());
      }
    } catch (error) {
      console.error("Error fetching payslips:", error);
      // Fallback to mock data
      setPayslips(getMockPayslips());
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const getMockPayslips = () => {
    return [
      { id: 1, month: "March 2024", year: 2024, amount: 5400, status: "Paid" },
      { id: 2, month: "February 2024", year: 2024, amount: 5400, status: "Paid" },
      { id: 3, month: "January 2024", year: 2024, amount: 5200, status: "Paid" },
    ];
  };

  // Handle "View Payslips" button click
  const handleViewPayslips = async () => {
    await fetchPayslips();
    setIsDialogOpen(true);
  };

  // Generate PDF from database data
  const generatePDFFromDatabase = async (payslip) => {
    try {
      // This function should:
      // 1. Fetch payslip details from database
      // 2. Generate PDF with that data
      // 3. Return PDF as blob URL
      
      // Fetch complete payslip data from database
      const response = await fetch(`/api/payslips/${payslip.id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch payslip details");
      }
      
      const payslipData = await response.json();
      
      // Generate PDF using database data
      const pdfBlob = await generatePayslipPDFFromDB(payslipData);
      const url = URL.createObjectURL(pdfBlob);
      
      return url;
    } catch (error) {
      console.error("Error generating PDF:", error);
      
      // Fallback: Generate simple PDF with basic data
      return generateFallbackPDF(payslip);
    }
  };

  // Fallback PDF generation
  const generateFallbackPDF = (payslip) => {
    // Import jsPDF dynamically
    import("jspdf").then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      
      // Basic payslip content
      doc.setFontSize(20);
      doc.text("PAYSLIP", 105, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.text(`Period: ${payslip.month}`, 20, 40);
      doc.text(`Amount: $${payslip.amount.toLocaleString()}`, 20, 50);
      doc.text(`Status: ${payslip.status}`, 20, 60);
      
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      return url;
    });
  };

  // Open payslip in viewer
  const openPayslipViewer = async (payslip) => {
    try {
      setSelectedPayslip(payslip);
      
      // Generate PDF from database
      const pdfUrl = await generatePDFFromDatabase(payslip);
      
      setPdfUrl(pdfUrl);
      setIsViewerOpen(true);
      setIsDialogOpen(false);
      
      toast.success("Payslip loaded successfully");
    } catch (error) {
      toast.error("Failed to load payslip");
      console.error(error);
    }
  };

  // Download payslip directly
  const handleDownloadPayslip = async (payslip) => {
    try {
      const pdfUrl = await generatePDFFromDatabase(payslip);
      
      // Trigger download
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `payslip_${payslip.month.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl); // Clean up
      
      toast.success("Payslip downloaded successfully");
    } catch (error) {
      toast.error("Download failed");
      console.error(error);
    }
  };

  // Close PDF viewer
  const closeViewer = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setSelectedPayslip(null);
    setIsViewerOpen(false);
  };

  // Connected quick actions
  const quickActions = [
    { 
      label: "View Payslips", 
      onClick: handleViewPayslips // Connected!
    },
    { 
      label: "Request Leave", 
      onClick: () => toast.info("Leave request coming soon!") 
    },
  ];

  // Stats data
   const stats = [
    {
      title: "Current Salary",
      value: "$5,400 (Mock)",
      description: "Monthly Gross Pay (Fetch from employee salary details)",
      icon: DollarSign,
      borderColor: "border-l-primary",
      iconColor: "text-primary"
    },
    {
      title: "Next Payment",
      value: "March 31, 2025 (Mock)",
      description: "{x} Days Remaining (Fetch from payment schedule - current date)",
      icon: Calendar,
      borderColor: "border-l-accent",
      iconColor: "text-accent"
    },
    {
      title: "YTD Earnings",
      value: "$16,200 (Mock)",
      description: "Year to date (Fetch from employee earnings records)",
      icon: TrendingUp,
      borderColor: "border-l-accent",
      iconColor: "text-secondary-foreground"
    },
    {
      title: "Leave Balance",
      value: "12 days (Mock)",
      description: "Available this year (Fetch current user's available leaves)",
      icon: FileText,
      borderColor: "border-l-accent",
      iconColor: "text-accent"
    },
  ];

  // Initialize on component mount
  useEffect(() => {
    fetchPayslips();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Welcome back.</h1>
      <StatsGrid stats={stats} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <PayslipList 
          payslips={payslips} 
          title="Personal Payslips"
          loading={loading}
          onViewPayslip={openPayslipViewer}
          onDownloadPayslip={handleDownloadPayslip}
        />
        <QuickActions actions={quickActions} title="Employee Actions" />
      </div>

      {/* Payslip Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Payslip to View</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : payslips.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No payslips found
              </p>
            ) : (
              payslips.map((payslip) => (
                <div
                  key={payslip.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold">{payslip.month}</h3>
                    <p className="text-sm text-muted-foreground">
                      Amount: ${payslip.amount?.toLocaleString()} | Status: {payslip.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openPayslipViewer(payslip)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadPayslip(payslip)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      
      <PayslipPDFViewer
        isOpen={isViewerOpen}
        onClose={closeViewer}
        pdfUrl={pdfUrl}
        fileName={selectedPayslip ? 
          `Payslip_${selectedPayslip.month.replace(/\s+/g, '_')}.pdf` : 
          "Payslip.pdf"
        }
        payslipData={selectedPayslip}
      />
    </div>
  );
};

export default EmployeeDashboard;