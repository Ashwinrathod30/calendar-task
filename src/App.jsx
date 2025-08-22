import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Calendar from './components/Calendar';
import Overview from './pages/Overview';
import { ThemeProvider } from './components/ui/theme-provider';
import { ModeToggle } from './components/ui/mode-toggle';
import { MeetingsProvider } from './context/MeetingsContext';
import './styles/globals.css';

function App() {
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateSelect = (date) => {
    setSelectedDates(prev => {
      const exists = prev.find(d => d.getTime() === date.getTime());
      if (exists) {
        return prev.filter(d => d.getTime() !== date.getTime());
      }
      return [...prev, date];
    });
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <MeetingsProvider>
        <Router basename="/calendar-task">
          <div className="min-h-screen bg-background">
            <nav className="border-b mb-4">
            <div className="container mx-auto px-4 py-3">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Meeting Scheduler</h1>
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/" 
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Calendar
                  </Link>
                  <Link 
                    to="/overview" 
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Overview
                  </Link>
                  <ModeToggle />
                </div>
              </div>
            </div>
          </nav>

          <main className="container mx-auto px-4">
            <Routes>
              <Route 
                path="/" 
                element={<Calendar onDateSelect={handleDateSelect} />} 
              />
              <Route 
                path="/overview" 
                element={<Overview />} 
              />
            </Routes>
          </main>
        </div>
        </Router>
      </MeetingsProvider>
    </ThemeProvider>
  );
}

export default App;
