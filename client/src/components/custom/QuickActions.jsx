import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import "@/Pages/Dashboards/Dashboard.css";


const QuickActions = ({ actions }) => {
  return (
    <Card className="list-card">
      <CardHeader className="list-card-header">
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="list-card-content">
        <div className="quick-actions-grid">
          {actions.map((action, index) => (
            <Button key={index} variant="outline" className="quick-action-button cursor-pointer" onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
