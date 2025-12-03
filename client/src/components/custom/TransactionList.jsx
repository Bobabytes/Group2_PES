import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import "@/Pages/Dashboards/Dashboard.css";

const TransactionList = ({ transactions }) => {
  return (
    <Card className="list-card">
      <CardHeader className="list-card-header">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <ScrollArea style={{ height: '400px' }}>
      <CardContent className="list-card-content">
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div key={index} className="list-item">
              <div className="list-item-main">
                <p className="list-item-title">{transaction.type}</p>
                <p className="list-item-subtitle">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${transaction.amount.toLocaleString()}</p>
                <Badge variant="default" className="mt-1">
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
        </ScrollArea>
    </Card>
  );
};

export default TransactionList;
