import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointerClick } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import "@/Pages/Dashboards/Dashboard.css"; // Make sure this is imported

const QuickActions = ({ actions, title = "Actions" }) => {
  return (
    <Card className="list-card">
      <CardHeader className="list-card-header">
        <CardTitle className="list-card-title flex items-center gap-2">
          <MousePointerClick className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="list-card-content p-0">
        <ScrollArea className="h-[400px]">
          <div className="quick-actions-grid p-6">
            {actions.map((action, index) => (
              <div key={index} className="w-full">
                {action.component ? (
                  // For components, wrap them to apply styles
                  <div className="quick-action-button-wrapper">
                    <action.component />
                  </div>
                ) : (
                  // For simple buttons, use the CSS class
                  <Button
                    variant="outline"
                    className="quick-action-button"
                    onClick={action.onClick}
                  >
                    {action.icon && (
                      <action.icon className="quick-action-icon" />
                    )}
                    {action.label}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QuickActions;