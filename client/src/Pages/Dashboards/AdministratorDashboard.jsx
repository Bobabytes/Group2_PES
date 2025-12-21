import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import { DollarSign, Calendar, FileText, TrendingUp, Users, Clock, Shield, UserCheck, UserPen, AlertCircle, CircleDollarSign, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import PayslipPDFViewer from "@/components/custom/PayslipPDFviewer";
import LeaveRequestDialog from "@/components/custom/LeaveRequestDialog";
import EmployeeManagementDialog from "@/components/custom/EmployeeManagementDialog";
import UpdateEmployeeDialog from "@/components/custom/UpdateEmployee";
import { useState, useEffect } from "react";
import LeaveCalendar from "@/components/custom/LeaveCalendar";
import ManageLeavesDialog from "@/components/custom/ManageLeave";
import ManagePaymentsDialog from "@/components/custom/ManagePaymentsDialog";
import PayrollReportDialog from "@/components/custom/PayrollReportDialog";


const AdministratorDashboard = () => {
  // Get user name from localStorage
  const [userName, setUserName] = useState("");
  
  // DATABASE QUERY: Fetch Employee Details here
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get user name from localStorage
    const name = localStorage.getItem("name");
    if (name) {
      setUserName(name);
    } else {
      console.warn("No user name found in localStorage");
      // Optional: Redirect to login if no user name
      // navigate("/login");
    }
    
    fetchDashboardStats();
  }, []);

  // Fetch personal dashboard stats
  const fetchDashboardStats = async () => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      toast.error("Please log in first");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/employee/dashboard-stats", {
        headers: { "user-id": userId },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      
      const data = await response.json();
      
      // Format the data for display
      setStats({
        salary: `$${(data.currentSalary || 0).toLocaleString()}`,
        leaveBalance: `${data.leaveBalance} days`,
        nextPayment: data.nextPayment,
        ytd: `$${(data.ytdEarnings || 0).toLocaleString()}`,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // MOCK DATA: REPLACE WITH DATABASE QUERIES LATER
  const AdminStats = [
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

  const PersonalStats = [
    {
      title: "Current Salary",
      value: loading ? "Loading..." : (stats?.salary || "Not available"),
      description: "Monthly Gross Pay",
      icon: DollarSign,
      borderColor: "border-l-primary",
      iconColor: "text-primary"
    },
    {
      title: "Next Payment",
      value: loading ? "Loading..." : (stats?.nextPayment || "Not available"),
      description: "Estimated date",
      icon: Calendar,
      borderColor: "border-l-accent",
      iconColor: "text-accent"
    },
    {
      title: "YTD Earnings",
      value: loading ? "Loading..." : (stats?.ytd || "Not available"),
      description: "Year to date",
      icon: TrendingUp,
      borderColor: "border-l-accent",
      iconColor: "text-secondary-foreground"
    },
    {
      title: "Leave Balance",
      value: loading ? "Loading..." : (stats?.leaveBalance || "Not available"),
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
  
  // Actions: Implement functionality here later.
  // Ideally the functionality would be in a function above this
  const quickActions = [
    { label: "View Payslips", component: PayslipPDFViewer },
    { label: "Submit Personal Leave Request", component: LeaveRequestDialog },
    { label: "Manage Employee Leave Requests", component: ManageLeavesDialog },
    { label: "Add/Remove Employee", component: EmployeeManagementDialog },
    { label: "Update Employee Details", component: UpdateEmployeeDialog },
    { label: "Manage Payroll Report", icon: FileText, component : PayrollReportDialog},
    { label: "Manage Payments", icon: DollarSign, component : ManagePaymentsDialog},
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* FIXED: Display actual user name */}
      <h1 className="text-3xl font-bold mb-4">
        Welcome back, {userName || "Administrator"}. You are an Administrator.
      </h1>
      
      <StatsGrid stats={AdminStats} />
      
      <div className="grid gap-6 md:grid-cols-16">
        <div className="md:col-span-6">
          <PayslipList payslips={payslips} title="Personal Payslips" />
        </div>
        <div className="md:col-span-6">
          <LeaveCalendar title="Personal Leave Calendar"/>
        </div>
        <div className="md:col-span-4">
          <QuickActions actions={quickActions} title="Administrator Actions" />
        </div>
        <div className="md:col-span-16">
          <StatsGrid stats={PersonalStats} />
        </div>
      </div>
    </div>
  );
};

export default AdministratorDashboard;