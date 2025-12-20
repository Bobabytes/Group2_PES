import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import PayrollRunList from "@/components/custom/PayrollRunList";
import { DollarSign, Calendar, FileText, TrendingUp, AlertCircle, CircleDollarSign, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import PendingPaymentList from "@/components/custom/PendingPaymentList";
import TransactionList from "@/components/custom/TransactionList";
import { useState, useEffect } from "react";
import PayslipPDFViewer from "@/components/custom/PayslipPDFviewer"; 
import LeaveRequestDialog from "@/components/custom/LeaveRequestDialog";
import LeaveCalendar from "@/components/custom/LeaveCalendar";
import PayrollReportDialog from "@/components/custom/PayrollReportDialog";


const FinanceDashboard = () => {

  const [userName, setUserName] = useState("");
  const [payrollDialogOpen, setPayrollDialogOpen] = useState(false);
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);

  // DATABASE QUERY: Fetch Employee Details here
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
  const name = localStorage.getItem("name");
  if (name) setUserName(name);

  fetchPendingPaymentsCount();
  fetchDashboardStats();
}, []);

//Fetch pending payments count
const fetchPendingPaymentsCount = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/finance/pending-payments-count"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch pending payments count");
    }

    const data = await response.json();
    setPendingPaymentsCount(data.pending);
  } catch (error) {
    console.error(error);
    toast.error("Failed to load pending payments count");
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
  const FinanceStats = [
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
      value: `${pendingPaymentsCount}`,
      description: "Pending salary payments",
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
  // INHERITED FROM EMPLOYEE DASHBOARD
  // MOCK DATA: REPLACE WITH DATABASE QUERIES LATER
  const payslips = [
    { month: "March 2024", amount: 9999, status: "Not Paid" },
    { month: "February 2024", amount: 8204, status: "Paid" },
    { month: "January 2024", amount: 3030, status: "Paid" },
  ];
  // Actions: Implement functionality here later.
  // Ideally the functionality would be in a function above this
  const quickActions = [
    { 
      label: "View Payslips", 
      component: PayslipPDFViewer 
    },
    { 
      label: "Submit Personal Leave Request", 
      component: LeaveRequestDialog
    },
    { label: "Manage Payroll Report", icon: FileText, onClick: () => setPayrollDialogOpen(true) },
    { label: "Manage Payments", onClick: () => toast.info("Payment disbursement coming soon!") },
  ];
  // Payroll Reports: shows the recent payroll runs
  const payrollRuns = [
    { month: "March 2024", amount: 1248000, employees: 248, status: "Processing", date: "Mar 31" },
    { month: "February 2024", amount: 1236000, employees: 246, status: "Completed", date: "Feb 29" },
    { month: "January 2024", amount: 1224000, employees: 244, status: "Completed", date: "Jan 31" },
  ];
  // Pending Payments: shows the pending payments to be processed
  const pendingPayments = [
    { employee: "Costantinos Coleslaw", amount: 5400, department: "Employee", dueDate: "Mar 31" },
    { employee: "Andreas Ambidextrous", amount: 6200, department: "HR", dueDate: "Mar 31" },
    { employee: "Tommy Toblerone", amount: 4800, department: "Finance", dueDate: "Mar 31" },
    { employee: "Jimmy Jimble", amount: 4800, department: "Finance", dueDate: "Mar 31" },
    { employee: "Kyriakos Kombucha", amount: 4800, department: "Finance", dueDate: "Mar 31" },
  ];
  // Recent Transactions: shows recent financial transactions
  const recentPayments = [
    { type: "Salary Payment", amount: 5400, employee: "John Smith", date: "Mar 25" },
    { type: "Bonus Payment", amount: 1200, employee: "Sarah Johnson", date: "Mar 20" },
    { type: "Reimbursement", amount: 300, employee: "Mike Wilson", date: "Mar 18" },
  ];
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4"> Welcome back, {userName || "Finance"}</h1>
      <StatsGrid stats={FinanceStats} />
      
      <div className="grid gap-6 md:grid-cols-3">
        <PayrollRunList runs={payrollRuns} />
        <PendingPaymentList payments={pendingPayments} />
        <TransactionList transactions={recentPayments} />
      </div>

    
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
        <div className="md:col-span-16">
        <StatsGrid stats={PersonalStats} />
        </div>
      </div>
        <PayrollReportDialog
        open={payrollDialogOpen}
        onOpenChange={setPayrollDialogOpen}
        />
    </div>
  );
};

export default FinanceDashboard;
