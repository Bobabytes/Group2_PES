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

  
  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
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
  

  try {
    const res = await fetch("http://localhost:8080/api/leave-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usersId: 1, // TODO: replace with user id
          leaveType,
          startDate,
          endDate,
        }),
    });

  if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Failed to submit leave request.");
      return;
  }
  toast.success("Leave request submitted successfully!");

 } catch (err) {
    setError("Network error. Please try again later.");
    return;
  }
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
            <Input id="end" name="endDate" type="date" min={
              startDate
                ? new Date(
                    new Date(startDate).getTime() + 24 * 60 * 60 * 1000
                  )
                    .toISOString()
                    .split("T")[0]
                : todayStr
            }
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          </div>
          {error && (
            <p className="text-sm text-red-600"> {error}</p>
          )}
        

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Submit request</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};