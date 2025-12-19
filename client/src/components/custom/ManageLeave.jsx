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
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  Download,
  RefreshCw,
  User,
  FileText,
} from "lucide-react";

const ManageLeavesDialog = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "";
    setUserRole(role);
  }, []);

  const isAdminOrHR = () => {
    const roleLower = userRole?.toLowerCase() || "";
    return ["administrator", "admin", "hr", "manager"].includes(roleLower);
  };

  const fetchLeaveRequests = async () => {
    if (!isAdminOrHR()) {
      toast.error("Access denied. HR/Admin access required.");
      return;
    }

    const userId = localStorage.getItem("userId");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/admin/leaves", {
        headers: { "user-id": userId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leave requests");
      }

      const data = await response.json();
      setLeaves(data);
      setFilteredLeaves(data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && isAdminOrHR()) {
      fetchLeaveRequests();
    }
  }, [open]);

  useEffect(() => {
    filterLeaves();
  }, [searchTerm, statusFilter, typeFilter, leaves]);

  const filterLeaves = () => {
    let filtered = [...leaves];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (leave) =>
          leave.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leave.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leave.leave_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter - fix case sensitivity
    if (statusFilter !== "all") {
      filtered = filtered.filter((leave) => 
        leave.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((leave) => leave.leave_type === typeFilter);
    }

    setFilteredLeaves(filtered);
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="w-4 h-4 mr-2" />,
          badge: (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Approved
            </Badge>
          ),
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Clock className="w-4 h-4 mr-2" />,
          badge: (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              Pending
            </Badge>
          ),
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircle className="w-4 h-4 mr-2" />,
          badge: (
            <Badge className="bg-red-100 text-red-800 border-red-200">
              Rejected
            </Badge>
          ),
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <AlertCircle className="w-4 h-4 mr-2" />,
          badge: <Badge variant="outline">Unknown</Badge>,
        };
    }
  };

  const formatLeaveType = (type) => {
    if (!type) return "Leave";
    return type;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const calculateDays = (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } catch {
      return 0;
    }
  };

  const handleApproveLeave = async () => {
    if (!selectedLeave) return;

    setIsApproving(true);
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/leaves/${selectedLeave.leave_id}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "user-id": userId,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to approve leave");

      toast.success("Leave request approved!");
      setShowApproveDialog(false);
      setSelectedLeave(null);
      fetchLeaveRequests(); // Refresh the list
    } catch (error) {
      console.error("Error approving leave:", error);
      toast.error(error.message);
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectLeave = async () => {
    if (!selectedLeave) return;

    setIsRejecting(true);
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/leaves/${selectedLeave.leave_id}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "user-id": userId,
          },
          body: JSON.stringify({
            rejection_reason: rejectionReason,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to reject leave");

      toast.success("Leave request rejected!");
      setShowRejectDialog(false);
      setSelectedLeave(null);
      setRejectionReason("");
      fetchLeaveRequests(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting leave:", error);
      toast.error(error.message);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    toast.info(`Viewing details for ${leave.employee_name}'s leave request`);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Employee,Leave Type,Start Date,End Date,Days,Status,Reason"]
      .concat(
        leaves.map(leave => 
          `"${leave.employee_name}","${leave.leave_type}","${leave.start_date}","${leave.end_date}","${calculateDays(leave.start_date, leave.end_date)}","${leave.status}","${leave.reason || 'N/A'}"`
        )
      )
      .join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leave_requests.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Leave requests exported to CSV");
  };

  const handleOpenChange = (isOpen) => {
    if (!isAdminOrHR() && isOpen) {
      toast.error("HR/Admin access required to manage leaves");
      return;
    }
    setOpen(isOpen);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="quick-action-button">
            <FileText className="w-4 h-4 mr-2" />
            Manage Leave Requests
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Calendar className="w-6 h-6" />
                  Manage Leave Requests
                </DialogTitle>
                <DialogDescription>
                  Review and approve/reject employee leave requests
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {userRole}
                </Badge>
                <Button variant="outline" onClick={handleExportCSV} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
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
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center justify-between gap-2">
                    <Button 
                      variant="outline" 
                      onClick={fetchLeaveRequests} 
                      disabled={loading}
                      size="sm"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                    
                    {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
                      <Button 
                        variant="ghost" 
                        onClick={resetFilters}
                        size="sm"
                      >
                        Clear Filters
                      </Button>
                    )}
                    
                    <Badge variant="secondary">
                      {filteredLeaves.length} request{filteredLeaves.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leave Requests Table */}
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                <p className="text-muted-foreground">Loading leave requests...</p>
              </div>
            ) : filteredLeaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Calendar className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-1">No leave requests found</p>
                <p className="text-sm">
                  {leaves.length === 0
                    ? "No leave requests have been submitted yet."
                    : "Try changing your filters."}
                </p>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Leave Type</TableHead>
                          <TableHead>Date Range</TableHead>
                          <TableHead>Days</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLeaves.map((leave) => {
                          const statusInfo = getStatusInfo(leave.status);
                          const days = calculateDays(leave.start_date, leave.end_date);

                          return (
                            <TableRow key={leave.leave_id} className="hover:bg-muted/50">
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{leave.employee_name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {leave.employee_position} • {leave.employee_id}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{formatLeaveType(leave.leave_type)}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Submitted: {formatDate(leave.created_at)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">{days} days</Badge>
                              </TableCell>
                              <TableCell>{statusInfo.badge}</TableCell>
                              <TableCell className="max-w-[200px]">
                                <div className="truncate" title={leave.reason}>
                                  {leave.reason || "No reason provided"}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewDetails(leave)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    {leave.status === "Pending" && (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setSelectedLeave(leave);
                                            setShowApproveDialog(true);
                                          }}
                                          className="text-green-600"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Approve Leave
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setSelectedLeave(leave);
                                            setRejectionReason("");
                                            setShowRejectDialog(true);
                                          }}
                                          className="text-red-600"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject Leave
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-muted-foreground">
                Showing {filteredLeaves.length} of {leaves.length} requests
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* APPROVE DIALOG - SEPARATE FROM MAIN DIALOG */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this leave request?
            </DialogDescription>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Leave Details</p>
                    <p className="text-sm text-green-700">
                      <span className="font-semibold">{selectedLeave.employee_name}</span> • {selectedLeave.employee_id}
                    </p>
                    <p className="text-sm text-green-700">
                      {formatLeaveType(selectedLeave.leave_type)}
                    </p>
                    <p className="text-sm text-green-700">
                      {formatDate(selectedLeave.start_date)} to {formatDate(selectedLeave.end_date)}
                      <span className="ml-2">({calculateDays(selectedLeave.start_date, selectedLeave.end_date)} days)</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedLeave.reason && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                  <p className="text-sm text-gray-600">{selectedLeave.reason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowApproveDialog(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApproveLeave} 
              className="bg-green-600 hover:bg-green-700"
              disabled={isApproving}
            >
              {isApproving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Leave
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECT DIALOG - SEPARATE FROM MAIN DIALOG */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this leave request.
            </DialogDescription>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Leave Details</p>
                    <p className="text-sm text-red-700">
                      <span className="font-semibold">{selectedLeave.employee_name}</span> • {selectedLeave.employee_id}
                    </p>
                    <p className="text-sm text-red-700">
                      {formatLeaveType(selectedLeave.leave_type)}
                    </p>
                    <p className="text-sm text-red-700">
                      {formatDate(selectedLeave.start_date)} to {formatDate(selectedLeave.end_date)}
                      <span className="ml-2">({calculateDays(selectedLeave.start_date, selectedLeave.end_date)} days)</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Rejection Reason (Optional)</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Enter reason for rejection (this will be visible to the employee)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Providing a reason is recommended but not required.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
              }}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectLeave}
              className="bg-red-600 hover:bg-red-700"
              disabled={isRejecting}
            >
              {isRejecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Leave
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageLeavesDialog;