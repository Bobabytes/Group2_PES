import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import "@/Pages/Dashboards/Dashboard.css";


const PayslipList = ({ payslips, title = "Recent Payslips" }) => {
  return (
    <Card className="list-card">
      <CardHeader className="list-card-header">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <ScrollArea style={{ height: '400px' }}>
      <CardContent className="list-card-content">
        <div className="space-y-4">
          {payslips.map((payslip, index) => (
            <div key={index} className="list-item">
              <div className="list-item-main">
                <p className="list-item-title">{payslip.month}</p>
                <p className="list-item-subtitle">
                  {typeof payslip.amount === 'number' ? `$${payslip.amount.toLocaleString()}` : payslip.amount}
                </p>
              </div>
              <Badge variant={payslip.status === "Paid" || payslip.status === "Processed" ? "default" : "secondary"}>
                {payslip.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default PayslipList;
