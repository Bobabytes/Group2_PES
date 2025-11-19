import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

const PayslipPDFViewer = ({ isOpen, onClose, pdfUrl, fileName, payslipData }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{fileName}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col">
          {/* PDF information */}
          {payslipData && (
            <div className="bg-muted p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Month:</span> {payslipData.month}
                </div>
                <div>
                  <span className="font-medium">Amount:</span> ${payslipData.amount?.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    payslipData.status === 'Paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payslipData.status}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* PDF viewer */}
          <div className="flex-1 border rounded-lg">
            {pdfUrl ? (
              <iframe 
                src={pdfUrl} 
                className="w-full h-full"
                title={fileName}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No PDF available
              </div>
            )}
          </div>
          
          {/* Download button */}
          <div className="flex justify-end mt-4">
            <Button onClick={() => window.open(pdfUrl, '_blank')}>
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