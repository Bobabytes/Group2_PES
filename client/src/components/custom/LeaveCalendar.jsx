import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isWithinInterval, isAfter } from "date-fns";
import { toast } from "sonner";
import "@/Pages/Dashboards/Dashboard.css";

const LeaveCalendar = ({ title = "Leave Calendar" }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      toast.error("Please log in first");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/employee/leaves?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch leave requests");
      }
      
      const data = await response.json();
      setLeaves(data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast.error("Failed to load leave data");
    } finally {
      setLoading(false);
    }
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-4 h-4 mr-2" />,
          dayColor: 'bg-green-100 hover:bg-green-200 border-green-200'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-4 h-4 mr-2" />,
          dayColor: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-200'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-4 h-4 mr-2" />,
          dayColor: 'bg-red-100 hover:bg-red-200 border-red-200'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="w-4 h-4 mr-2" />,
          dayColor: 'bg-gray-100 hover:bg-gray-200 border-gray-200'
        };
    }
  };

  // Format leave type display
  const formatLeaveType = (type) => {
    const words = type.split('_');
    return words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Handle leave item click
  const handleLeaveClick = (leave) => {
    const startDate = parseISO(leave.start_date);
    setSelectedDate(startDate);
    setCurrentMonth(startDate);
    
    if (window.innerWidth < 768) {
      const calendarElement = document.querySelector('.calendar-container');
      if (calendarElement) {
        calendarElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // Handle date selection from calendar
  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date);
      setCurrentMonth(date);
    }
  };

  // Filter leaves based on selected date
  const getLeavesForSelectedDate = () => {
    return leaves.filter(leave => {
      const startDate = parseISO(leave.start_date);
      const endDate = parseISO(leave.end_date);
      return isWithinInterval(selectedDate, { start: startDate, end: endDate });
    });
  };

  // Check if leave is in the future
  const isLeaveInFuture = (leave) => {
    const endDate = parseISO(leave.end_date);
    return isAfter(endDate, new Date());
  };

  // Get day color for a specific date
  const getDayColor = (date) => {
    // Find all leaves that cover this date
    const leavesOnDate = leaves.filter(leave => {
      const startDate = parseISO(leave.start_date);
      const endDate = parseISO(leave.end_date);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });

    if (leavesOnDate.length === 0) return '';

    // Priority: Rejected > Pending > Approved
    // If any rejected leave, show red
    const hasRejected = leavesOnDate.some(leave => leave.status.toLowerCase() === 'rejected');
    if (hasRejected) return 'bg-red-100 hover:bg-red-200 border-red-200';

    // If any pending leave, show yellow
    const hasPending = leavesOnDate.some(leave => leave.status.toLowerCase() === 'pending');
    if (hasPending) return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-200';

    // Otherwise show green
    return 'bg-green-100 hover:bg-green-200 border-green-200';
  };

  // Custom Day Component
  const CustomDay = ({ day, modifiers, ...props }) => {
    const dayColor = getDayColor(day);
    const isSelected = modifiers?.selected;
    const isToday = modifiers?.today;
    
    // Base classes
    let className = "rdp-button h-9 w-9 p-0 font-normal";
    
    // Add color classes if the day has leaves
    if (dayColor) {
      className += ` ${dayColor}`;
    }
    
    // Override for selected day
    if (isSelected) {
      className = "rdp-button h-9 w-9 p-0 font-normal bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground";
    }
    
    // For today
    if (isToday && !isSelected && !dayColor) {
      className += " border border-primary";
    }
    
    return (
      <button
        {...props}
        className={className}
      >
        {format(day, 'd')}
      </button>
    );
  };

  if (loading) {
    return (
      <Card className="list-card">
        <CardHeader className="list-card-header">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="list-card-content">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading leave data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="list-card h-full">
      <CardHeader className="list-card-header">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="list-card-content p-0">
        <ScrollArea className="h-auto">
          <div className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Left Column - Calendar */}
              <div className="calendar-container h-full w-full">
                <div className="sticky h-full">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-lg border w-full [--cell-size:--spacing(12)] md:[--cell-size:--spacing(4)]"
                  modifiers={{
                    approved: (date) => {
                      const leavesOnDate = leaves.filter(leave => {
                        const startDate = parseISO(leave.start_date);
                        const endDate = parseISO(leave.end_date);
                        const covered = isWithinInterval(date, { start: startDate, end: endDate });
                        return covered && leave.status.toLowerCase() === 'approved';
                      });
                      return leavesOnDate.length > 0;
                    },
                    pending: (date) => {
                      const leavesOnDate = leaves.filter(leave => {
                        const startDate = parseISO(leave.start_date);
                        const endDate = parseISO(leave.end_date);
                        const covered = isWithinInterval(date, { start: startDate, end: endDate });
                        return covered && leave.status.toLowerCase() === 'pending';
                      });
                      return leavesOnDate.length > 0;
                    },
                    rejected: (date) => {
                      const leavesOnDate = leaves.filter(leave => {
                        const startDate = parseISO(leave.start_date);
                        const endDate = parseISO(leave.end_date);
                        const covered = isWithinInterval(date, { start: startDate, end: endDate });
                        return covered && leave.status.toLowerCase() === 'rejected';
                      });
                      return leavesOnDate.length > 0;
                    }
                  }}
                  modifiersClassNames={{
                    approved: "leave-day approved",
                    pending: "leave-day pending",
                    rejected: "leave-day rejected"
                  }}
                />
                  
                  {/* Selected Date Info */}
                  <div className="mt-4 p-3 bg-muted/50 rounded-md border border-muted">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">
                          Selected: {format(selectedDate, 'MMM dd, yyyy')}
                        </p>
                        {getLeavesForSelectedDate().length > 0 ? (
                          <p className="text-xs text-muted-foreground">
                            {getLeavesForSelectedDate().length} leave(s) on this date
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            No leaves on this date
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">
                        {format(selectedDate, 'EEEE')}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-4 p-3 bg-muted/30 rounded-md border border-muted">
                    <p className="text-sm font-medium mb-2">Legend:</p>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-sm bg-green-100 border border-green-200 mr-1"></div>
                        <span className="text-xs">Approved</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-200 mr-1"></div>
                        <span className="text-xs">Pending</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-sm bg-red-100 border border-red-200 mr-1"></div>
                        <span className="text-xs">Rejected</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">
                      <i>Click on a leave to jump to it.</i>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Leaves List */}
              <div className="leaves-list-container h-[500px] border p-3 bg-muted/50 rounded-md">
                {leaves.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Not much here!</p>
                    <p className="text-sm">Submit a leave request to see it here</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[99%] pr-3">
                    <div className="space-y-3 ">
                      {leaves.map((leave) => {
                        const statusInfo = getStatusInfo(leave.status);
                        const startDate = parseISO(leave.start_date);
                        const endDate = parseISO(leave.end_date);
                        const isFuture = isLeaveInFuture(leave);
                        
                        return (
                          <div
                            key={leave.leave_id}
                            className={`p-3 border rounded-lg transition-all cursor-pointer hover:shadow-md ${
                              !isFuture ? 'opacity-60' : ''
                            } ${statusInfo.color} border`}
                            onClick={() => handleLeaveClick(leave)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                {statusInfo.icon}
                                <span className="font-medium">
                                  {formatLeaveType(leave.leave_type)}
                                </span>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={statusInfo.color.replace('bg-', '')}
                              >
                                {leave.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              <span>
                                {format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd, yyyy')}
                              </span>
                            </div>
                            
                            <div className="mt-2 flex justify-between items-center text-xs">
                              <span>
                                Duration: {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} days
                              </span>
                              <span className={isFuture ? 'text-muted-foreground' : 'text-muted-foreground italic'}>
                                {isFuture ? 'Upcoming' : 'Past'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LeaveCalendar;