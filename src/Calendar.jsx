import { useState, useMemo, useCallback } from 'react';
import './Calendar.css';

const Calendar = ({ events }) => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Navigation icons
  const rightArrowIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 12 12" className="nav-icon">
      <path fill="currentColor" d="M4.47 2.22a.75.75 0 0 0 0 1.06L7.19 6L4.47 8.72a.75.75 0 0 0 1.06 1.06l3.25-3.25a.75.75 0 0 0 0-1.06L5.53 2.22a.75.75 0 0 0-1.06 0"/>
    </svg>
  );

  const leftArrowIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 12 12" className="nav-icon left">
      <path fill="currentColor" d="M4.47 2.22a.75.75 0 0 0 0 1.06L7.19 6L4.47 8.72a.75.75 0 0 0 1.06 1.06l3.25-3.25a.75.75 0 0 0 0-1.06L5.53 2.22a.75.75 0 0 0-1.06 0"/>
    </svg>
  );

  // Format date as DD-MM-YYYY for event lookup - memoized
  const formatDateKey = useCallback((date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }, []);

  // Get events for a specific date - memoized
  const getEventsForDate = useCallback((date) => {
    const dateKey = formatDateKey(date);
    return events[dateKey] || [];
  }, [events, formatDateKey]);

  // Navigation functions - memoized
  const prevPeriod = useCallback(() => {
    setDate(prevDate => {
      const newDate = new Date(prevDate);
      if (view === 'month') {
        newDate.setMonth(prevDate.getMonth() - 1);
      } else if (view === 'week') {
        newDate.setDate(prevDate.getDate() - 7);
      } else if (view === 'day') {
        newDate.setDate(prevDate.getDate() - 1);
      }
      return newDate;
    });
  }, [view]);

  const nextPeriod = useCallback(() => {
    setDate(prevDate => {
      const newDate = new Date(prevDate);
      if (view === 'month') {
        newDate.setMonth(prevDate.getMonth() + 1);
      } else if (view === 'week') {
        newDate.setDate(prevDate.getDate() + 7);
      } else if (view === 'day') {
        newDate.setDate(prevDate.getDate() + 1);
      }
      return newDate;
    });
  }, [view]);

  const goToToday = useCallback(() => {
    setDate(new Date());
    setSelectedDate(new Date());
  }, []);

  // Format time to 12-hour format
  const formatTo12Hour = useCallback((timeStr) => {
    const [hours] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${timeStr.split(':')[1]} ${ampm}`;
  }, []);

  // Handle event click to navigate to the link
  const handleEventClick = useCallback((link, e) => {
    e.stopPropagation();
    if (link) {
      window.open(link, '_blank');
    }
  }, []);

  // Memoized calendar calculations
  const calendarData = useMemo(() => {
    // Get days in a month
    const getDaysInMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };

    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year, month) => {
      return new Date(year, month, 1).getDay();
    };

    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Generate time slots for day view
    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0');
      const hour12 = hour % 12 || 12;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      timeSlots.push({ hour, time: `${hourStr}:00`, time12: `${hour12}:00 ${ampm}` });
    }

    // Get days of the week for week view
    const daysOfWeek = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      daysOfWeek.push(currentDate);
    }

    return { year, month, daysInMonth, firstDay, timeSlots, daysOfWeek };
  }, [date]);

  // Render month view
  const renderMonthView = useCallback(() => {
    const { year, month, daysInMonth, firstDay } = calendarData;
    const days = [];
    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayEvents = getEventsForDate(currentDate);
      // Show up to 2 events
      const eventsToShow = dayEvents.slice(0, 2);
      const remainingEvents = dayEvents.length > 2 ? dayEvents.length - 2 : 0;

      const isToday = currentDate.getDate() === today.getDate() && 
                      currentDate.getMonth() === today.getMonth() && 
                      currentDate.getFullYear() === today.getFullYear();
      
      const isSelected = currentDate.getDate() === selectedDate.getDate() && 
                         currentDate.getMonth() === selectedDate.getMonth() && 
                         currentDate.getFullYear() === selectedDate.getFullYear();

      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => {
            setSelectedDate(new Date(year, month, day));
            setView('day');
          }}
        >
          <div className="day-header">
            <span className="day-number">{day}</span>
          </div>
          <div className="day-events">
            {eventsToShow.map((event, idx) => (
              <a 
                key={idx} 
                className="event-pill" 
                href={event.link} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => handleEventClick(event.link, e)}
                title={`${formatTo12Hour(event.time)} - ${event.event}`}
              >
                {formatTo12Hour(event.time)} - {event.event}
              </a>
            ))}
            {remainingEvents > 0 && (
              <div className="event-more">
                +{remainingEvents} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="month-view">
        <div className="weekday-header">
          <div>Sunday</div>
          <div>Monday</div>
          <div>Tuesday</div>
          <div>Wednesday</div>
          <div>Thursday</div>
          <div>Friday</div>
          <div>Saturday</div>
        </div>
        <div className="days-grid">
          {days}
        </div>
      </div>
    );
  }, [calendarData, getEventsForDate, selectedDate, formatTo12Hour, handleEventClick]);

  // Render week view
  const renderWeekView = useCallback(() => {
    const { daysOfWeek } = calendarData;
    const today = new Date();

    return (
      <div className="week-view">
        <div className="week-days-container">
          {daysOfWeek.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isToday = day.getDate() === today.getDate() && 
                          day.getMonth() === today.getMonth() && 
                          day.getFullYear() === today.getFullYear();
            
            const isSelected = day.getDate() === selectedDate.getDate() && 
                             day.getMonth() === selectedDate.getMonth() && 
                             day.getFullYear() === selectedDate.getFullYear();

            // Show up to 4 events
            const eventsToShow = dayEvents.slice(0, 4);
            const remainingEvents = dayEvents.length > 4 ? dayEvents.length - 4 : 0;

            return (
              <div 
                key={index} 
                className={`week-day-column ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedDate(new Date(day));
                  setView('day');
                }}
              >
                <div className="week-day-header">
                  <div className="weekday">
                    {day.toLocaleDateString('en-US', { weekday: 'long' })}
                  </div>
                  <div className="date">{day.getDate()}</div>
                </div>
                <div className="week-day-events">
                  {eventsToShow.map((event, idx) => (
                    <a 
                      key={idx} 
                      className="week-event" 
                      href={event.link}
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => handleEventClick(event.link, e)}
                      title={`${formatTo12Hour(event.time)} - ${event.event}`}
                    >
                      <div className="event-time">{formatTo12Hour(event.time)}</div>
                      <div className="event-title">{event.event}</div>
                    </a>
                  ))}
                  {remainingEvents > 0 && (
                    <div className="week-event-more">
                      +{remainingEvents} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [calendarData, getEventsForDate, selectedDate, formatTo12Hour, handleEventClick]);

  // Render day view
  const renderDayView = useCallback(() => {
    const { timeSlots } = calendarData;
    const eventsForDay = getEventsForDate(selectedDate);

    return (
      <div className="day-view">
        <div className="day-header">
          <h3>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
        </div>
        <div className="day-body">
          <div className="time-column">
            {timeSlots.map((slot) => (
              <div key={slot.time} className="time-slot">
                <span>{slot.time12}</span>
              </div>
            ))}
          </div>
          <div className="events-column">
            {timeSlots.map((slot) => {
              const eventsAtTime = eventsForDay.filter(event => event.time.startsWith(slot.hour.toString().padStart(2, '0')));
              
              return (
                <div key={slot.time} className="day-time-slot">
                  {eventsAtTime.map((event, eventIdx) => (
                    <a 
                      key={eventIdx} 
                      className="day-event" 
                      href={event.link}
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => handleEventClick(event.link, e)}
                      title={`${formatTo12Hour(event.time)} - ${event.event}`}
                    >
                      <div className="event-time">{formatTo12Hour(event.time)}</div>
                      <div className="event-title">{event.event}</div>
                    </a>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }, [calendarData, getEventsForDate, selectedDate, formatTo12Hour, handleEventClick]);

  // Memoized view renderer
  const currentView = useMemo(() => {
    switch(view) {
      case 'month': return renderMonthView();
      case 'week': return renderWeekView();
      case 'day': return renderDayView();
      default: return renderMonthView();
    }
  }, [view, renderMonthView, renderWeekView, renderDayView]);

  // Memoized title renderer
  const title = useMemo(() => {
    if (view === 'month') {
      return (
        <h2>{date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
      );
    } else if (view === 'week') {
      const { daysOfWeek } = calendarData;
      return (
        <h2>
          Week of {daysOfWeek[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {daysOfWeek[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </h2>
      );
    } else if (view === 'day') {
      return (
        <h2>{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
      );
    }
  }, [view, date, selectedDate, calendarData]);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
      <div style={{ width: "160px" }}>
  <div className="calendar-title">
    {title}
  </div>
</div>

        <div className="calendar-actions">
          <button onClick={prevPeriod} className="nav-button">
            {leftArrowIcon}
          </button>
          <button onClick={goToToday} className="today-button">
            Today
          </button>
          <button onClick={nextPeriod} className="nav-button">
            {rightArrowIcon}
          </button>
        </div>
        <div className="view-switcher">
          <button onClick={() => setView('day')} className={view === 'day' ? 'active' : ''}>
            Day
          </button>
          <button onClick={() => setView('week')} className={view === 'week' ? 'active' : ''}>
            Week
          </button>
          <button onClick={() => setView('month')} className={view === 'month' ? 'active' : ''}>
            Month
          </button>
        </div>
      </div>
      <div className="calendar-body">
        {currentView}
      </div>
    </div>
  );
};

export default Calendar;