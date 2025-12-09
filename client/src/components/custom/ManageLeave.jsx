import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, UserPlus, Users, Search, MoreVertical, RefreshCw, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function ManageLeave() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPermanentDeleteDialog, setShowPermanentDeleteDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  
  const [newEmployee, setNewEmployee] = useState({
    username: "", name: "", password: "123456", position: "Employee", department: "", employee_id: "", salary: ""
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
      toast.success(`Loaded ${data.length} employees`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMainDialogOpen && userId) fetchEmployees();
  }, [isMainDialogOpen, userId]);

  const handleAddEmployee = async () => {
    if (!newEmployee.username || !newEmployee.password || !newEmployee.position) {
      toast.error("Required fields missing");
      return;
    }

    const currentUserId = localStorage.getItem("userId");
    
    try {
      const response = await fetch("http://localhost:8080/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json", "user-id": currentUserId },
        body: JSON.stringify({
          username: newEmployee.username,
          name: newEmployee.name || newEmployee.username,
          password: newEmployee.password,
          position: newEmployee.position,
          department: newEmployee.department || "",
          employee_id: newEmployee.employee_id || "",
          salary: newEmployee.salary || 0,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success("Employee added!");
      setShowAddDialog(false);
      setNewEmployee({ username: "", name: "", password: "123456", position: "Employee", department: "", employee_id: "", salary: "" });
      fetchEmployees();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveEmployee = async () => {
    if (!selectedEmployee) return;
    
    const currentUserId = localStorage.getItem("userId");
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/employees/${selectedEmployee.id}`, {
        method: "DELETE",
        headers: { "user-id": currentUserId },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success("Employee deactivated");
      setShowDeleteDialog(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePermanentDelete = async () => {
    if (!selectedEmployee) return;
    
    const currentUserId = localStorage.getItem("userId");
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/employees/${selectedEmployee.id}/permanent`, {
        method: "DELETE",
        headers: { "user-id": currentUserId },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success("Employee permanently deleted");
      setShowPermanentDeleteDialog(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReactivate = async (employeeId) => {
    const currentUserId = localStorage.getItem("userId");
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/employees/${employeeId}/reactivate`, {
        method: "PUT",
        headers: { "user-id": currentUserId },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success("Employee reactivated");
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

  const isAdminUser = () => {
    const roleLower = userRole?.toLowerCase() || "";
    return ["administrator", "admin"].includes(roleLower);
  };

  if (!hasEmployeeManagementAccess()) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-start text-sm font-normal h-10 px-4"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add/Remove Employee
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
          Manage Leave Requests
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Employee Management
            </span>
            <div className="flex items-center gap-2">
              <Badge variant={isAdminUser() ? "destructive" : "default"}>
                {userRole}
              </Badge>
              {isAdminUser() && (
                <Badge variant="outline" className="text-xs">
                  Can Delete Permanently
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0 gap-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search employees..." 
                className="pl-9 h-10" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            <Button 
              onClick={fetchEmployees} 
              variant="outline" 
              size="default"
              disabled={isLoading}
              className="h-10 px-4"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="default" className="h-10 px-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Employee</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Username *</Label>
                      <Input 
                        value={newEmployee.username} 
                        onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})} 
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password *</Label>
                      <Input 
                        type="password" 
                        value={newEmployee.password} 
                        onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})} 
                        className="h-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input 
                      value={newEmployee.name} 
                      onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} 
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Position *</Label>
                    <Select value={newEmployee.position} onValueChange={(value) => setNewEmployee({...newEmployee, position: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Employee">Employee</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        {isAdminUser() && (
                          <SelectItem value="Administrator">Administrator</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Employee ID</Label>
                      <Input 
                        value={newEmployee.employee_id} 
                        onChange={(e) => setNewEmployee({...newEmployee, employee_id: e.target.value})} 
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Salary</Label>
                      <Input 
                        type="number" 
                        value={newEmployee.salary} 
                        onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})} 
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddDialog(false)}
                    className="h-10"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddEmployee}
                    className="h-10"
                  >
                    Add Employee
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

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
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees
                        .filter(emp => !searchTerm || 
                          emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.username?.toLowerCase().includes(searchTerm.toLowerCase()))
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
                            {employee.is_active ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Eye className="w-3 h-3 mr-1" /> Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                <EyeOff className="w-3 h-3 mr-1" /> Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {employee.is_active ? (
                                  <DropdownMenuItem 
                                    onClick={() => { 
                                      setSelectedEmployee(employee); 
                                      setShowDeleteDialog(true); 
                                    }}
                                    className="text-amber-600"
                                  >
                                    <EyeOff className="w-4 h-4 mr-2" /> Deactivate
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => handleReactivate(employee.id)}
                                    className="text-green-600"
                                  >
                                    <Eye className="w-4 h-4 mr-2" /> Reactivate
                                  </DropdownMenuItem>
                                )}
                                
                                {isAdminUser() && (
                                  <DropdownMenuItem 
                                    onClick={() => { 
                                      setSelectedEmployee(employee); 
                                      setShowPermanentDeleteDialog(true); 
                                    }}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete Permanently
                                  </DropdownMenuItem>
                                )}
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

        {/* Deactivate Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Deactivate Employee</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {selectedEmployee && (
                <p className="text-muted-foreground">
                  Deactivate <span className="font-semibold">{selectedEmployee.name || selectedEmployee.username}</span>?
                </p>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
                className="h-10"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRemoveEmployee}
                className="h-10"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Deactivate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Permanent Delete Dialog */}
        <Dialog open={showPermanentDeleteDialog} onOpenChange={setShowPermanentDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Permanently Delete Employee</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {selectedEmployee && (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">⚠️ Irreversible Action</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Permanently delete <span className="font-semibold">{selectedEmployee.name || selectedEmployee.username}</span>?
                          This cannot be undone!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowPermanentDeleteDialog(false)}
                className="h-10"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handlePermanentDelete}
                className="h-10"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Permanently
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}