import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import { DollarSign, Calendar, FileText, TrendingUp, Users, UserCheck, UserPen, AlertCircle, CircleDollarSign, CheckCircle2 } from "lucide-react";
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
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [todayLeaveCount, setTodayLeaveCount] = useState(0);
  
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

      const res = await fetch("http://localhost:8080/api/hr/employee-count", {
        headers: { "user-id": userId },
      });

      if (!res.ok) throw new Error("Failed to fetch employee count");

      const data = await res.json();
      setStats(prev => ({
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
      setStats(prev => ({
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

  // Load all dashboard data
  const loadDashboard = async () => {
    setLoading(true);
    
    try {
      // Fetch all data in parallel
      await Promise.all([
        fetchDashboardStats(),
        fetchTodayLeaveCount(),
        fetchPendingApprovals(),
        fetchEmployeeCount()
      ]);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load some dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const AdminStats = [
    {
      title: "Total Employees",
      value: loading ? "Loading..." : (stats?.employeeCount ?? "0"),
      description: "Total number of employees",
      icon: Users,
      borderColor: "border-l-primary",
      iconColor: "text-primary"
    },
    {
      title: "On Leave Today",
      value: loading ? "Loading..." : `${todayLeaveCount}`,
      description: "Across all departments",
      icon: UserCheck,
      borderColor: "border-l-accent",
      iconColor: "text-primary"
    },
    {
      title: "Pending Approvals",
      value: loading ? "Loading..." : `${pendingApprovals}`,
      description: "Leave requests pending your approval",
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
      value: "$750,000",
      description: "Total payroll",
      icon: CircleDollarSign,
      borderColor: "border-l-primary",
      iconColor: "text-primary"
    },
    {
      title: "Processed Payments",
      value: "70",
      description: "Processed this month",
      icon: CheckCircle2,
      borderColor: "border-l-accent",
      iconColor: "text-primary"
    },
    {
      title: "Pending Payments",
      value: "30",
      description: "Pending salary payments",
      icon: AlertCircle,
      borderColor: "border-l-accent",
      iconColor: "text-primary"
    },
    {
      title: "Budget Utilization",
      value: "75%",
      description: "YTD vs Budget",
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

  const payslips = [
    { month: "March 2024", amount: 5400, status: "Not Paid" },
    { month: "February 2024", amount: 5400, status: "Paid" },
    { month: "January 2024", amount: 5200, status: "Paid" },
  ];
  
  const quickActions = [
    { label: "View Payslips", component: PayslipPDFViewer },
    { label: "Submit Personal Leave Request", component: LeaveRequestDialog },
    { label: "Manage Employee Leave Requests", component: ManageLeavesDialog },
    { label: "Add/Remove Employee", component: EmployeeManagementDialog },
    { label: "Update Employee Details", component: UpdateEmployeeDialog },
    { label: "Manage Payroll Report", icon: FileText, component: PayrollReportDialog },
    { label: "Manage Payments", icon: DollarSign, component: ManagePaymentsDialog },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
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