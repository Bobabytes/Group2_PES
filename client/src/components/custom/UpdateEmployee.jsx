import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Edit, UserPlus, Users, Search, MoreVertical, RefreshCw, Eye, EyeOff, Trash2 } from "lucide-react";

export default function UpdateEmployeeDialog() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  
  const [updateData, setUpdateData] = useState({
    name: "",
    position: "",
    department: "",
    employee_id: "",
    salary: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "";
    const id = localStorage.getItem("userId") || "";
    setUserRole(role);
    setUserId(id);
  }, []);

  const hasEmployeeManagementAccess = () => {
    const roleLower = userRole?.toLowerCase() || "";
    return ["administrator", "admin", "hr", "manager"].includes(roleLower);
  };

  const fetchEmployees = async () => {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      toast.error("Please log in first");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/admin/employees", {
        headers: { "user-id": currentUserId },
      });
      
      if (!response.ok) throw new Error("Failed to fetch employees");
      
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMainDialogOpen && userId) fetchEmployees();
  }, [isMainDialogOpen, userId]);

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;

    const currentUserId = localStorage.getItem("userId");
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/employees/${selectedEmployee.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          "user-id": currentUserId 
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success("Employee updated successfully!");
      setShowUpdateDialog(false);
      setSelectedEmployee(null);
      setUpdateData({ name: "", position: "", department: "", employee_id: "", salary: "" });
      fetchEmployees();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getPositionColor = (position) => {
    if (!position) return "bg-gray-100 text-gray-800";
    switch (position.toLowerCase()) {
      case "administrator":
      case "admin":
        return "bg-red-100 text-red-800";
      case "hr":
        return "bg-blue-100 text-blue-800";
      case "manager":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  if (!hasEmployeeManagementAccess()) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-start text-sm h-auto min-h-[40px] py-2 px-4 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Update Employee Details
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Access Denied</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Administrator, Admin, HR, or Manager access required.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="quick-action-button">
          Update Employee Details
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Update Employee Details
            
            <div className="flex items-center gap-2">
              <Badge variant="default">
                {userRole}
              </Badge>
            </div>
            </span>
          </DialogTitle>
          <DialogDescription>
            Select an employee to update their details
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0 gap-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={fetchEmployees} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
              className="h-9 px-3 hover:bg-accent hover:text-accent-foreground"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Employees Table */}
          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-0 h-full">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                  <span className="text-muted-foreground">Loading employees...</span>
                </div>
              ) : (
                <div className="overflow-auto h-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees
                        .filter(emp => !searchTerm || 
                          (emp.name && emp.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (emp.username && emp.username.toLowerCase().includes(searchTerm.toLowerCase())))
                        .map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="font-medium">{employee.name || employee.username}</div>
                            <div className="text-xs text-muted-foreground">@{employee.username}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPositionColor(employee.position)}>
                              {employee.position}
                            </Badge>
                          </TableCell>
                          <TableCell>{employee.department || "-"}</TableCell>
                          <TableCell>
                            {employee.salary ? `$${parseFloat(employee.salary).toLocaleString()}` : "-"}
                          </TableCell>
                          <TableCell>
                            {employee.is_active ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Eye className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                <EyeOff className="w-3 h-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setUpdateData({
                                      name: employee.name || "",
                                      position: employee.position || "",
                                      department: employee.department || "",
                                      employee_id: employee.employee_id || "",
                                      salary: employee.salary || "",
                                    });
                                    setShowUpdateDialog(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Update Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Update Employee Dialog */}
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Employee Details</DialogTitle>
              <DialogDescription>
                Update details for {selectedEmployee?.name || selectedEmployee?.username}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="update-name">Full Name</Label>
                <Input
                  id="update-name"
                  value={updateData.name}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="h-9"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="update-position">Position</Label>
                <Select
                  value={updateData.position}
                  onValueChange={(value) =>
                    setUpdateData({ ...updateData, position: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="HR">HR Staff</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    {["administrator", "admin"].includes(userRole?.toLowerCase()) && (
                      <SelectItem value="Administrator">Administrator</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="update-department">Department</Label>
                <Input
                  id="update-department"
                  value={updateData.department}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, department: e.target.value })
                  }
                  placeholder="Engineering, Sales, etc."
                  className="h-9"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="update-employee_id">Employee ID</Label>
                  <Input
                    id="update-employee_id"
                    value={updateData.employee_id}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, employee_id: e.target.value })
                    }
                    placeholder="EMP001"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-salary">Monthly Salary ($)</Label>
                  <Input
                    id="update-salary"
                    type="number"
                    value={updateData.salary}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, salary: e.target.value })
                    }
                    placeholder="5000"
                    className="h-9"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowUpdateDialog(false);
                  setSelectedEmployee(null);
                  setUpdateData({ name: "", position: "", department: "", employee_id: "", salary: "" });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateEmployee}>
                Update Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}