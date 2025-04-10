# FluentUI React Calendar

A read-only, view-only calendar component for React applications with day, week, and month views. This lightweight component allows you to display events in a clean, modern interface inspired by the FluentUI design system.

![npm](https://img.shields.io/npm/v/fluentui-react-calendar)
[![NPM Package](https://img.shields.io/badge/npm-fluentui--react--calendar-blue)](https://www.npmjs.com/package/fluentui-react-calendar)

**Website:** [https://fluentui-calendar.pages.dev/](https://fluentui-calendar.pages.dev/)


## Features

- **Multiple Views**: Seamlessly switch between day, week, and month views
- **Event Display**: Shows events with times and titles in all views
- **Navigation**: Easily navigate between days, weeks, or months
- **Clickable Events**: Events can optionally link to URLs when clicked
- **Current Day Highlighting**: Automatically highlights the current day
- **Responsive Design**: Works across different screen sizes
- **Read-Only**: View-only component - no editing capabilities
- **Lightweight**: Focused on displaying events without unnecessary complexity

## Installation

```bash
npm install fluentui-react-calendar
```

## Usage

```jsx
import Calendar from 'fluentui-react-calendar';

function App() {
  // Events object - keys are date strings in DD-MM-YYYY format
  const events = {
    "21-04-2025": [
      { 
        "time": "09:00", 
        "event": "Morning meeting", 
        "link": "https://meeting.example.com/morning" // link is optional
      },
      { 
        "time": "14:30", 
        "event": "Client presentation" 
        // No link provided - will not be clickable
      }
    ],
    "22-04-2025": [
      { 
        "time": "10:00", 
        "event": "Project kickoff", 
        "link": "https://projects.example.com/kickoff" 
      }
    ]
  };

  return (
    <div className="app">
      <Calendar events={events} />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `events` | Object | Yes | An object containing events organized by date. The key format should be "DD-MM-YYYY" (e.g., "21-04-2025"). |

### Event Object Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `time` | String | Yes | Time of the event in 24-hour format (e.g., "09:00", "14:30") |
| `event` | String | Yes | Title or description of the event |
| `link` | String | No | Optional URL that will open when the event is clicked |

## Views

### Month View
- Displays an entire month in a traditional calendar grid
- Shows up to 2 events per day with a "+more" indicator for additional events
- Clicking on a day navigates to the day view for that date

### Week View
- Displays 7 days in a row
- Shows up to 4 events per day with a "+more" indicator for additional events
- Clicking on a day navigates to the day view for that date

### Day View
- Shows all events for a single day organized by hour
- Events are placed in their respective time slots

## Design Considerations

- This is a **view-only** calendar - it does not support adding, editing, or deleting events
- Events are displayed in chronological order
- The current day is automatically highlighted
- Time is displayed in 12-hour format with AM/PM indicators

## Example Event Object

```javascript
const events = {
  "21-04-2025": [
    { 
      "time": "09:00", 
      "event": "Morning meeting", 
      "link": "https://meeting.example.com/morning" 
    },
    { 
      "time": "14:33", 
      "event": "Client presentation", 
      "link": "https://presentation.example.com/client" 
    },
    { 
      "time": "16:00", 
      "event": "Project deadline", 
      "link": "https://projects.example.com/deadline" 
    }
  ],
  "22-04-2025": [
    { 
      "time": "10:00", 
      "event": "Project kickoff", 
      "link": "https://projects.example.com/kickoff" 
    }
  ]
}
```

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer 11 (with appropriate polyfills)

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.