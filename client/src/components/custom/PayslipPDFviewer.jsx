// components/custom/PayslipPDFViewer.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, AlertCircle, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { useState, useEffect } from "react"; // Added useEffect
import { toast } from "sonner";

const PayslipPDFViewer = ({ 
  isOpen, 
  onClose, 
  pdfUrl, 
  fileName, 
  payslipData 
}) => {
  const [pdfError, setPdfError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1.0);

  // Reset state when component opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setPdfError(false);
      setZoom(1.0);
    }
  }, [isOpen]);

  // Enhanced PDF URL
  const enhancedPdfUrl = pdfUrl ? `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH` : '';

  const handlePdfLoad = () => {
    setIsLoading(false);
    setPdfError(false);
  };

  const handlePdfError = () => {
    setIsLoading(false);
    setPdfError(true);
    toast.error("Failed to load PDF document");
  };

  const handleDownload = () => {
    try {
      if (!pdfUrl) {
        throw new Error("No PDF URL available");
      }
      
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName || 'payslip.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Downloading PDF...");
    } catch (error) {
      toast.error("Download failed: " + error.message);
    }
  };

  const handleRetry = () => {
    setPdfError(false);
    setIsLoading(true);
  };

  const handleClose = () => {
    setPdfError(false);
    setIsLoading(true);
    setZoom(1.0);
    onClose();
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3.0));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        {/* Custom Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-lg font-semibold truncate max-w-[300px]">
              {fileName || "Payslip"}
            </span>
            {payslipData && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Month: {payslipData.month}</span>
                <span>Amount: ${payslipData.amount?.toLocaleString()}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  payslipData.status === 'Paid' 
                    ? 'bg-green-100 text-green-800' 
                    : payslipData.status === 'Failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {payslipData.status}
                </span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0 p-6 pt-4">
          {/* PDF viewer */}
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
                  title={fileName || "Payslip PDF"}
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
      </DialogContent>
    </Dialog>
  );
};

export default PayslipPDFViewer;