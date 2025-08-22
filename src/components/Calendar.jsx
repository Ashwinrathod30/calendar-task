import React from "react";
import { 
  addMonths, 
  subMonths, 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay 
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { meetings, studentData } from "../data/dummyData";
import { cn } from "../utils/cn";
import MeetingDialog from "./MeetingDialog";

function Calendar({ onDateSelect }) {
  // State declarations
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedDates, setSelectedDates] = React.useState([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedMeetingDate, setSelectedMeetingDate] = React.useState(null);
  const [editingMeeting, setEditingMeeting] = React.useState(null);
  const [localMeetings, setLocalMeetings] = React.useState([]);
  const [scheduledStudents, setScheduledStudents] = React.useState([]);

  // Initialize meetings from dummyData
  React.useEffect(() => {
    setLocalMeetings(meetings);
  }, []);

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateClick = (date) => {
    const isSelected = selectedDates.some(d => isSameDay(d, date));
    
    if (isSelected) {
      setSelectedDates(prev => prev.filter(d => !isSameDay(d, date)));
    } else {
      const newSelectedDates = [...selectedDates, date];
      setSelectedDates(newSelectedDates);
      
      if (newSelectedDates.length >= 2) {
        const formattedDates = newSelectedDates.map(d => format(d, 'yyyy-MM-dd'));
        const unscheduledStudents = studentData
          .filter(s => !scheduledStudents.includes(s.student_name))
          .sort((a, b) => b.age - a.age || b.meetings - a.meetings);

        const newMeetings = [];
        const newlyScheduledStudents = new Set();
        const dateClassCount = Object.fromEntries(formattedDates.map(d => [d, {}]));
        const maxMeetingsPerDay = 4;

        for (const student of unscheduledStudents) {
          let remainingMeetings = student.meetings;

          for (const dateStr of formattedDates) {
            if (remainingMeetings <= 0) break;

            if (!dateClassCount[dateStr][student.class_name]) {
              dateClassCount[dateStr][student.class_name] = 0;
            }

            const totalMeetings = Object.values(dateClassCount[dateStr])
              .reduce((a, b) => a + b, 0);

            if (totalMeetings < maxMeetingsPerDay &&
                dateClassCount[dateStr][student.class_name] < 2) {

              newMeetings.push({
                id: Date.now() + newMeetings.length,
                student_name: student.student_name,
                age: student.age,
                class_name: student.class_name,
                date: dateStr,
                status: "Scheduled",
                meetings: student.meetings
              });

              dateClassCount[dateStr][student.class_name]++;
              remainingMeetings--;
            }
          }

          if (remainingMeetings === 0) {
            newlyScheduledStudents.add(student.student_name);
          }
        }

        setLocalMeetings(prev => [...prev, ...newMeetings]);
        setScheduledStudents(prev => [...prev, ...Array.from(newlyScheduledStudents)]);
      }
    }
    
    onDateSelect?.(date);
  };

  const getMeetingsForDate = React.useCallback((date) => {
    return localMeetings.filter(meeting => 
      meeting.date === format(date, 'yyyy-MM-dd')
    );
  }, [localMeetings]);

  const handleEditMeeting = (meeting) => {
    setEditingMeeting(meeting);
    setSelectedMeetingDate(new Date(meeting.date));
    setIsDialogOpen(true);
  };

  const handleAddMeeting = (date) => {
    setSelectedMeetingDate(date);
    setEditingMeeting(null);
    setIsDialogOpen(true);
  };

  const handleSaveMeeting = (meetingData) => {
    if (editingMeeting) {
      // Update existing meeting
      setLocalMeetings(prev =>
        prev.map(meeting =>
          meeting.id === editingMeeting.id ? { ...meeting, ...meetingData } : meeting
        )
      );
    } else {
      // Add new meeting
      setLocalMeetings(prev => [
        ...prev,
        {
          id: Date.now(),
          ...meetingData,
          date: format(selectedMeetingDate, 'yyyy-MM-dd'),
          status: "Scheduled"
        }
      ]);
    }
    setIsDialogOpen(false);
    setEditingMeeting(null);
  };

  return (
    <div className="p-4 bg-card rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          {format(selectedDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="w-full grid grid-cols-7 gap-px rounded-lg bg-muted p-px mt-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground p-3"
          >
            {day}
          </div>
        ))}
        {monthDays.map((day) => {
          const isSelected = selectedDates.some(d => isSameDay(d, day));
          const dayMeetings = getMeetingsForDate(day);
          const hasMeetings = dayMeetings.length > 0;
          const isCurrentMonth = isSameMonth(day, selectedDate);

          return (
            <button
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={cn(
                "relative h-14 p-2 text-center focus-within:relative focus-within:z-20 focus:z-20 [&:has([aria-selected])]:bg-accent transition-colors",
                !isCurrentMonth && "text-muted-foreground",
                isSelected && "bg-primary/10",
                hasMeetings && !isSelected && "bg-secondary/20"
              )}
            >
              <div className="relative">
                <time
                  dateTime={format(day, "yyyy-MM-dd")}
                  className={cn(
                    "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                    isSelected && "bg-primary text-primary-foreground font-semibold"
                  )}
                >
                  {format(day, "d")}
                </time>
                {hasMeetings ? (
                  <div 
                    className="absolute bottom-1 left-0 right-0 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditMeeting(dayMeetings[0]);
                    }}
                  >
                    <div className="mx-auto flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {dayMeetings.length > 1 && (
                        <div className="ml-1 text-xs text-muted-foreground">
                          +{dayMeetings.length - 1}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddMeeting(day);
                    }}
                    className="absolute bottom-1 left-0 right-0 mx-auto w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent rounded-full cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {selectedDates.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Selected Dates</h3>
          <div className="flex flex-wrap gap-2">
            {selectedDates.map((date) => (
              <div
                key={date.toString()}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground"
              >
                {format(date, "MMM dd, yyyy")}
              </div>
            ))}
          </div>
        </div>
      )}
      {isDialogOpen && selectedMeetingDate && (
        <MeetingDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          date={selectedMeetingDate}
          onSave={handleSaveMeeting}
          existingMeeting={editingMeeting}
        />
      )}
    </div>
  );
}

export default Calendar;
