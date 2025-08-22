import * as React from "react";
import { format } from "date-fns";
import { classes, studentData } from "../data/dummyData";

const MeetingDialog = ({ isOpen, onClose, date, onSave, existingMeeting = null }) => {
  const [selectedClass, setSelectedClass] = React.useState(existingMeeting?.class_name || "");
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [status, setStatus] = React.useState(existingMeeting?.status || "Scheduled");

  React.useEffect(() => {
    if (existingMeeting) {
      const student = studentData.find(s => s.student_name === existingMeeting.student_name);
      setSelectedStudent(student);
      setSelectedClass(existingMeeting.class_name);
    }
  }, [existingMeeting]);

  const handleClassChange = (selectedClassName) => {
    setSelectedClass(selectedClassName);
    const instructor = classes.find(c => c.name === selectedClassName)?.instructor_name || "";
    setInstructorName(instructor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const meetingData = {
      id: existingMeeting?.id || Date.now(),
      student_name: selectedStudent.student_name,
      age: selectedStudent.age,
      class_name: selectedStudent.class_name,
      instructor_name: classes.find(c => c.name === selectedStudent.class_name)?.instructor_name,
      date: format(date, "yyyy-MM-dd"),
      status,
      meetings: selectedStudent.meetings
    };

    onSave(meetingData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center">
      <div className="fixed inset-0 z-50 bg-background/80" onClick={onClose} />
      <div className="z-50 bg-card p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <h2 className="text-lg font-semibold mb-4">
          {existingMeeting ? "Edit Meeting" : "Schedule New Meeting"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Student</label>
            <select
              value={selectedStudent?.student_name || ""}
              onChange={(e) => {
                const student = studentData.find(s => s.student_name === e.target.value);
                setSelectedStudent(student);
                setSelectedClass(student?.class_name || "");
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Select Student</option>
              {studentData
                .sort((a, b) => b.age - a.age) // Sort by age (older first)
                .map((student) => (
                  <option key={student.student_name} value={student.student_name}>
                    {student.student_name} (Age: {student.age}, Class: {student.class_name}, Meetings: {student.meetings})
                  </option>
                ))}
            </select>
          </div>

          {selectedStudent && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Age</label>
                <input
                  type="text"
                  value={selectedStudent.age}
                  disabled
                  className="w-full rounded-md border border-input bg-muted px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Class</label>
                <input
                  type="text"
                  value={selectedStudent.class_name}
                  disabled
                  className="w-full rounded-md border border-input bg-muted px-3 py-2"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Meetings Required</label>
            <input
              type="text"
              value={selectedStudent?.meetings || ""}
              disabled
              className="w-full rounded-md border border-input bg-muted px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <input
              type="text"
              value={format(date, "MMMM dd, yyyy")}
              className="w-full rounded-md border border-input bg-muted px-3 py-2"
              disabled
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {existingMeeting ? "Update" : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingDialog;
