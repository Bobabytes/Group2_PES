import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PayrollReportDialog = ({ open, onOpenChange }) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle>Company Payroll Report — Q1</DialogTitle>
        </DialogHeader>

        {loading && <p className="text-sm">Loading payroll data…</p>}

        {!loading && report && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Gross Payroll (Q1)</span>
              <span>€{report.grossPayroll.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax Rate</span>
              <span>{report.taxRate * 100}%</span>
            </div>

            <div className="flex justify-between">
              <span>Total Tax</span>
              <span>€{report.taxAmount.toLocaleString()}</span>
            </div>

            <hr />

            <div className="flex justify-between font-semibold">
              <span>Net Payroll</span>
              <span>€{report.netPayroll.toLocaleString()}</span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayrollReportDialog;
