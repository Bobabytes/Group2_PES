import { Button } from "@/components/ui/button"
import { Dialog , DialogClose , DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileText, BookUser, CalendarDays, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LeaveRequestDialog() {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");  
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const todayStr = new Date().toISOString().split("T")[0];

  // Fetch user's leave balance
  useEffect(() => {
    const fetchLeaveBalance = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        setBalanceLoading(true);
        const response = await fetch("http://localhost:8080/api/employee/dashboard-stats", {
          headers: { "user-id": userId },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Extract just the number from "12 days" format
          const balance = parseInt(data.leaveBalance) || 0;
          setLeaveBalance(balance);
        }
      } catch (error) {
        console.error("Error fetching leave balance:", error);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchLeaveBalance();
  }, []);

  // Calculate days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      setCalculatedDays(days);
    } else {
      setCalculatedDays(0);
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!leaveType || !startDate || !endDate) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start <= today) {
      setError("Start date must be after today.");
      setLoading(false);
      return;
    }
    
    if (end <= start) {
      setError("End date must be after the start date.");
      setLoading(false);
      return;
    }

    // Check if user has enough leave balance
    if (calculatedDays > leaveBalance) {
      setError(`You only have ${leaveBalance} days of leave balance, but requested ${calculatedDays} days.`);
      setLoading(false);
      return;
    }

    console.log("Submitting leave request:", {
      leaveType,
      startDate,
      endDate,
      reason,
      calculatedDays
    });

    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch("http://localhost:8080/api/leave-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usersId: userId,
          leaveType,
          startDate,
          endDate,
          reason: reason || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to submit leave request.");
        setLoading(false);
        return;
      }

      toast.success(`Leave request submitted successfully! ${calculatedDays} days requested.`);
      
      // Reset form
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
      setCalculatedDays(0);
      
      // Close dialog
      document.querySelector('[data-state="open"] button[data-close]')?.click();
      
      // Refresh balance if needed
      // You could trigger a refresh of parent component's balance here

    } catch (err) {
      setError("Network error. Please try again later.");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to get max end date (e.g., based on leave balance)
  const getMaxEndDate = () => {
    if (!startDate || leaveBalance === 0) return "";
    
    const start = new Date(startDate);
    const maxEndDate = new Date(start);
    maxEndDate.setDate(start.getDate() + leaveBalance - 1);
    
    return maxEndDate.toISOString().split("T")[0];
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="quick-action-button">
          <BookUser className="w-5 h-5 mr-2" />
          Request Leave
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Request Leave
          </DialogTitle>
          <DialogDescription>
            Submit a new leave request. Your current leave balance will be checked.
          </DialogDescription>
        </DialogHeader>

        {/* Leave Balance Display */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Your Leave Balance</span>
            </div>
            {balanceLoading ? (
              <span className="text-sm text-blue-600">Loading...</span>
            ) : (
              <Badge variant="outline" className="bg-white">
                {leaveBalance} day{leaveBalance !== 1 ? 's' : ''} available
              </Badge>
            )}
          </div>
          {calculatedDays > 0 && (
            <div className="mt-2 pt-2 border-t border-blue-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">This request:</span>
                <span className="font-medium">
                  {calculatedDays} day{calculatedDays !== 1 ? 's' : ''}
                </span>
              </div>
              {calculatedDays <= leaveBalance ? (
                <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>You have sufficient leave balance</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>Insufficient leave balance</span>
                </div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="leave-type" className="flex items-center gap-1">
              Leave Type <span className="text-red-500">*</span>
            </Label>
            <Select value={leaveType} onValueChange={setLeaveType} required>
              <SelectTrigger id="leave-type">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="start" className="flex items-center gap-1">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start"
                type="date"
                min={todayStr}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="end" className="flex items-center gap-1">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="end"
                type="date"
                min={startDate || todayStr}
                max={getMaxEndDate()}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                disabled={!startDate}
              />
              {startDate && leaveBalance > 0 && (
                <p className="text-xs text-muted-foreground">
                  Max: {getMaxEndDate()} (based on your balance)
                </p>
              )}
            </div>
          </div>

          {startDate && endDate && calculatedDays > 0 && (
            <div className="p-2 bg-gray-50 rounded text-center">
              <p className="text-sm font-medium">
                Duration: <span className="text-blue-600">{calculatedDays} day{calculatedDays !== 1 ? 's' : ''}</span>
              </p>
            </div>
          )}

          <div className="grid gap-3">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <textarea
              id="reason"
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter reason for leave (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={loading || calculatedDays > leaveBalance}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}