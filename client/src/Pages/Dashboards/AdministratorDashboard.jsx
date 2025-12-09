import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import { DollarSign, Calendar, FileText, TrendingUp, Users, Clock, Shield, UserCheck, UserPen, AlertCircle, CircleDollarSign, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import PayslipPDFViewer from "@/components/custom/PayslipPDFviewer";
import LeaveRequestDialog from "@/components/custom/LeaveRequestDialog";
import EmployeeManagementDialog from "@/components/custom/EmployeeManagementDialog";
import UpdateEmployeeDialog from "@/components/custom/UpdateEmployee";

const AdministratorDashboard = () => {
  // DATABASE QUERY: Fetch Employee Details here
  

  // MOCK DATA: REPLACE WITH DATABASE QUERIES LATER
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
      title: "Attendance Rate",
      value: "94.5%",
      description: "This month",
      icon: TrendingUp,
      borderColor: "border-l-primary",
      iconColor: "text-primary"
    },
    {
      title: "Payroll Report",
      value: "$750,000 (Mock)",
      description: "Total payroll (Fetch from most recent finance log, which'll have a summation of all user salaries; don't calculate it here that's too costly im SERIOUS)",
      icon: CircleDollarSign,
      borderColor: "border-l-primary",
      iconColor: "text-primary"
    },
    {
      title: "Processed Payments",
      value: "70 (Mock)",
      description: "Processed this month (Fetch from payslips marked as paid in the current month ig)",
      icon: CheckCircle2,
      borderColor: "border-l-accent",
      iconColor: "text-primary"
    },
    {
      title: "Pending Payments",
      value: "30 (Mock)",
      description: "Pending salary payments (Fetch from payslips set as pending)",
      icon: AlertCircle,
      borderColor: "border-l-accent",
      iconColor: "text-primary"
    },
    {
      title: "Budget Utilization",
      value: "75% (Mock)",
      description: "YTD vs Budget (Divide fetched payroll report by annual budget from finance logs idk im not an economist also this might be calced and saved in payroll db)",
      icon: TrendingUp,
      borderColor: "border-l-accent",
      iconColor: "text-primary"
    },
  ];

  const personalStats = [
    {
      title: "Current Salary",
      value: "$5,400 (Mock)",
      description: "Monthly Gross Pay (Fetch from employee salary details)",
      icon: DollarSign,
      borderColor: "border-l-primary",
      iconColor: "text-primary"
    },
    {
      title: "Next Payment",
      value: "March 31, 2025 (Mock)",
      description: "{x} Days Remaining (Fetch from payment schedule - current date)",
      icon: Calendar,
      borderColor: "border-l-accent",
      iconColor: "text-accent"
    },
    {
      title: "YTD Earnings",
      value: "$16,200 (Mock)",
      description: "Year to date (Fetch from employee earnings records)",
      icon: TrendingUp,
      borderColor: "border-l-accent",
      iconColor: "text-secondary-foreground"
    },
    {
      title: "Leave Balance",
      value: "12 days (Mock)",
      description: "Available this year (Fetch current user's available leaves)",
      icon: FileText,
      borderColor: "border-l-accent",
      iconColor: "text-accent"
    },
  ];


  // MOCK DATA: REPLACE WITH DATABASE QUERIES LATER
  const payslips = [
    { month: "March 2024", amount: 5400, status: "Not Paid" },
    { month: "February 2024", amount: 5400, status: "Paid" },
    { month: "January 2024", amount: 5200, status: "Paid" },
  ];
  // Actions: Implement functionality here later.
  // Ideally the functionality would be in a function above this
  const quickActions = [
    { label: "View Payslips", component : PayslipPDFViewer },
    { label: "Submit Personal Leave Request", component : LeaveRequestDialog },
    { label: "Manage Employee Leave Requests", onClick: () => toast.info("Employee Leave Management coming soon!") },
    { label: "Add/Remove Employee", component : EmployeeManagementDialog },
    { label: "Update Employee Details", component : UpdateEmployeeDialog },
    { label: "Manage Payroll Report", onClick: () => toast.info("Payroll processing coming soon!") },
    { label: "Manage Payments", onClick: () => toast.info("Payment disbursement coming soon!") },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Welcome back, (Name). You are an Administrator.</h1>
      <StatsGrid stats={stats} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <PayslipList payslips={payslips} title="Personal Payslips" />
        <QuickActions actions={quickActions} title="Administrator Actions" />
      </div>
      <h1 className="text-1xl font-bold mb-4">Your personal details</h1>
      <StatsGrid stats={personalStats} />
    </div>
  );
};

export default AdministratorDashboard;
