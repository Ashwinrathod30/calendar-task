import { meetings, classes } from '../data/dummyData';
import { exportToExcel } from '../utils/excelExport';

const Overview = () => {
  const getClassStats = (className) => {
    const classMeetings = meetings.filter(m => m.class_name === className);

    return {
      total: classMeetings.length,
      present: classMeetings.filter(m => m.status === 'Present').length,
      absent: classMeetings.filter(m => m.status === 'Absent').length,
      late: classMeetings.filter(m => m.status === 'Late').length,
    };
  };

  const getDailyStats = (date) => {
    const dayMeetings = meetings.filter(m => m.date === date);
    return {
      total: dayMeetings.length,
      present: dayMeetings.filter(m => m.status === 'Present').length,
      absent: dayMeetings.filter(m => m.status === 'Absent').length,
      late: dayMeetings.filter(m => m.status === 'Late').length,
    };
  };

  const uniqueDates = [...new Set(meetings.map(m => m.date))];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule Overview</h1>
        <button
          onClick={() => {
            try {
              const success = exportToExcel();
              if (success) {
                alert('Excel file exported successfully!');
              } else {
                alert('Failed to export Excel file. Please try again.');
              }
            } catch (error) {
              console.error('Error exporting:', error);
              alert('Error exporting to Excel. Please try again.');
            }
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Export to Excel
        </button>
      </div>

      <div className="grid gap-6">
        {/* Class-wise Summary */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Class-wise Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map(cls => {
              const stats = getClassStats(cls.name);
              return (
                <div key={cls.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{cls.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Instructor: {cls.instructor_name}</p>
                  <div className="space-y-1">
                    <p>Total Students: {cls.totalStudents}</p>
                    <p>Total Meetings: {stats.total}</p>
                    <p className="text-green-600">Present: {stats.present}</p>
                    <p className="text-red-600">Absent: {stats.absent}</p>
                    <p className="text-yellow-600">Late: {stats.late}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Summary */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Daily Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {uniqueDates.map(date => {
              const stats = getDailyStats(date);
              const dailyMeetings = meetings.filter(m => m.date === date);
              return (
                <div key={date} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{date}</h3>
                  <div className="space-y-1">
                    <p>Total Students: {stats.total}</p>
                    <p className="text-green-600">Present: {stats.present}</p>
                    <p className="text-red-600">Absent: {stats.absent}</p>
                    <p className="text-yellow-600">Late: {stats.late}</p>
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm font-medium mb-1">Students:</p>
                      <ul className="text-sm text-muted-foreground">
                        {dailyMeetings.map(meeting => (
                          <li key={meeting.id}>
                            {meeting.student_name} ({meeting.class_name})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
