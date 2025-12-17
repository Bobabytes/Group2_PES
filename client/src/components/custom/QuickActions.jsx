import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointerClick } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import "@/Pages/Dashboards/Dashboard.css";

const QuickActions = ({ actions, title = "Actions" }) => {
  return (
    <Card className="list-card h-full">
      <CardHeader className="list-card-header px-4 py-3">
        <CardTitle className="flex items-center gap-2">
          <MousePointerClick className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="list-card-content p-0">
        <scrollArea className="height-full">
        <div className="px-4 pb-4">
          <div className="space-y-2">
            {actions.map((action, index) => (
              <div key={index} className="w-full">
                {action.component ? (
                  <div className="w-full">
                    <action.component />
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start px-3 py-2 h-auto text-sm truncate"
                    onClick={action.onClick}
                  >
                    {action.icon && (
                      <action.icon className="w-3 h-3 mr-2 flex-shrink-0" />
                    )}
                    <span className="truncate">{action.label}</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        </scrollArea>
      </CardContent>
    </Card>
  );
};

export default QuickActions;