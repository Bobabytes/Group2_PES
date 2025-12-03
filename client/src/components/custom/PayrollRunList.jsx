import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, FileSpreadsheet } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import "@/Pages/Dashboards/Dashboard.css";

const PayrollRunList = ({ runs }) => {
  return (
    <Card className="list-card">
      <CardHeader className="list-card-header">
        <CardTitle className="flex items-center justify-between">
          <span>Recent Payroll Reports</span>
          <FileSpreadsheet className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      <ScrollArea style={{ height: '400px' }}>
      <CardContent className="list-card-content">
        <div className="space-y-4">
          {runs.map((run, index) => (
            <div key={index} className="list-item">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div className="list-item-main">
                  <p className="list-item-title">{run.month}</p>
                  <p className="list-item-subtitle">
                    ${run.amount.toLocaleString()} • {run.employees} employees • {run.date}
                  </p>
                </div>
              </div>
              <Badge variant={run.status === "Completed" || run.status === "Processed" ? "default" : "secondary"}>{run.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default PayrollRunList;
