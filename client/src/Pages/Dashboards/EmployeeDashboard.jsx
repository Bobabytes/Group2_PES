import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import { DollarSign, Calendar, FileText, TrendingUp } from "lucide-react";

const EmployeeDashboard = () => {
  // MOCK DATA: REPLACE WITH DATABASE QUERIES LATER
  const stats = [
    {
      title: "Current Salary",
      value: "$5,400",
      description: "A test Description",
      icon: DollarSign,
      borderColor: "border-l-primary",
      iconColor: "text-primary"
    },
    {
      title: "A test Title",
      value: "Test Value",
      description: "Test Description",
      icon: Calendar,
      borderColor: "border-l-accent",
      iconColor: "text-accent"
    },
    {
      title: "YTD Earnings",
      value: "$16,200",
      description: "Year to date",
      icon: TrendingUp,
      borderColor: "border-l-accent",
      iconColor: "text-secondary-foreground"
    },
    {
      title: "Leave Balance",
      value: "12 days",
      description: "Available this year",
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
  // QUICK BUTTONS: FUNCTIONALITY CHANGES PER ROLE
  const quickActions = [
    { label: "View Payslips" },
    { label: "Request Leave" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">This is the employee dashboard.</h1>
      <StatsGrid stats={stats} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <PayslipList payslips={payslips} />
        <QuickActions actions={quickActions} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
