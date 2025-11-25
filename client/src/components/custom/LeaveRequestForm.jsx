import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, AlertCircle, CheckCircle2, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const LeaveRequestForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    emergencyContact: "",
    handoverNotes: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Leave type options
  const leaveTypes = [
    { value: "annual", label: "Annual Leave", description: "Paid time off" },
    { value: "sick", label: "Sick Leave", description: "Medical absence" },
    { value: "personal", label: "Personal Leave", description: "Personal matters" },
    { value: "maternity", label: "Maternity Leave", description: "Childbirth related" },
    { value: "paternity", label: "Paternity Leave", description: "New child care" },
    { value: "bereavement", label: "Bereavement Leave", description: "Family loss" },
    { value: "unpaid", label: "Unpaid Leave", description: "Leave without pay" }
  ];

  // Calculate number of days between dates
  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      return daysDiff > 0 ? daysDiff : 0;
    }
    return 0;
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get min end date based on start date
  const getMinEndDate = () => {
    return formData.startDate || getTodayDate();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.leaveType) {
      newErrors.leaveType = "Please select a leave type";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "End date cannot be before start date";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for leave is required";
    }

    if (formData.reason.length > 500) {
      newErrors.reason = "Reason must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const leaveRequest = {
        id: Date.now(),
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        daysRequested: calculateDays(),
        submittedAt: new Date().toISOString(),
        status: "pending",
        requestNumber: `LR-${Date.now().toString().slice(-6)}`
      };

      // Call the onSubmit prop if provided
      if (onSubmit) {
        onSubmit(leaveRequest);
      }

      toast.success("Leave request submitted successfully!");
      handleClose();
      
    } catch (error) {
      toast.error("Failed to submit leave request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
      emergencyContact: "",
      handoverNotes: ""
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }

    // If start date changes and end date is before new start date, clear end date
    if (field === "startDate" && formData.endDate && value > formData.endDate) {
      setFormData(prev => ({
        ...prev,
        endDate: ""
      }));
    }
  };

  const selectedLeaveType = leaveTypes.find(type => type.value === formData.leaveType);

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Request Leave
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leave Type */}
          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type *</Label>
            <Select 
              value={formData.leaveType} 
              onValueChange={(value) => handleInputChange("leaveType", value)}
            >
              <SelectTrigger className={cn(errors.leaveType && "border-destructive")}>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-muted-foreground">{type.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.leaveType && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.leaveType}
              </p>
            )}
          </div>

          {/* Date Range - Using native date inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  min={getTodayDate()}
                  className={cn(
                    "pr-10",
                    errors.startDate && "border-destructive"
                  )}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {formData.startDate && (
                <p className="text-xs text-muted-foreground">
                  Selected: {formatDisplayDate(formData.startDate)}
                </p>
              )}
              {errors.startDate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.startDate}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <div className="relative">
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  min={getMinEndDate()}
                  className={cn(
                    "pr-10",
                    errors.endDate && "border-destructive"
                  )}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {formData.endDate && (
                <p className="text-xs text-muted-foreground">
                  Selected: {formatDisplayDate(formData.endDate)}
                </p>
              )}
              {errors.endDate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Days Calculation */}
          {(formData.startDate && formData.endDate) && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Days Requested:</span>
                <span className="text-lg font-bold text-primary">{calculateDays()} days</span>
              </div>
              {selectedLeaveType && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedLeaveType.label} • {selectedLeaveType.description}
                </p>
              )}
            </div>
          )}

          {/* Reason for Leave */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave *</Label>
            <Textarea
              id="reason"
              placeholder="Please provide details about your leave request..."
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              className={cn(errors.reason && "border-destructive")}
              rows={3}
            />
            <div className="flex justify-between">
              {errors.reason && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.reason}
                </p>
              )}
              <span className={cn(
                "text-xs ml-auto",
                formData.reason.length > 450 ? "text-destructive" : "text-muted-foreground"
              )}>
                {formData.reason.length}/500
              </span>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact (Optional)</Label>
            <Input
              id="emergencyContact"
              placeholder="Name and phone number of emergency contact"
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Provide contact details for urgent work matters during your absence
            </p>
          </div>

          {/* Handover Notes */}
          <div className="space-y-2">
            <Label htmlFor="handoverNotes">Handover Notes (Optional)</Label>
            <Textarea
              id="handoverNotes"
              placeholder="Any important notes for your colleagues or pending tasks..."
              value={formData.handoverNotes}
              onChange={(e) => handleInputChange("handoverNotes", e.target.value)}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Help your team manage your responsibilities while you're away
            </p>
          </div>

          {/* Form Actions */}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-24"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestForm;