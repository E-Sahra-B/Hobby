// Background service worker for handling reminders and notifications

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name.startsWith('todo-')) {
        const todoId = alarm.name.replace('todo-', '');
        
        // Get todo from storage
        const result = await chrome.storage.local.get('todos');
        const todos = result.todos ? JSON.parse(result.todos) : [];
        const todo = todos.find(t => t.id.toString() === todoId);
        
        if (todo && !todo.completed) {
            // Show notification
            chrome.notifications.create(`reminder-${todoId}`, {
                type: 'basic',
                iconUrl: 'icons/icon-48.png',
                title: 'Görev Hatırlatması!',
                message: `Zamanı geldi: ${todo.text}`,
                buttons: [
                    { title: 'Tamamlandı' },
                    { title: 'Daha Sonra' }
                ]
            });


        }
    }
});

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
    if (notificationId.startsWith('reminder-')) {
        const todoId = notificationId.replace('reminder-', '');
        
        if (buttonIndex === 0) { // Completed
            const result = await chrome.storage.local.get('todos');
            const todos = result.todos ? JSON.parse(result.todos) : [];
            const todoIndex = todos.findIndex(t => t.id.toString() === todoId);
            
            if (todoIndex !== -1) {
                todos[todoIndex].completed = true;
                await chrome.storage.local.set({ todos: JSON.stringify(todos) });
            }
        } else if (buttonIndex === 1) { // Snooze for 10 minutes
            const snoozeTime = Date.now() + (10 * 60 * 1000); // 10 minutes
            chrome.alarms.create(`todo-${todoId}`, {
                when: snoozeTime
            });
        }
        
        chrome.notifications.clear(notificationId);
    }
    
    // Handle startup notification clicks
    if (notificationId.startsWith('startup-')) {
        if (buttonIndex === 0) { // Open Extension
            chrome.action.openPopup();
        }
        chrome.notifications.clear(notificationId);
    }
});

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
    // Open extension popup when notification is clicked
    chrome.action.openPopup();
    chrome.notifications.clear(notificationId);
});

// Sync localStorage with chrome.storage for background access
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.todos) {
        // Sync happened, potentially update alarms
        syncAlarms();
    }
});

async function syncAlarms() {
    // Clear all existing todo alarms
    const alarms = await chrome.alarms.getAll();
    for (const alarm of alarms) {
        if (alarm.name.startsWith('todo-')) {
            chrome.alarms.clear(alarm.name);
        }
    }
    
    // Set new alarms for todos with dates
    const result = await chrome.storage.local.get('todos');
    const todos = result.todos ? JSON.parse(result.todos) : [];
    
    const now = Date.now();
    todos.forEach(todo => {
        if (todo.date && !todo.completed) {
            const reminderTime = new Date(todo.date).getTime();
            if (reminderTime > now) {
                chrome.alarms.create(`todo-${todo.id}`, {
                    when: reminderTime
                });
            }
        }
    });
}

// Initialize on startup and check for reminders
chrome.runtime.onStartup.addListener(async () => {
    syncAlarms();
    await checkStartupReminders();
});

chrome.runtime.onInstalled.addListener(async () => {
    syncAlarms();
    await checkStartupReminders();
});

// Check for reminders on browser startup
async function checkStartupReminders() {
    try {
        const result = await chrome.storage.local.get('todos');
        const todos = result.todos ? JSON.parse(result.todos) : [];
        
        if (todos.length === 0) return;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        
        // Check for overdue todos (use endDate if available, otherwise use date)
        const overdueTodos = todos.filter(todo => {
            const checkDate = todo.endDate || todo.date;
            return checkDate && 
                   new Date(checkDate) < now && 
                   !todo.completed;
        });

        // Check for today's todos (includes todos that start today or are ongoing)
        const todayTodos = todos.filter(todo => {
            if (!todo.date || todo.completed) return false;
            
            const startDate = new Date(todo.date);
            const endDate = todo.endDate ? new Date(todo.endDate) : startDate;
            
            // Check if today falls within the todo's date range
            return (startDate >= today && startDate < tomorrow) ||
                   (endDate >= today && endDate < tomorrow) ||
                   (startDate < today && endDate >= tomorrow);
        });

        // Check for todos due in next hour (using start date for alerts)
        const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
        const upcomingTodos = todos.filter(todo => {
            if (!todo.date || todo.completed) return false;
            const todoDate = new Date(todo.date);
            return todoDate > now && todoDate <= nextHour;
        });

        // Show notifications for different scenarios
        if (overdueTodos.length > 0) {
            chrome.notifications.create(`startup-overdue-${Date.now()}`, {
                type: 'basic',
                iconUrl: 'icons/icon-48.png',
                title: '⚠️ Gecikmiş Görevler!',
                message: `${overdueTodos.length} göreviniz gecikmiş durumda. Extension'ı açarak kontrol edin.`,
                buttons: [
                    { title: 'Extension\'ı Aç' },
                    { title: 'Daha Sonra' }
                ]
            });
        }
        else if (upcomingTodos.length > 0) {
            chrome.notifications.create(`startup-upcoming-${Date.now()}`, {
                type: 'basic',
                iconUrl: 'icons/icon-48.png',
                title: '🔔 Yaklaşan Görevler!',
                message: `${upcomingTodos.length} göreviniz 1 saat içinde. Hazırlık yapın!`,
                buttons: [
                    { title: 'Extension\'ı Aç' },
                    { title: 'Tamam' }
                ]
            });
        }
        else if (todayTodos.length > 2) {
            chrome.notifications.create(`startup-today-${Date.now()}`, {
                type: 'basic',
                iconUrl: 'icons/icon-48.png',
                title: '📋 Bugünkü Görevler!',
                message: `Bugün için ${todayTodos.length} göreviniz var. İyi günler!`,
                buttons: [
                    { title: 'Extension\'ı Aç' },
                    { title: 'Teşekkürler' }
                ]
            });
        }

    } catch (error) {
        console.log('Error checking startup reminders:', error);
    }
} 