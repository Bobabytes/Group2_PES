import { useState, useEffect } from "react";
import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import PayslipPDFViewer from "@/components/custom/PayslipPDFviewer"; 
import LeaveRequestDialog from "@/components/custom/LeaveRequestDialog";
import LeaveCalendar from "@/components/custom/LeaveCalendarList";
import { DollarSign, Calendar, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const EmployeeDashboard = () => {
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
    <StatsGrid stats={PersonalStats} />
    <div className="grid gap-6 md:grid-cols-16">
      <div className="md:col-span-6">
        <PayslipList payslips={payslips} />
      </div>
      <div className="md:col-span-6">
        <LeaveCalendar />
      </div>
      <div className="md:col-span-4">
        <QuickActions actions={quickActions} />
      </div>
    </div>
  </div>
  );
};

export default EmployeeDashboard;