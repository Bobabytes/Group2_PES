import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import "@/Pages/Dashboards/Dashboard.css";
import { ScrollArea } from "@/components/ui/scroll-area";

const PendingPaymentList = ({ payments }) => {
  return (
    <Card className="list-card">
      <CardHeader className="list-card-header">
        <CardTitle>Pending Disbursements</CardTitle>
      </CardHeader>
      <ScrollArea style={{ height: '400px' }}>
      <CardContent className="list-card-content">
        
        <div className="space-y-4">
          {payments.map((payment, index) => (
            <div key={index} className="list-item">
              <div className="list-item-main space-y-1">
                <div className="flex items-center gap-3">
                  <p className="list-item-title">{payment.employee}</p>
                  <Badge variant="outline">{payment.department}</Badge>
                </div>
                <p className="list-item-subtitle">Due: {payment.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${payment.amount.toLocaleString()}</p>
                <p className="list-item-meta">Net pay</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default PendingPaymentList;
