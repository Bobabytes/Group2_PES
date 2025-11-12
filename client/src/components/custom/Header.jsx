import { Button } from "@/components/ui/button";
import { LogOut, Building2 } from "lucide-react";

const Header = ({ roleTitle, employeeId, onLogout }) => {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary shadow-md">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{roleTitle}</h1>
            <p className="text-xs text-muted-foreground">ID: {employeeId}</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={onLogout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
