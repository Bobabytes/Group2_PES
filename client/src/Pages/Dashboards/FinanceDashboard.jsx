import StatsGrid from "@/components/custom/StatsGrid";
import PayslipList from "@/components/custom/PayslipList";
import QuickActions from "@/components/custom/QuickActions";
import PayrollRunList from "@/components/custom/PayrollRunList";
import { DollarSign, Calendar, FileText, TrendingUp, AlertCircle, CircleDollarSign, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import PendingPaymentList from "@/components/custom/PendingPaymentList";
import TransactionList from "@/components/custom/TransactionList";

const FinanceDashboard = () => {
  // DATABASE QUERY: Fetch Employee Details here
  

  // MOCK DATA: REPLACE WITH DATABASE QUERIES LATER
  const stats = [
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

  const personalStats = [
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
    { label: "View Payslips", onClick: () => toast.info("Payslip viewing coming soon!") },
    { label: "Request Personal Leave", onClick: () => toast.info("Leave request coming soon!") },
    { label: "Manage Payroll Report", onClick: () => toast.info("Payroll processing coming soon!") },
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
      <h1 className="text-3xl font-bold mb-4">Welcome back, (Name).</h1>
      <StatsGrid stats={stats} />
      
      <div className="grid gap-6 md:grid-cols-3">
        <PayrollRunList runs={payrollRuns} />
        <PendingPaymentList payments={pendingPayments} />
        <TransactionList transactions={recentPayments} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PayslipList payslips={payslips} title="Personal Payslips" />
        <QuickActions actions={quickActions} title="Finance Team Actions" />
      </div>
      <h1 className="text-1xl font-bold mb-4">Your personal details</h1>
      <StatsGrid stats={personalStats} />
    </div>
  );
};

export default FinanceDashboard;
