import * as XLSX from 'xlsx';
import { meetings, classes } from '../data/dummyData';

export const exportToExcel = () => {
  try {
    console.log('Starting Excel export...');
    console.log('Available meetings:', meetings);
    console.log('Available classes:', classes);

    if (!meetings.length) {
      console.error('No meetings data available');
      return false;
    }

    // Create overview data
    const overviewData = classes.map(cls => {
      const classMeetings = meetings.filter(m => m.class_name === cls.name);

      return {
        'Class Name': cls.name,
        'Instructor': cls.instructor_name,
        'Total Students': cls.totalStudents,
        'Total Meetings': classMeetings.length,
        'Present': classMeetings.filter(m => m.status === 'Present').length,
        'Absent': classMeetings.filter(m => m.status === 'Absent').length,
        'Late': classMeetings.filter(m => m.status === 'Late').length,
      };
    });

    console.log('Overview data prepared:', overviewData);

    // Create meetings data in the required format
    const meetingsData = meetings.map(meeting => ({
      'Date': meeting.date,
      'Student Name': meeting.student_name,
      'Class': meeting.class_name,
      'Age': meeting.age,
      'Meeting Link': `https://meet.example.com/${meeting.student_name.toLowerCase().split(' ')[0]}${Math.floor(Math.random() * 1000)}`,
      'Attendance': meeting.status
    }));

    console.log('Meetings data prepared:', meetingsData);

    // Sort meetings by date
    meetingsData.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    
    if (!meetingsData.length) {
      console.error('No meetings data was formatted');
      return false;
    }

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create meetings sheet
    const wsMeetings = XLSX.utils.json_to_sheet(meetingsData);
    
    // Set column widths for meetings sheet
    const meetingsColWidths = [
      { wch: 12 },  // Date
      { wch: 20 },  // Student Name
      { wch: 15 },  // Class
      { wch: 5 },   // Age
      { wch: 45 },  // Meeting Link
      { wch: 12 }   // Attendance
    ];
    wsMeetings['!cols'] = meetingsColWidths;

    // Create overview sheet
    const wsOverview = XLSX.utils.json_to_sheet(overviewData);

    // Set column widths for overview sheet
    const overviewColWidths = [
      { wch: 15 },  // Class Name
      { wch: 20 },  // Instructor
      { wch: 15 },  // Total Students
      { wch: 15 },  // Total Meetings
      { wch: 10 },  // Present
      { wch: 10 },  // Absent
      { wch: 10 }   // Late
    ];
    wsOverview['!cols'] = overviewColWidths;

    // Add the sheets to the workbook
    XLSX.utils.book_append_sheet(wb, wsMeetings, 'Meetings');
    XLSX.utils.book_append_sheet(wb, wsOverview, 'Overview');

    // Save the file
    XLSX.writeFile(wb, 'meetings-schedule.xlsx');
    
    return true; // Return true if export was successful
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false; // Return false if export failed
  }
};
