class TodoApp {
    constructor() {
        this.todos = [];
        this.currentDate = new Date();
        this.editingTodo = null;
        this.checkInterval = null;
        this.autoCheckEnabled = false;
        this.activeColorFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadTodos();
        this.loadAutoCheckSetting();
        this.setupEventListeners();
        this.setInitialState();
        this.renderTodos();
        this.renderCalendar();
        this.checkDueTodos(); // Only check for newly due todos when popup opens
        this.updatePeriodicCheck();
    }

    setInitialState() {
        // Ensure todo form is hidden
        document.getElementById('todoForm').classList.add('hidden');
        
        // Ensure todo view is active by default
        this.switchTab('todo');
    }

    loadAutoCheckSetting() {
        // Load auto check setting from localStorage (default: false)
        const saved = localStorage.getItem('autoCheckEnabled');
        this.autoCheckEnabled = saved === 'true';
        
        // Update checkbox state
        const checkbox = document.getElementById('autoCheckEnabled');
        if (checkbox) {
            checkbox.checked = this.autoCheckEnabled;
        }
    }

    saveAutoCheckSetting() {
        localStorage.setItem('autoCheckEnabled', this.autoCheckEnabled.toString());
    }

    setupEventListeners() {
        // Tab switching
        document.getElementById('todoTab').addEventListener('click', () => this.switchTab('todo'));
        document.getElementById('calendarTab').addEventListener('click', () => this.switchTab('calendar'));
        
        // Header buttons
        document.getElementById('calendarBtn').addEventListener('click', () => this.switchTab('calendar'));
        document.getElementById('addBtn').addEventListener('click', () => this.showTodoForm());
        
        // Todo form
        document.getElementById('saveTodo').addEventListener('click', () => this.saveTodo());
        document.getElementById('cancelTodo').addEventListener('click', () => this.hideTodoForm());

        // Calendar navigation
        document.getElementById('prevMonth').addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.navigateMonth(1));

