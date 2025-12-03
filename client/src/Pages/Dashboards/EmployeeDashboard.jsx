// components/custom/EmployeeDashboard.jsx
import { useEffect, useState } from "react";
import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import PayslipPDFViewer from "@/components/custom/PayslipPDFviewer"; 
import LeaveRequestDialog from "@/components/custom/LeaveRequestDialog";
import { DollarSign, Calendar, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";


const EmployeeDashboard = () => {

  const [leaveBalance, setLeaveBalance] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user.leaves != null) {
          setLeaveBalance(user.leaves);
        }
      }
    } catch (err) {
      console.error("Error reading user from localStorage:", err);
    }
  }, []);



  const stats = [
    {
      title: "Current Salary",
      value: "$5,400",
      description: "Monthly Gross Pay",
      icon: DollarSign,
      borderColor: "border-l-primary",
      iconColor: "text-primary"
    },
    {
      title: "Next Payment",
      value: "March 31, 2025",
      description: "Days remaining",
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
      value: `${leaveBalance} days`,
      description: "Available this year",
      icon: FileText,
      borderColor: "border-l-accent",
      iconColor: "text-accent"
    },
  ];

  const payslips = [
    { month: "March 2024", amount: 5400, status: "Not Paid" },
    { month: "February 2024", amount: 5400, status: "Paid" },
    { month: "January 2024", amount: 5200, status: "Paid" },
  ];

 
  const quickActions = [
    { 
      label: "View Payslips", 
      component: PayslipPDFViewer 
    },
    { 
      label: "Submit Leave Request", 
      component: LeaveRequestDialog
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Employee Dashboard</h1>
      <StatsGrid stats={stats} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <PayslipList payslips={payslips} />
        <QuickActions actions={quickActions} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;