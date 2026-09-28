# Task Master Pro - To-Do List Application

A modern, feature-rich to-do list application with local storage, categories, priorities, dark mode, and advanced task management.

## Features

✅ **Task Management**
- Add, edit, delete tasks
- Mark tasks as complete/incomplete
- Reorder tasks via drag-and-drop
- Persistent local storage (all data saved to browser)

✅ **Organization**
- Categorize tasks (Work, Personal, Health, Finance, etc.)
- Priority levels (High, Medium, Low)
- Due dates and time tracking
- Custom tags for flexible categorization

✅ **Filtering & Search**
- Filter by status (All, Active, Completed)
- Filter by priority level
- Filter by category
- Real-time search functionality
- Task counter by category

✅ **User Experience**
- Dark mode / Light mode toggle
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Keyboard shortcuts (Enter to add, Esc to cancel)
- Confirmation dialogs for destructive actions

✅ **Data Management**
- Auto-save to localStorage
- Export tasks as JSON
- Import tasks from JSON
- Clear completed tasks
- Bulk delete tasks

## Getting Started

### Option 1: Direct Browser
```bash
# Clone the repository
git clone https://github.com/lulkoangpuok26-cloud/todo-list-app.git
cd todo-list-app

# Open index.html in your browser
open index.html
```

### Option 2: Local Server
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js
npx http-server

# Then visit http://localhost:8000
```

## Usage

1. **Add a Task**: Type in the input field and press Enter or click Add
2. **Set Priority**: Click priority button (High/Medium/Low)
3. **Choose Category**: Select from dropdown
4. **Set Due Date**: Click calendar icon to add deadline
5. **Complete Task**: Click checkbox to mark done
6. **Edit Task**: Click edit icon to modify
7. **Delete Task**: Click delete icon to remove
8. **Filter Tasks**: Use filter buttons to view specific tasks
9. **Search**: Use search bar to find tasks quickly
10. **Dark Mode**: Toggle theme in top-right corner

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Add new task |
| `Esc` | Cancel editing |
| `Ctrl/Cmd + A` | Select all tasks |
| `Ctrl/Cmd + K` | Focus search |
| `Ctrl/Cmd + E` | Export tasks |

## Data Structure

Tasks are stored as:
```json
{
  "id": "task_uuid",
  "title": "Task name",
  "description": "Optional description",
  "completed": false,
  "priority": "high",
  "category": "work",
  "dueDate": "2026-12-31",
  "tags": ["urgent", "important"],
  "createdAt": "2026-09-28T12:00:00.000Z",
  "updatedAt": "2026-09-28T12:00:00.000Z",
  "completedAt": null
}
```

## Browser Support

✅ Chrome/Chromium
✅ Firefox
✅ Safari
✅ Edge
✅ Mobile browsers

## Storage Limits

- localStorage: ~5-10MB per domain
- All data stored in browser (no server required)
- Data persists across browser sessions

## Privacy

- 🔒 100% client-side (no backend required)
- 🔐 Data never leaves your device
- 📱 Works offline
- 🛡️ No tracking or telemetry

## License

MIT

## Support

For issues or feature requests, please open a GitHub issue.
