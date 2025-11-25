import { Button } from "@/components/ui/button"
import { Dialog , DialogClose , DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import { useState } from "react";
export default function LeaveRequestDialog() {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");  
  
  const todayStr = new Date().toISOString().split("T")[0]; // yyyy-mm-dd for <input type="date">

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
  

  if (!leaveType || !startDate || !endDate) {
    setError("Please fill in all fields.");
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start <= today) {
    setError("Start date must be after today.");
    return;
  }
  if (end <= start) {
    setError("End date cannot be before or the same as the start date.");
    return;
  }

  console.log({
      leaveType,
      startDate,
      endDate,
  });

  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="quick-action-button">
          Request Leave
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>
            Fill in the details below to submit a leave request.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-3">
          <div className="grid gap-4">
            <Label htmlFor="leave-type">Leave type</Label>
              <Select name="leaveType" value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger id="leave-type">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="start">Start date</Label>
            <Input id="start" name="startDate" type="date" min={todayStr} value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="end">End date</Label>
            <Input id="end" name="endDate" type="date" min={startDate || todayStr} value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
          </div>
          {error && (
            <p className="text-sm text-red-600"> {error}</p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Submit request</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}