# Meeting Scheduler

A dynamic meeting scheduler web application built with React that allows users to manage student meetings efficiently.

## Features

- 📅 Interactive Calendar Interface
  - Select multiple dates
  - View scheduled meetings
  - Add and edit meetings
  
- 📊 Smart Scheduling Logic
  - Prioritizes older students
  - Ensures balanced class distribution
  - Flexible filtering options
  
- 📑 Comprehensive Overview
  - Class-wise meeting summaries
  - Daily attendance tracking
  - Total student statistics
  
- 📤 Excel Export Functionality
  - Overview sheet with summaries
  - Date-wise detailed sheets
  - Attendance tracking

## Tech Stack

- React.js
- TailwindCSS
- shadcn/ui
- React Router
- date-fns
- SheetJS (xlsx)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd social-media-calendar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Project Structure

```
src/
├── components/   # Reusable UI components
│   └── Calendar.jsx
├── pages/        # Main application pages
│   └── Overview.jsx
├── utils/        # Helper functions
│   ├── excelExport.js
│   └── schedulingLogic.js
├── data/         # Dummy API data
│   └── dummyData.js
├── styles/       # Global styles
│   └── globals.css
├── App.jsx       # Main application component
└── main.jsx     # Application entry point
```

## Features in Detail

### Calendar Component
- Grid-based calendar view
- Multiple date selection
- Meeting indicators
- Interactive date cells

### Scheduling Logic
- Age-based prioritization
- Class distribution balancing
- Filtering capabilities:
  - By class name
  - By student name

### Overview Page
- Class-wise statistics
- Daily meeting summaries
- Attendance tracking
- Export functionality

### Excel Export
- Overview sheet with:
  - Class-wise counts
  - Attendance summaries
  - Total statistics
- Date-wise sheets containing:
  - Student details
  - Meeting links
  - Attendance status

## Example Excel Output

The exported Excel file contains:

1. Overview Sheet:
   - Class Name
   - Total Students
   - Total Meetings
   - Present/Absent/Late counts

2. Date-wise Sheets:
   - Student Name
   - Class
   - Age
   - Meeting Link
   - Attendance Status

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
