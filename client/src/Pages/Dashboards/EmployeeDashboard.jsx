import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import { DollarSign, Calendar, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const EmployeeDashboard = () => {
  // DATABASE QUERY: Fetch Employee Details here
  

  // MOCK DATA: REPLACE WITH DATABASE QUERIES LATER
  const stats = [
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
    { label: "View Payslips", onClick: () => toast.info("Payslip viewing coming soon!") },
    { label: "Request Leave", onClick: () => toast.info("Leave request coming soon!") },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Welcome back.</h1>
      <StatsGrid stats={stats} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <PayslipList payslips={payslips} title="Personal Payslips" />
        <QuickActions actions={quickActions} title="Employee Actions" />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
