// Task Master Pro - To-Do List Application
// Local Storage based task management system

const STORAGE_KEY = 'taskMasterPro_tasks';
const THEME_KEY = 'taskMasterPro_theme';
const DEFAULT_CATEGORIES = ['general', 'work', 'personal', 'health', 'finance', 'shopping', 'learning'];
const DEFAULT_PRIORITIES = ['low', 'medium', 'high'];

class TaskManager {
  constructor() {
    this.tasks = this.loadTasks();
    this.currentFilter = 'all';
    this.currentPriorityFilter = null;
    this.searchQuery = '';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadTheme();
    this.render();
  }

  setupEventListeners() {
    // Add task
    document.getElementById('addTaskBtn').addEventListener('click', () => this.handleAddTask());
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleAddTask();
    });

    // Filter buttons
    document.querySelectorAll('.btn-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
        e.target.closest('.btn-filter').classList.add('active');
        this.currentFilter = e.target.closest('.btn-filter').dataset.filter;
        this.render();
      });
    });

    // Priority filters
    document.querySelectorAll('.btn-priority').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btn_elem = e.target.closest('.btn-priority');
        btn_elem.classList.toggle('active');
        this.currentPriorityFilter = btn_elem.classList.contains('active') ? btn_elem.dataset.priority : null;
        this.render();
      });
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.render();
    });

    // Clear completed
    document.getElementById('clearCompletedBtn').addEventListener('click', () => this.clearCompleted());

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

    // Export
    document.getElementById('exportBtn').addEventListener('click', () => this.exportTasks());

    // Import
    document.getElementById('importBtn').addEventListener('click', () => {
      document.getElementById('importInput').click();
    });
    document.getElementById('importInput').addEventListener('change', (e) => this.importTasks(e));

    // Modal
    document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
    document.getElementById('cancelEditBtn').addEventListener('click', () => this.closeModal());
    document.getElementById('saveEditBtn').addEventListener('click', () => this.saveEdit());
    document.getElementById('editModal').addEventListener('click', (e) => {
      if (e.target.id === 'editModal') this.closeModal();
    });
  }

  handleAddTask() {
    const input = document.getElementById('taskInput');
    const title = input.value.trim();
    if (!title) return;

    const priority = document.getElementById('prioritySelect').value;
    const category = document.getElementById('categorySelect').value;
    const dueDate = document.getElementById('dueDateInput').value;

    const task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description: '',
      completed: false,
      priority,
      category,
      dueDate: dueDate || null,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null
    };

    this.tasks.unshift(task);
    this.save();
    input.value = '';
    document.getElementById('dueDateInput').value = '';
    this.render();
  }

  deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      this.save();
      this.render();
    }
  }

  toggleTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      task.updatedAt = new Date().toISOString();
      this.save();
      this.render();
    }
  }

  openEditModal(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    this.editingTaskId = taskId;
    document.getElementById('editTaskInput').value = task.title;
    document.getElementById('editTaskDescription').value = task.description || '';
    document.getElementById('editPriority').value = task.priority;
    document.getElementById('editCategory').value = task.category;
    document.getElementById('editDueDate').value = task.dueDate || '';

    document.getElementById('editModal').classList.add('active');
    document.getElementById('editTaskInput').focus();
  }

  closeModal() {
    document.getElementById('editModal').classList.remove('active');
    this.editingTaskId = null;
  }

  saveEdit() {
    if (!this.editingTaskId) return;

    const task = this.tasks.find(t => t.id === this.editingTaskId);
    if (!task) return;

    task.title = document.getElementById('editTaskInput').value.trim();
    task.description = document.getElementById('editTaskDescription').value.trim();
    task.priority = document.getElementById('editPriority').value;
    task.category = document.getElementById('editCategory').value;
    task.dueDate = document.getElementById('editDueDate').value || null;
    task.updatedAt = new Date().toISOString();

    this.save();
    this.closeModal();
    this.render();
  }

  clearCompleted() {
    const completedCount = this.tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
      alert('No completed tasks to clear.');
      return;
    }
    if (confirm(`Clear ${completedCount} completed task(s)?`)) {
      this.tasks = this.tasks.filter(t => !t.completed);
      this.save();
      this.render();
    }
  }

  getFilteredTasks() {
    let filtered = this.tasks;

    // Status filter
    if (this.currentFilter === 'active') {
      filtered = filtered.filter(t => !t.completed);
    } else if (this.currentFilter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }

    // Priority filter
    if (this.currentPriorityFilter) {
      filtered = filtered.filter(t => t.priority === this.currentPriorityFilter);
    }

    // Search filter
    if (this.searchQuery) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(this.searchQuery) ||
        (t.description && t.description.toLowerCase().includes(this.searchQuery))
      );
    }

    return filtered;
  }

  getStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const remaining = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, remaining, percentage };
  }

  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  renderTask(task) {
    const daysUntilDue = task.dueDate ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
    const isOverdue = daysUntilDue !== null && daysUntilDue < 0 && !task.completed;
    const isToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

    const taskEl = document.createElement('div');
    taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskEl.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-task-id="${task.id}">
      <div class="task-content">
        <div class="task-header">
          <div class="task-title">${this.escapeHtml(task.title)}</div>
          <span class="task-priority ${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
          <span class="task-category">${task.category.charAt(0).toUpperCase() + task.category.slice(1)}</span>
        </div>
        ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">
          ${task.createdAt ? `<div class="task-meta-item">📅 Created: ${this.formatDate(task.createdAt)}</div>` : ''}
          ${task.dueDate ? `<div class="task-meta-item" style="${isOverdue ? 'color: var(--color-danger);' : ''}">⏰ ${isToday ? 'Due Today' : isOverdue ? '⚠️ Overdue' : 'Due: ' + this.formatDate(task.dueDate)}</div>` : ''}
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-task-action edit" data-task-id="${task.id}" title="Edit task">✎</button>
        <button class="btn-task-action delete" data-task-id="${task.id}" title="Delete task">🗑</button>
      </div>
    `;

    // Checkbox event
    taskEl.querySelector('.task-checkbox').addEventListener('change', () => this.toggleTask(task.id));

    // Edit button
    taskEl.querySelector('.edit').addEventListener('click', () => this.openEditModal(task.id));

    // Delete button
    taskEl.querySelector('.delete').addEventListener('click', () => this.deleteTask(task.id));

    return taskEl;
  }

  render() {
    const container = document.getElementById('tasksContainer');
    const emptyState = document.getElementById('emptyState');
    const filteredTasks = this.getFilteredTasks();
    const stats = this.getStats();

    // Update stats
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statCompleted').textContent = stats.completed;
    document.getElementById('statRemaining').textContent = stats.remaining;
    document.getElementById('statPercent').textContent = stats.percentage + '%';

    // Update filter counts
    const activeTasks = this.tasks.filter(t => !t.completed).length;
    const completedTasks = this.tasks.filter(t => t.completed).length;
    document.getElementById('countAll').textContent = this.tasks.length;
    document.getElementById('countActive').textContent = activeTasks;
    document.getElementById('countCompleted').textContent = completedTasks;

    // Render tasks
    container.innerHTML = '';
    if (filteredTasks.length === 0) {
      emptyState.style.display = 'block';
      container.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      container.style.display = 'flex';
      filteredTasks.forEach(task => {
        container.appendChild(this.renderTask(task));
      });
    }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  }

  loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark-mode');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    this.updateThemeIcon();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark-mode');
    }
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    const isDark = document.documentElement.classList.contains('dark-mode');
    document.getElementById('themeToggle').innerHTML = `<span class="icon">${isDark ? '☀️' : '🌙'}</span>`;
  }

  exportTasks() {
    const dataStr = JSON.stringify(this.tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) {
          alert('Invalid file format. Please import a valid JSON file.');
          return;
        }
        if (confirm(`Import ${imported.length} task(s)? Existing tasks will not be replaced.`)) {
          this.tasks.push(...imported);
          this.save();
          this.render();
          alert(`Successfully imported ${imported.length} task(s)`);
        }
      } catch (error) {
        alert('Error importing tasks: ' + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.taskManager = new TaskManager();
});
