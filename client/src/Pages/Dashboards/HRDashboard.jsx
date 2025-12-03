import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import LeaveRequestList from "@/components/custom/LeaveRequestList";

import { DollarSign, Calendar, FileText, TrendingUp, Users, Clock, UserCheck, UserPen, Component } from "lucide-react";
import { toast } from "sonner";
import PayslipPDFViewer from "@/components/custom/PayslipPDFviewer";
import LeaveRequestDialog from "@/components/custom/LeaveRequestDialog";

const HRDashboard = () => {
  // MOCK DATA: REPLACE WITH DATABASE QUERIES INTO VARIABLES LATER 
  const stats = [
    {
      title: "Total Employees",
      value: "100 (Mock)",
      description: "Total number of employees (Fetch total employees)",
      icon: Users,
      borderColor: "border-l-primary",
      iconColor: "text-primary"
    },
    {
      title: "On Leave Today",
      value: "12 (Mock)",
      description: "Across all departments (Fetch all users on leave on current day)",
      icon: UserCheck,
      borderColor: "border-l-accent",
      iconColor: "text-primary"
    },
    {
      title: "Pending Approvals",
      value: "5 (Mock)",
      description: "Leave requests pending your approval (Fetch all pending requests)",
      icon: UserPen,
      borderColor: "border-l-accent",
      iconColor: "text-primary"
    },
    {
      title: "Leave Balance",
      value: "12 Days (Mock)",
      description: "Available this year (Fetch current user's available leaves)",
      icon: FileText,
      borderColor: "border-l-accent",
      iconColor: "text-primary"
    },
  ];
  // MOCK DATA: REPLACE WITH DATABASE QUERIES LATER
  const leaveRequests = [
    { employee: "John Smith (Mock)", type: "Annual Leave", days: 5, status: "Pending"},
    { employee: "Sarah Johnson (Mock)", type: "Sick Leave", days: 2, status: "Pending"},
    { employee: "Mike Wilson (Mock)", type: "Personal Leave", days: 1, status: "Approved"},
    { employee: "Jane Doe (Mock)", type: "Personal Leave", days: 3, status: "Approved"},
  ];
  // Actions: Implement functionality here later.
  // Ideally the functionality would be in a function above this called by onClick.
  const quickActions = [
    { label: "View Payslips", component: PayslipPDFViewer },
    { label: "Submit Personal Leave Request",component : LeaveRequestDialog },
    { label: "Manage Employee Leave Requests", onClick: () => toast.info("Employee Leave Management coming soon!") },
    { label: "Add/Remove Employee", onClick: () => toast.info("Employee List Management coming soon!") },
    { label: "Update Employee Details", onClick: () => toast.info("Employee Details Update coming soon!") },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Welcome back, HR.</h1>
      <StatsGrid stats={stats} />
      <div className="grid gap-6 md:grid-cols-2">
        <LeaveRequestList requests={leaveRequests} title="Leave Requests" />
        <QuickActions actions={quickActions} title="HR Team Actions" />
      </div>
    </div>
  );
};

export default HRDashboard;
