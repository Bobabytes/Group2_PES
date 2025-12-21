// components/custom/PayrollReportDialog.jsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, X, RefreshCw } from "lucide-react";

const PayrollReportDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!open) return;

    const fetchReport = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");

        const res = await fetch(
          "http://localhost:8080/api/finance/payroll-summary",
          {
            headers: { "user-id": userId },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch payroll report");
        }

        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load payroll report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [open]);

  // Handle close
  const handleClose = () => {
    setOpen(false);
  };

  // Refresh data
  const handleRefresh = async () => {
    if (!open) return;
    
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch(
        "http://localhost:8080/api/finance/payroll-summary",
        {
          headers: { "user-id": userId },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch payroll report");
      }

      const data = await res.json();
      setReport(data);
      toast.success("Report refreshed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Could not refresh payroll report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start px-3 py-2 h-auto text-sm truncate quick-action-button"
        >
          <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">Manage Payroll Report</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Company Payroll Report — Q1</DialogTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <p className="text-sm">Loading payroll data…</p>
          </div>
        )}

        {!loading && report && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Gross Payroll (Q1)</h3>
                <p className="text-2xl font-bold">€{report.grossPayroll.toLocaleString()}</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Tax Rate</h3>
                <p className="text-2xl font-bold">{report.taxRate * 100}%</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Tax</h3>
                <p className="text-2xl font-bold">€{report.taxAmount.toLocaleString()}</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Net Payroll</h3>
                <p className="text-2xl font-bold text-primary">€{report.netPayroll.toLocaleString()}</p>
              </div>
            </div>

            {/* Additional details section */}
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3">Breakdown Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Gross Payroll</span>
                  <span className="font-medium">€{report.grossPayroll.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Tax Deduction ({report.taxRate * 100}%)</span>
                  <span className="font-medium text-red-600">-€{report.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Net Payroll</span>
                  <span className="font-bold">€{report.netPayroll.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !report && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium mb-2">No Payroll Data Available</p>
            <p className="text-sm text-center">
              Could not load payroll report. Please try again.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayrollReportDialog;