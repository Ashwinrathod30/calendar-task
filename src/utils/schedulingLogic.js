import { students } from '../data/dummyData';

export const scheduleMeetings = (selectedDates, filters = {}) => {
  // Sort students by age in descending order (older students first)
  const sortedStudents = [...students].sort((a, b) => b.age - a.age);

  // Apply filters if any
  let filteredStudents = sortedStudents;
  if (filters.className) {
    filteredStudents = filteredStudents.filter(student => student.class === filters.className);
  }
  if (filters.studentName) {
    filteredStudents = filteredStudents.filter(student => 
      student.name.toLowerCase().includes(filters.studentName.toLowerCase())
    );
  }

  // Get number of students per date for balanced distribution
  const studentsPerDay = Math.ceil(filteredStudents.length / selectedDates.length);

  // Create balanced schedule
  const schedule = {};
  selectedDates.forEach(date => {
    schedule[date] = [];
  });

  // Distribute students across dates
  filteredStudents.forEach((student, index) => {
    const dateIndex = Math.floor(index / studentsPerDay);
    const date = selectedDates[dateIndex];
    if (date) {
      schedule[date].push(student);
    }
  });

  return schedule;
};

// Function to get meetings summary
export const getMeetingsSummary = (meetings) => {
  const summary = {
    totalMeetings: 0,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    byClass: {},
  };

  meetings.forEach(meeting => {
    summary.totalMeetings++;
    summary[`${meeting.status.toLowerCase()}Count`]++;

    const student = students.find(s => s.id === meeting.studentId);
    if (student) {
      if (!summary.byClass[student.class]) {
        summary.byClass[student.class] = {
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
        };
      }
      summary.byClass[student.class].total++;
      summary.byClass[student.class][meeting.status.toLowerCase()]++;
    }
  });

  return summary;
};
