import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mouse, MousePointerClick, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import "@/Pages/Dashboards/Dashboard.css";


const QuickActions = ({ actions, title = "Actions" }) => {
  return (
    <Card className="list-card">
      <CardHeader className="list-card-header">
        <CardTitle className="flex items-center gap-2">
          <MousePointerClick className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <ScrollArea style={{ height: '400px' }}>
      <CardContent className="list-card-content">
        <div className="quick-actions-grid">
          {actions.map((action, index) => (
            <Button key={index} variant="outline" className="quick-action-button cursor-pointer font-semibold text-xl bg-gradient-primary text-white hover:scale-105" onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default QuickActions;
