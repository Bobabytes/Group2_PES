import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Search,
  Filter,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  RefreshCw,
  User,
  FileText,
} from "lucide-react";
import PayslipPDFViewer from "@/components/custom/PayslipPDFViewer";

const ManagePaymentsDialog = () => {
  const [open, setOpen] = useState(false);
  const [payslips, setPayslips] = useState([]);
  const [filteredPayslips, setFilteredPayslips] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [userRole, setUserRole] = useState("");

  // PDF state
  const [showPDF, setShowPDF] = useState(false);
  const [pdfPayslip, setPdfPayslip] = useState(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole") || "");
  }, []);

  const hasFinanceAccess = () =>
    ["finance", "administrator", "admin"].includes(userRole.toLowerCase());

  // Fetch payslips from backend
  const fetchPayslips = async () => {
    if (!hasFinanceAccess()) {
      toast.error("Finance/Admin access required");
      return;
    }

    const userId = localStorage.getItem("userId");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/finance/payslips",
        { headers: { "user-id": userId } }
      );

      if (!response.ok) throw new Error("Failed to fetch payslips");

      const data = await response.json();
      setPayslips(data);
      setFilteredPayslips(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && hasFinanceAccess()) {
      fetchPayslips();
    }
  }, [open]);

  // Filtering
  useEffect(() => {
    let filtered = [...payslips];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (p) => p.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredPayslips(filtered);
  }, [searchTerm, statusFilter, payslips]);

  const statusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "Approved":
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case "Paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const updateStatus = async (id, status) => {
    const userId = localStorage.getItem("userId");

    try {
      const endpoint =
        status === "Approved"
          ? "approve"
          : status === "Rejected"
          ? "reject"
          : "pay";

      const response = await fetch(
        `http://localhost:8080/api/finance/payslips/${id}/${endpoint}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "user-id": userId,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success(`Payslip marked as ${status}`);
      fetchPayslips();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!hasFinanceAccess()) return null;

  return (
    <>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="quick-action-button">
            <DollarSign className="w-4 h-4 mr-2" />
            Manage Payments
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <DollarSign className="w-6 h-6" />
              Manage Payments
            </DialogTitle>
            <DialogDescription>
              Review, approve, and finalize employee payments
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden p-6">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    onClick={fetchPayslips}
                    disabled={loading}
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${
                        loading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </Button>

                  <Badge variant="secondary">
                    {filteredPayslips.length} payslip
                    {filteredPayslips.length !== 1 && "s"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Gross</TableHead>
                        <TableHead>Net</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayslips.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <div>
                                <div className="font-medium">
                                  {p.employee_name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {p.employee_id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{p.period}</TableCell>
                          <TableCell>€{p.gross}</TableCell>
                          <TableCell>€{p.net}</TableCell>
                          <TableCell>{statusBadge(p.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {p.status === "Pending" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateStatus(p.id, "Approved")
                                      }
                                      className="text-green-600"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateStatus(p.id, "Rejected")
                                      }
                                      className="text-red-600"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {p.status === "Approved" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateStatus(p.id, "Paid")
                                    }
                                    className="text-blue-600"
                                  >
                                    <Clock className="w-4 h-4 mr-2" />
                                    Mark as Paid
                                  </DropdownMenuItem>
                                )}

                                {["Approved", "Paid"].includes(p.status) && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setPdfPayslip(p);
                                      setShowPDF(true);
                                    }}
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Payslip (PDF)
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF DIALOG */}
      <Dialog
        open={showPDF}
        onOpenChange={(isOpen) => {
          setShowPDF(isOpen);
          if (!isOpen) setPdfPayslip(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Payslip Preview</DialogTitle>
            <DialogDescription>
              Preview and download the selected payslip
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            {pdfPayslip ? (
              <PayslipPDFViewer payslip={pdfPayslip} />
            ) : (
              <div className="p-6 text-muted-foreground">
                No payslip selected.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPDF(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManagePaymentsDialog;
