// Initialize current date
let currentDate = new Date().toISOString().split('T')[0];

// Load tasks and set current date when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('dateInput').value = currentDate;
    loadTasks();
    updateHistory();
});

// Function to set today's date
function setToday() {
    currentDate = new Date().toISOString().split('T')[0];
    document.getElementById('dateInput').value = currentDate;
    loadTasks();
}

// Function to change date
function changeDate() {
    currentDate = document.getElementById('dateInput').value;
    loadTasks();
}

// Function to add a new task
function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText === '') return;
    
    const taskList = document.getElementById('taskList');
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    
    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.onclick = function() {
        taskItem.classList.toggle('completed');
        saveTasks();
    };
    
    // Create task text
    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = taskText;
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function() {
        taskItem.remove();
        saveTasks();
    };
    
    // Add elements to task item
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskTextSpan);
    taskItem.appendChild(deleteBtn);
    
    // Add task to list
    taskList.appendChild(taskItem);
    
    // Clear input
    input.value = '';
    
    // Save tasks
    saveTasks();
}

// Function to save tasks to localStorage
function saveTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = [];
    
    taskList.querySelectorAll('.task-item').forEach(task => {
        tasks.push({
            text: task.querySelector('span').textContent,
            completed: task.classList.contains('completed')
        });
    });
    
    // Get all saved tasks
    const allTasks = JSON.parse(localStorage.getItem('allTasks')) || {};
    // Update tasks for current date
    allTasks[currentDate] = tasks;
    // Save back to localStorage
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
    
    // Update history
    updateHistory();
}

// Function to load tasks from localStorage
function loadTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear current tasks
    
    const allTasks = JSON.parse(localStorage.getItem('allTasks')) || {};
    const tasks = allTasks[currentDate] || [];
    
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onclick = function() {
            taskItem.classList.toggle('completed');
            saveTasks();
        };
        
        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() {
            taskItem.remove();
            saveTasks();
        };
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskTextSpan);
        taskItem.appendChild(deleteBtn);
        
        taskList.appendChild(taskItem);
    });
}

// Function to update history section
function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    const allTasks = JSON.parse(localStorage.getItem('allTasks')) || {};
    const dates = Object.keys(allTasks).sort().reverse();
    
    dates.forEach(date => {
        if (date === currentDate) return; // Skip current date
        
        const tasks = allTasks[date];
        if (tasks.length === 0) return; // Skip empty dates
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const historyDate = document.createElement('div');
        historyDate.className = 'history-date';
        historyDate.textContent = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const historyTasks = document.createElement('div');
        historyTasks.className = 'history-tasks';
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.textContent = `${task.completed ? '✓' : '○'} ${task.text}`;
            taskElement.style.textDecoration = task.completed ? 'line-through' : 'none';
            taskElement.style.color = task.completed ? '#666' : '#ffffff';
            historyTasks.appendChild(taskElement);
        });
        
        historyItem.appendChild(historyDate);
        historyItem.appendChild(historyTasks);
        historyList.appendChild(historyItem);
    });
} 