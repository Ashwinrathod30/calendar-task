import React, { createContext, useContext, useState, useEffect } from 'react';
import { meetings as initialMeetings } from '../data/dummyData';

const MeetingsContext = createContext();

export const MeetingsProvider = ({ children }) => {
  const [meetings, setMeetings] = useState([]);
  const [scheduledStudents, setScheduledStudents] = useState([]);

  useEffect(() => {
    setMeetings(initialMeetings);
  }, []);

  const updateMeeting = (meetingId, updates) => {
    setMeetings(prev => 
      prev.map(meeting => 
        meeting.id === meetingId ? { ...meeting, ...updates } : meeting
      )
    );
  };

  const addMeeting = (newMeeting) => {
    setMeetings(prev => [...prev, { ...newMeeting, id: Date.now() }]);
  };

  const addMeetings = (newMeetings) => {
    setMeetings(prev => [...prev, ...newMeetings]);
  };

  const updateScheduledStudents = (students) => {
    setScheduledStudents(prev => [...prev, ...students]);
  };

  return (
    <MeetingsContext.Provider 
      value={{ 
        meetings, 
        setMeetings, 
        updateMeeting, 
        addMeeting, 
        addMeetings,
        scheduledStudents,
        updateScheduledStudents
      }}
    >
      {children}
    </MeetingsContext.Provider>
  );
};

export const useMeetings = () => {
  const context = useContext(MeetingsContext);
  if (!context) {
    throw new Error('useMeetings must be used within a MeetingsProvider');
  }
  return context;
};