        // Form validation
        document.getElementById('todoText').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveTodo();
        });

        // Auto check toggle
        document.getElementById('autoCheckEnabled').addEventListener('change', (e) => {
            this.autoCheckEnabled = e.target.checked;
            this.saveAutoCheckSetting();
            this.updatePeriodicCheck();
        });

        // Todo actions (edit/delete) with event delegation
        document.getElementById('todoList').addEventListener('click', (e) => {
            const button = e.target.closest('button[data-action]');
            if (!button) return;

            const action = button.dataset.action;
            
            if (action === 'delete') {
                const todoId = parseInt(button.dataset.todoId);
                this.deleteTodo(todoId);
            } else if (action === 'edit') {
                const todoData = JSON.parse(button.dataset.todo);
                this.showTodoForm(todoData);
            }
        });

        // Checkbox toggle with event delegation
        document.getElementById('todoList').addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.classList.contains('todo-checkbox')) {
                const todoItem = e.target.closest('.todo-item');
                if (todoItem) {
                    const actionBtn = todoItem.querySelector('[data-todo-id]');
                    if (actionBtn) {
                        const todoId = parseInt(actionBtn.dataset.todoId);
                        this.toggleTodo(todoId);
                    }
                }
            }
        });

        // Color filter buttons
        document.getElementById('colorFilters').addEventListener('click', (e) => {
            const filterBtn = e.target.closest('.filter-option');
            if (!filterBtn) return;

            const selectedColor = filterBtn.dataset.color;
            this.setColorFilter(selectedColor);
        });
    }

    switchTab(tab) {
        const todoTab = document.getElementById('todoTab');
        const calendarTab = document.getElementById('calendarTab');
        const todoView = document.getElementById('todoView');
        const calendarView = document.getElementById('calendarView');

        if (tab === 'todo') {
            todoTab.className = 'tab active';
            calendarTab.className = 'tab';
            todoView.classList.remove('hidden');
            calendarView.classList.add('hidden');
        } else {
            calendarTab.className = 'tab active';
            todoTab.className = 'tab';
            calendarView.classList.remove('hidden');
            todoView.classList.add('hidden');
            this.renderCalendar();
        }
    }

    setColorFilter(color) {
        this.activeColorFilter = color;
        
        // Update active filter button
        document.querySelectorAll('.filter-option').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-color="${color}"]`).classList.add('active');
        
        // Re-render todos and calendar with filter
        this.renderTodos();
        this.renderCalendar();
    }

    getFilteredTodos() {
        if (this.activeColorFilter === 'all') {
            return this.todos;
        }
        return this.todos.filter(todo => todo.color === this.activeColorFilter);
    }

    async loadTodos() {
        // Try chrome.storage first, fallback to localStorage
        try {
            const result = await chrome.storage.local.get('todos');
            if (result.todos) {
                this.todos = JSON.parse(result.todos);
            } else {
                const saved = localStorage.getItem('todos');
                this.todos = saved ? JSON.parse(saved) : [];
                if (this.todos.length > 0) {
                    // Migrate to chrome.storage
                    await chrome.storage.local.set({ todos: JSON.stringify(this.todos) });
                }
            }
        } catch (error) {
            const saved = localStorage.getItem('todos');
            this.todos = saved ? JSON.parse(saved) : [];
        }
        
        // Migrate old todos: add color if missing, remove priority
        let needsSave = false;
        this.todos = this.todos.map(todo => {
            const updated = { ...todo };
            
            // Add color if missing
            if (!updated.color) {
                updated.color = 'green'; // Default color
                needsSave = true;
            }
            
            // Remove old priority field if exists
            if (updated.priority) {
                delete updated.priority;
                needsSave = true;
            }
            
            return updated;
        });
        
        if (needsSave) {
            await this.saveTodos();
        }
    }

    async saveTodos() {
        // Save to both localStorage and chrome.storage
        const todosJson = JSON.stringify(this.todos);
        localStorage.setItem('todos', todosJson);
        try {
            await chrome.storage.local.set({ todos: todosJson });
        } catch (error) {
            console.log('Chrome storage not available, using localStorage only');
        }
    }

    showTodoForm(todo = null) {
        this.editingTodo = todo;
        const form = document.getElementById('todoForm');
        const textInput = document.getElementById('todoText');
        const dateInput = document.getElementById('todoDate');
        const endDateInput = document.getElementById('todoEndDate');

        if (todo) {
            textInput.value = todo.text;
            dateInput.value = todo.date || '';
            endDateInput.value = todo.endDate || '';
            
            // Set color selection
            const colorRadio = document.querySelector(`input[name="todoColor"][value="${todo.color || 'green'}"]`);
            if (colorRadio) {
                colorRadio.checked = true;
            }
        } else {
            textInput.value = '';
            dateInput.value = '';
            endDateInput.value = '';
            
            // Default to green color
            const defaultColorRadio = document.querySelector('input[name="todoColor"][value="green"]');
            if (defaultColorRadio) {
                defaultColorRadio.checked = true;
            }
        }

        form.classList.remove('hidden');
        textInput.focus();
    }

    hideTodoForm() {
        document.getElementById('todoForm').classList.add('hidden');
        this.editingTodo = null;
    }

    async saveTodo() {
        const text = document.getElementById('todoText').value.trim();
        const date = document.getElementById('todoDate').value;
        const endDate = document.getElementById('todoEndDate').value;
        const selectedColor = document.querySelector('input[name="todoColor"]:checked');
        const color = selectedColor ? selectedColor.value : 'green';

        if (!text) {
            alert('Görev metni gerekli!');
            return;
        }

        // Validate date range
        if (date && endDate && new Date(date) > new Date(endDate)) {
            alert('Başlangıç tarihi bitiş tarihinden sonra olamaz!');
            return;
        }

        const todo = {
            id: this.editingTodo ? this.editingTodo.id : Date.now(),
            text,
            date,
            endDate,
            color,
            completed: this.editingTodo ? this.editingTodo.completed : false,
            createdAt: this.editingTodo ? this.editingTodo.createdAt : new Date().toISOString(),
            alerted: this.editingTodo ? this.editingTodo.alerted : false
        };

        // If date changed, reset alerted status
        if (this.editingTodo && (this.editingTodo.date !== date || this.editingTodo.endDate !== endDate)) {
            todo.alerted = false;
        }

        if (this.editingTodo) {
            const index = this.todos.findIndex(t => t.id === this.editingTodo.id);
            this.todos[index] = todo;
        } else {
            this.todos.push(todo);
        }

        await this.saveTodos();
        this.renderTodos();
        this.hideTodoForm();
        this.renderCalendar();

        // Set reminder if date is set
        if (date) {
            this.setReminder(todo);
        }
        
        // If adding a new todo with a different color, switch filter to show it
        if (!this.editingTodo && this.activeColorFilter !== 'all' && color !== this.activeColorFilter) {
            setTimeout(() => {
                this.setColorFilter(color);
            }, 100);
        }
    }

    async deleteTodo(id) {
        if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            await this.saveTodos();
            this.renderTodos();
            this.renderCalendar();
        }
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            // Reset alerted status when toggling completion
            if (!todo.completed) {
                todo.alerted = false;
            }
            await this.saveTodos();
            this.renderTodos();
        }
    }

    renderTodos() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            todoList.innerHTML = '';
            emptyState.classList.remove('hidden');
            
            // Update empty state message based on filter
            const emptyMessage = emptyState.querySelector('p');
            if (this.activeColorFilter === 'all') {
                emptyMessage.textContent = 'Henüz görev eklenmemiş';
            } else {
                emptyMessage.textContent = `Bu renkte görev bulunamadı`;
            }
            return;
        }

        emptyState.classList.add('hidden');

        // Sort todos by date and creation time
        const sortedTodos = [...filteredTodos].sort((a, b) => {
            // First sort by completion status (incomplete first)
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            
            // Then sort by date (earliest first)
            if (a.date && b.date) {
                return new Date(a.date) - new Date(b.date);
            }
            if (a.date && !b.date) return -1;
            if (!a.date && b.date) return 1;
            
            // Finally sort by creation time (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        todoList.innerHTML = sortedTodos.map(todo => {
            // Check overdue status - use endDate if available, otherwise use date
            const checkDate = todo.endDate || todo.date;
            const isOverdue = checkDate && new Date(checkDate) < new Date() && !todo.completed;

            return `
                <div class="todo-item color-${todo.color || 'green'} ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}">
                    <div class="todo-content">
                        <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                               class="todo-checkbox">
                        <div class="todo-details">
                            <div class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</div>
                            <div class="todo-meta">
                                <span class="color-badge ${todo.color || 'green'}"></span>
                                ${todo.date ? `
                                    <span class="todo-date ${isOverdue ? 'overdue' : ''}">
                                        <i class="fas fa-clock"></i>
                                        ${new Date(todo.date).toLocaleDateString('tr-TR', { 
                                            day: '2-digit', 
                                            month: '2-digit', 
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        ${todo.endDate ? ` - ${new Date(todo.endDate).toLocaleDateString('tr-TR', { 
                                            day: '2-digit', 
                                            month: '2-digit', 
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}` : ''}
                                    </span>
                                ` : ''}
                                ${isOverdue ? '<span class="overdue-label">Gecikmiş!</span>' : ''}
                            </div>
                        </div>
                        <div class="todo-actions">
                            <button data-action="edit" data-todo='${JSON.stringify(todo)}' 
                                    class="action-btn edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button data-action="delete" data-todo-id="${todo.id}" 
                                    class="action-btn delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        const monthElement = document.getElementById('currentMonth');
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const monthNames = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        
        monthElement.textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const days = [];
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push(date);
        }
        
        grid.innerHTML = days.map(date => {
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === new Date().toDateString();
            const todosForDay = this.getTodosForDate(date);
            
            return `
                <div class="calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}">
                    <div>${date.getDate()}</div>
                    ${todosForDay.length > 0 ? `
                        <div class="todo-dots">
                            ${todosForDay.slice(0, 3).map(todo => `
                                <div class="todo-dot color-${todo.color || 'green'}"></div>
                            `).join('')}
                            ${todosForDay.length > 3 ? '<span>+</span>' : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    getTodosForDate(date) {
        const targetDate = new Date(date);
        const filteredTodos = this.getFilteredTodos();
        
        return filteredTodos.filter(todo => {
            if (!todo.date) return false;
            
            const startDate = new Date(todo.date);
            
            // If no end date, check if it's the same day as start date
            if (!todo.endDate) {
                return startDate.toDateString() === targetDate.toDateString();
            }
            
            // If end date exists, check if target date is within range
            const endDate = new Date(todo.endDate);
            
            // Set time to start of day for accurate comparison
            const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
            const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            
            return targetDay >= startDay && targetDay <= endDay;
        });
    }

    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    setReminder(todo) {
        if (!todo.date) return;
        
        const reminderTime = new Date(todo.date).getTime();
        const now = Date.now();
        
        if (reminderTime > now) {
            // Set alarm for the reminder
            chrome.alarms.create(`todo-${todo.id}`, {
                when: reminderTime
            });
        }
    }



    updatePeriodicCheck() {
        // Stop existing interval
        this.stopPeriodicCheck();
        
        if (this.autoCheckEnabled) {
            // Start 30-second interval if enabled
            this.checkInterval = setInterval(() => {
                this.checkDueTodos();
            }, 30000); // 30 seconds
        }

        // Always check when visibility changes (tab focus)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkDueTodos();
            }
        });
    }

    stopPeriodicCheck() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    checkDueTodos() {
        // Light check for popup - only for just due todos
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        
        // Find todos that just became due (within last 5 minutes)
        const newlyDueTodos = this.todos.filter(todo => {
            if (!todo.date || todo.completed || todo.alerted) return false;
            const todoDate = new Date(todo.date);
            return todoDate >= fiveMinutesAgo && todoDate <= now;
        });

        if (newlyDueTodos.length > 0) {
            // Mark as alerted to prevent repeated alerts
            newlyDueTodos.forEach(todo => {
                todo.alerted = true;
            });
            this.saveTodos();

            // Show alert with date range info
            setTimeout(() => {
                alert(`🔔 GÖREV ZAMANI! 🔔\n\n${newlyDueTodos.map(todo => {
                    const startTime = new Date(todo.date).toLocaleDateString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    const endTime = todo.endDate ? new Date(todo.endDate).toLocaleDateString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : null;
                    
                    return `• ${todo.text}\n  📅 ${startTime}${endTime ? ` - ${endTime}` : ''}`;
                }).join('\n\n')}\n\nGörevlerinizin zamanı geldi!`);
            }, 100);

            this.renderTodos(); // Refresh display
        }
    }

    destroy() {
        this.stopPeriodicCheck();
    }
}

// Initialize app
const app = new TodoApp();

// Cleanup on popup close
window.addEventListener('beforeunload', () => {
    if (app) {
        app.destroy();
    }
}); 