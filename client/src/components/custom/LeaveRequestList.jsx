import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import "@/Pages/Dashboards/Dashboard.css";
import { Mouse, MousePointerClick, Plus, BookUser } from "lucide-react";

const LeaveRequestList = ({ requests }) => {
  return (
    <Card className="list-card">
      <CardHeader className="list-card-header">
        <CardTitle className="flex items-center gap-2">
          <BookUser className="w-5 h-5" />
          Employee Leave Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="list-card-content">
        <div className="space-y-4">
          {requests.map((request, index) => (
            <div key={index} className="list-item">
              <div className="list-item-main">
                <p className="list-item-title">{request.employee}</p>
                <p className="list-item-subtitle">
                  {request.type} • {request.days} days • {request.dateRange || request.startDate}
                </p>
              </div>
              <Badge variant={request.status === "Approved" ? "default" : "secondary"}>
                {request.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestList;