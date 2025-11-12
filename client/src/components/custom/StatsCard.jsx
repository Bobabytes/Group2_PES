import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  borderColor = "border-l-primary",
  iconColor = "text-primary"
}) => {
  return (
    <Card className={`stats-card border-l-4 ${borderColor}`}>
      <CardHeader className="stats-card-header space-y-0 pb-2">
        <CardTitle className="stats-card-title">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="stats-card-value">{value}</div>
        <p className="stats-card-description">{description}</p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
