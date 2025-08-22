import { format } from 'date-fns';

export const scheduleMeetings = (dates, studentData, scheduledStudents) => {
  if (!dates.length) return { meetings: [], newlyScheduled: [] };

  const formattedDates = dates.map(date => format(date, 'yyyy-MM-dd'));
  const maxMeetingsPerDay = 4;
  const newMeetings = [];
  const newlyScheduledStudents = new Set();
  const dateClassCount = {};

  formattedDates.forEach(date => {
    dateClassCount[date] = {};
  });

  const students = studentData
    .filter(student => !scheduledStudents.includes(student.student_name))
    .sort((a, b) => b.age - a.age || b.meetings - a.meetings);

  students.forEach(student => {
    let remainingMeetings = student.meetings;

    formattedDates.forEach(date => {
      if (remainingMeetings <= 0) return;

      dateClassCount[date][student.class_name] = 
        dateClassCount[date][student.class_name] || 0;

      const totalMeetings = Object.values(dateClassCount[date])
        .reduce((sum, count) => sum + count, 0);

      if (totalMeetings < maxMeetingsPerDay &&
          dateClassCount[date][student.class_name] < 2) {

        newMeetings.push({
          id: Date.now() + newMeetings.length,
          student_name: student.student_name,
          age: student.age,
          class_name: student.class_name,
          date: date,
          status: "Scheduled",
          meetings: student.meetings
        });

        dateClassCount[date][student.class_name]++;
        remainingMeetings--;
      }
    });

    if (remainingMeetings === 0) {
      newlyScheduledStudents.add(student.student_name);
    }
  });

  return {
    meetings: newMeetings,
    newlyScheduled: Array.from(newlyScheduledStudents)
  };
};
