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
import LeaveCalendar from "@/components/custom/LeaveCalendar";
import "@/Pages/Dashboards/Dashboard.css";

const HRDashboard = () => {
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [todayLeaveCount, setTodayLeaveCount] = useState(0); // Add this state

  useEffect(() => {
    // Get user name from localStorage
    const name = localStorage.getItem("name");
    if (name) {
      setUserName(name);
    } else {
      console.warn("No user name found in localStorage");
    }
    
    loadDashboard();
  }, []);

  // Function to fetch today's leave count
  const fetchTodayLeaveCount = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const userRole = localStorage.getItem("userRole") || "";
      
      // Check if user has permission
      const roleLower = userRole.toLowerCase();
      const hasAccess = ["administrator", "admin", "hr", "manager"].includes(roleLower);
      
      if (!hasAccess) {
        setTodayLeaveCount(0);
        return;
      }

      const response = await fetch("http://localhost:8080/api/leaves/today-count", {
        headers: { "user-id": userId },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      console.log("Today's leave count:", data);
      setTodayLeaveCount(data.count || 0);
    } catch (error) {
      console.error("Error getting today's leave count:", error);
      setTodayLeaveCount(0);
    }
  };

  // Fetch number of pending approvals
  const fetchPendingApprovals = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      const response = await fetch(
        "http://localhost:8080/api/hr/pending-leaves-count",
        {
          headers: { "user-id": userId },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pending approvals");
      }

      const data = await response.json();
      setPendingApprovals(data.pending);
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
      toast.error("Failed to load pending approvals");
    }
  };

  // Fetch total employee count
  const fetchEmployeeCount = async () => {
    try {
      const userId = localStorage.getItem("userId");

      console.log("FETCH EMPLOYEE COUNT CALLED");

      const res = await fetch("http://localhost:8080/api/hr/employee-count", {
        headers: { "user-id": userId },
      });

      if (!res.ok) throw new Error("Failed to fetch employee count");

      const data = await res.json();
      console.log("EMPLOYEE COUNT RESPONSE:", data);

      setStats((prev) => ({
        ...prev,
        employeeCount: data.total,
      }));
    } catch (err) {
      console.error(err);
    }
  };

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
      setStats((prev) => ({
        ...prev,
        salary: `$${(data.currentSalary || 0).toLocaleString()}`,
        leaveBalance: `${data.leaveBalance} days`,
        nextPayment: data.nextPayment,
        ytd: `$${(data.ytdEarnings || 0).toLocaleString()}`,
      }));

    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  const loadDashboard = async () => {
    setLoading(true);
    await Promise.all([
      fetchPendingApprovals(),
      fetchEmployeeCount(),
      fetchDashboardStats(),
      fetchTodayLeaveCount() // Add this here
    ]);
    setLoading(false);
  };

  // MOCK DATA: REPLACE WITH DATABASE QUERIES INTO VARIABLES LATER 
  const payslips = [
    { month: "March 2024", amount: 9999, status: "Not Paid" },
    { month: "February 2024", amount: 8204, status: "Paid" },
    { month: "January 2024", amount: 3030, status: "Paid" },
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

  const HRStats = [
    {
      title: "Total Employees",
      value: loading ? "Loading..." : (stats?.employeeCount ?? "Not available"),
      description: "Total number of employees (Fetch total employees)",
      icon: Users,
      borderColor: "border-l-primary",
      iconColor: "text-primary"
    },
    {
      title: "On Leave Today",
      value: loading ? "Loading..." : `${todayLeaveCount}`, // Fixed: Use todayLeaveCount state
      description: "Across all departments (Fetch all users on leave on current day)",
      icon: UserCheck,
      borderColor: "border-l-accent",
      iconColor: "text-primary"
    },
    {
      title: "Pending Approvals",
      value: loading ? "Loading..." : pendingApprovals.toString(),
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
    { label: "Submit Personal Leave Request", component: LeaveRequestDialog },
    { label: "Manage Employee Leave Requests", component: ManageLeave },
    { label: "Add/Remove Employee", component: EmployeeManagementDialog },
    { label: "Update Employee Details", component: UpdateEmployeeDialog },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4"> Welcome back, {userName || "HR"}</h1>
      <StatsGrid stats={HRStats} />

      <div className="grid gap-6 md:grid-cols-16">
        <div className="md:col-span-16">
          <LeaveRequestList requests={leaveRequests} title="Leave Requests" />  
        </div>
        <div className="md:col-span-6">
          <PayslipList payslips={payslips} title="Personal Payslips" />
        </div>
        <div className="md:col-span-6">
          <LeaveCalendar title="Personal Leave Calendar"/>
        </div>
        <div className="md:col-span-4">
          <QuickActions actions={quickActions} title="HR Team Actions" />
        </div>
        <div className="md:col-span-16">
          <StatsGrid stats={PersonalStats} />
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;