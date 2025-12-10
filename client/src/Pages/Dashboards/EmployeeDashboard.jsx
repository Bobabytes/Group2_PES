// components/custom/EmployeeDashboard.jsx
import { useEffect, useState } from "react";
import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import PayslipPDFViewer from "@/components/custom/PayslipPDFviewer"; 
import LeaveRequestDialog from "@/components/custom/LeaveRequestDialog";
import { DollarSign, Calendar, FileText, TrendingUp } from "lucide-react";


const EmployeeDashboard = () => {


// New state for leave balance
const [leaveBalance, setLeaveBalance] = useState(0);

useEffect(() => {
  try {
    const storedLeaves = localStorage.getItem("leaveBalance");
    if (storedLeaves !== null) {
      setLeaveBalance(Number(storedLeaves));
    }
  } catch (err) {
    console.error("Error reading leaves from localStorage:", err);
  }
}, []);

// New state for salary and ytd
const [salary, setSalary] = useState(0);
const [ytd, setYtd] = useState(0);

useEffect(() => {
  try {
    const storedSalary = localStorage.getItem("salary");
    const storedCreatedAt = localStorage.getItem("created_at");

    if (!storedSalary || !storedCreatedAt) return;

    const salaryNum = Number(storedSalary);
    setSalary(salaryNum);

    const hireDate = new Date(storedCreatedAt);
    const today = new Date();

    let yearDiff = today.getFullYear() - hireDate.getFullYear();
    let monthDiff = today.getMonth() - hireDate.getMonth();
    let monthsWorked = yearDiff * 12 + monthDiff;

    if (today.getDate() < hireDate.getDate()) {
      monthsWorked -= 1;
    }

    if (monthsWorked < 0) monthsWorked = 0;

    setYtd(salaryNum * monthsWorked);
  } catch (err) {
    console.error("Error reading salary / calculating YTD:", err);
  }
}, []);

  const stats = [
    {
      title: "Current Salary",
      value: `${salary.toLocaleString()}`,
      description: "Monthly Gross Pay",
      icon: DollarSign,
      borderColor: "border-l-primary",
      iconColor: "text-primary"
    },
    {
      title: "Next Payment",
      value:  "Loading..." ,
      description: "Estimated date",
      icon: Calendar,
      borderColor: "border-l-accent",
      iconColor: "text-accent"
    },
    {
      title: "YTD Earnings",
      value: `${ytd.toLocaleString()}`,
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