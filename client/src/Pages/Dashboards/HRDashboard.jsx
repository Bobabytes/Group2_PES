import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import LeaveRequestList from "@/components/custom/LeaveRequestList";
import { DollarSign, Calendar, FileText, TrendingUp, Users, Clock, UserCheck, UserPen, Component } from "lucide-react";
import { toast } from "sonner";
import PayslipPDFViewer from "@/components/custom/PayslipPDFviewer";
import LeaveRequestDialog from "@/components/custom/LeaveRequestDialog";
import EmployeeManagementDialog from "@/components/custom/EmployeeManagementDialog";
import UpdateEmployeeDialog from "@/components/custom/UpdateEmployee";
import ManageLeave from "@/components/custom/ManageLeave";
import { useState, useEffect } from "react";

const HRDashboard = () => {
    // DATABASE QUERY: Fetch Employee Details here
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
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

  // MOCK DATA: REPLACE WITH DATABASE QUERIES INTO VARIABLES LATER 
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

  const HRStats = [
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
    { label: "Manage Employee Leave Requests", component : ManageLeave },
    { label: "Add/Remove Employee", component : EmployeeManagementDialog },
    { label: "Update Employee Details", component : UpdateEmployeeDialog },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Welcome back, HR.</h1>
      <StatsGrid stats={HRStats} />
      <div className="grid gap-6 md:grid-cols-2">
        <LeaveRequestList requests={leaveRequests} title="Leave Requests" />
        <QuickActions actions={quickActions} title="HR Team Actions" />
      </div>
      <h1 className="text-1xl font-bold mb-4">Your personal details</h1>
      <StatsGrid stats={PersonalStats} />
    </div>
  );
};

export default HRDashboard;
