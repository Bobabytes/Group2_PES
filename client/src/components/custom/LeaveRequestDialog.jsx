import { Button } from "@/components/ui/button"
import { Dialog , DialogClose , DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LeaveRequestDialog() {
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

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="leave-type">Leave type</Label>
            <Input id="leave-type" name="leaveType" placeholder="e.g. Annual, Sick" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="start">Start date</Label>
            <Input id="start" name="startDate" type="date" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="end">End date</Label>
            <Input id="end" name="endDate" type="date" />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Submit request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}