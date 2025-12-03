// components/custom/PayslipPDFViewer.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, X, AlertCircle, RefreshCw, ZoomIn, ZoomOut, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

export default function PayslipPDFViewer() {
  // PDF viewer state
  const [pdfUrl, setPdfUrl] = useState(null);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [pdfError, setPdfError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  
  // Mock payslip data (replace with API/database data)
  const mockPayslips = [
    { id: 1, month: "March", year: 2024, amount: 5400, status: "Paid" },
    { id: 2, month: "February", year: 2024, amount: 5400, status: "Paid" },
    { id: 3, month: "January", year: 2024, amount: 5200, status: "Paid" },
  ];

  // Generate PDF using jsPDF
  const generatePayslipPDF = (payslip) => {
    const doc = new jsPDF();
    
    // Company Header
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    doc.text("COMPANY PAYSLIP", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("123 Business Street, City, Country", 105, 30, { align: "center" });
    doc.text("Tel: (123) 456-7890 | Email: payroll@company.com", 105, 36, { align: "center" });
    
    // Employee Information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Employee: John Doe`, 20, 55);
    doc.text(`Employee ID: EMP001`, 20, 62);
    doc.text(`Position: Developer`, 20, 69);
    
    // Payslip Period
    doc.text(`Period: ${payslip.month} ${payslip.year}`, 130, 55);
    doc.text(`Payment Date: ${new Date().toLocaleDateString()}`, 130, 62);
    doc.text(`Status: ${payslip.status}`, 130, 69);
    
    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 75, 190, 75);
    
    // Earnings Section
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 0); // Green
    doc.text("EARNINGS", 20, 85);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Basic Salary
    doc.text("Basic Salary", 30, 95);
    doc.text(`$${payslip.amount.toFixed(2)}`, 160, 95, { align: "right" });
    
    // Allowances
    const housingAllowance = payslip.amount * 0.10;
    const transportAllowance = 200.00;
    const mealAllowance = 150.00;
    
    doc.text("Housing Allowance", 30, 105);
    doc.text(`$${housingAllowance.toFixed(2)}`, 160, 105, { align: "right" });
    
    doc.text("Transport Allowance", 30, 115);
    doc.text(`$${transportAllowance.toFixed(2)}`, 160, 115, { align: "right" });
    
    doc.text("Meal Allowance", 30, 125);
    doc.text(`$${mealAllowance.toFixed(2)}`, 160, 125, { align: "right" });
    
    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 135, 190, 135);
    
    // Deductions Section
    doc.setFontSize(14);
    doc.setTextColor(204, 0, 0); // Red
    doc.text("DEDUCTIONS", 20, 145);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Example deductions
    const tax = payslip.amount * 0.15;
    const insurance = 120.00;
    const pension = payslip.amount * 0.05;
    
    doc.text("Income Tax", 30, 155);
    doc.text(`-$${tax.toFixed(2)}`, 160, 155, { align: "right" });
    
    doc.text("Health Insurance", 30, 165);
    doc.text(`-$${insurance.toFixed(2)}`, 160, 165, { align: "right" });
    
    doc.text("Pension Contribution", 30, 175);
    doc.text(`-$${pension.toFixed(2)}`, 160, 175, { align: "right" });
    
    // Line separator
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 185, 190, 185);
    
    // Total Calculations
    const totalEarnings = payslip.amount + housingAllowance + transportAllowance + mealAllowance;
    const totalDeductions = tax + insurance + pension;
    const netPay = totalEarnings - totalDeductions;
    
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text("TOTAL EARNINGS", 30, 195);
    doc.text(`$${totalEarnings.toFixed(2)}`, 160, 195, { align: "right" });
    
    doc.text("TOTAL DEDUCTIONS", 30, 205);
    doc.text(`-$${totalDeductions.toFixed(2)}`, 160, 205, { align: "right" });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text("NET PAY", 30, 220);
    doc.text(`$${netPay.toFixed(2)}`, 160, 220, { align: "right" });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.text("This is a computer-generated document. No signature required.", 105, 250, { align: "center" });
    doc.text("Confidential - For employee use only", 105, 256, { align: "center" });
    doc.text(`Payslip ID: ${payslip.id} | Generated: ${new Date().toLocaleString()}`, 105, 262, { align: "center" });
    
    // Generate PDF as blob
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    
    return url;
  };

  // Handle view payslip
  const handleViewPayslip = (payslip) => {
    try {
      setSelectedPayslip(payslip);
      setIsLoading(true);
      setPdfError(false);
      
      // Generate PDF
      const url = generatePayslipPDF(payslip);
      setPdfUrl(url);
      
      toast.success("Payslip loaded successfully");
    } catch (error) {
      toast.error("Failed to generate payslip");
      console.error(error);
    }
  };

  // PDF load handlers
  const handlePdfLoad = () => {
    setIsLoading(false);
    setPdfError(false);
  };

  const handlePdfError = () => {
    setIsLoading(false);
    setPdfError(true);
    toast.error("Failed to load PDF document");
  };

  // Download PDF
  const handleDownload = () => {
    try {
      if (!pdfUrl) {
        throw new Error("No PDF URL available");
      }
      
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = selectedPayslip ? 
        `Payslip_${selectedPayslip.month}_${selectedPayslip.year}.pdf` : 
        'payslip.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Downloading PDF...");
    } catch (error) {
      toast.error("Download failed: " + error.message);
    }
  };

  const handleRetry = () => {
    if (selectedPayslip) {
      const url = generatePayslipPDF(selectedPayslip);
      setPdfUrl(url);
      setPdfError(false);
      setIsLoading(true);
    }
  };

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setSelectedPayslip(null);
    setPdfError(false);
    setIsLoading(true);
    setZoom(1.0);
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3.0));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  // Enhanced PDF URL for iframe
  const enhancedPdfUrl = pdfUrl ? `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH` : '';

  return (
    <Dialog>
      {/* BUTTON - EXACTLY like LeaveRequestDialog */}
      <DialogTrigger asChild>
        <Button variant="outline" className="quick-action-button">
          <FileText className="w-4 h-4 mr-2" />
          View Payslips
        </Button>
      </DialogTrigger>

      {/* DIALOG CONTENT - Keep your existing size */}
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-lg font-semibold truncate max-w-[300px]">
              {selectedPayslip ? 
                `Payslip_${selectedPayslip.month}_${selectedPayslip.year}.pdf` : 
                "Select Payslip"}
            </span>
            {selectedPayslip && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Month: {selectedPayslip.month}</span>
                <span>Amount: ${selectedPayslip.amount?.toLocaleString()}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  selectedPayslip.status === 'Paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedPayslip.status}
                </span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Payslip Selection (if no payslip selected yet) */}
        {!selectedPayslip && (
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>Select a Payslip to View</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {mockPayslips.map((payslip) => (
                <div
                  key={payslip.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleViewPayslip(payslip)}
                >
                  <div>
                    <h4 className="font-semibold">{payslip.month} {payslip.year}</h4>
                    <p className="text-sm text-muted-foreground">
                      Amount: ${payslip.amount?.toLocaleString()} | Status: {payslip.status}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* PDF Viewer (when payslip is selected) */}
        {selectedPayslip && (
          <div className="flex-1 flex flex-col min-h-0 p-6 pt-4">
            <div className="flex-1 border rounded-lg relative min-h-0 bg-gray-100">
              {isLoading && !pdfError && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Loading PDF...</p>
                  </div>
                </div>
              )}
              
              {pdfError ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                  <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                  <p className="text-lg font-medium mb-2">Failed to Load PDF</p>
                  <p className="text-sm text-center mb-4">
                    The payslip PDF could not be loaded.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRetry}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                    <Button onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Try Download
                    </Button>
                  </div>
                </div>
              ) : pdfUrl ? (
                <div className="w-full h-full overflow-auto">
                  <iframe 
                    src={enhancedPdfUrl}
                    className="w-full h-full"
                    title={selectedPayslip ? 
                      `Payslip_${selectedPayslip.month}_${selectedPayslip.year}.pdf` : 
                      "Payslip.pdf"}
                    onLoad={handlePdfLoad}
                    onError={handlePdfError}
                    style={{ 
                      border: 'none',
                      transform: `scale(${zoom})`,
                      transformOrigin: '0 0',
                      width: `${100 / zoom}%`,
                      height: `${100 / zoom}%`
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                  <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No PDF Available</p>
                  <p className="text-sm text-center">
                    This payslip doesn't have a PDF document attached.
                  </p>
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {pdfError ? "PDF load failed" : isLoading ? "Loading..." : "PDF loaded successfully"}
                </span>
                
                {!isLoading && !pdfError && pdfUrl && (
                  <div className="flex items-center gap-1 ml-4">
                    <Button variant="outline" size="sm" onClick={zoomOut} disabled={zoom <= 0.5}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-xs px-2 text-muted-foreground">{Math.round(zoom * 100)}%</span>
                    <Button variant="outline" size="sm" onClick={zoomIn} disabled={zoom >= 3.0}>
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleDownload} 
                disabled={!pdfUrl || pdfError}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}