const API_BASE = 'http://localhost:5000';
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task event
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks`);
        const data = await response.json();
        renderTasks(data.tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

async function addTask() {
    const title = taskInput.value.trim();
    if (!title) return;

    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });
        const data = await response.json();
        taskInput.value = '';
        loadTasks(); // Reload to show new task
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

async function toggleTask(id, completed) {
    try {
        await fetch(`${API_BASE}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: '', completed: completed ? 1 : 0 }),
        });
        loadTasks(); // Reload to reflect changes
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

async function deleteTask(id) {
    try {
        await fetch(`${API_BASE}/tasks/${id}`, {
            method: 'DELETE',
        });
        loadTasks(); // Reload to remove deleted task
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span class="task-text">${task.title}</span>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;

        // Add event listeners
        const checkbox = li.querySelector('.task-checkbox');
        const deleteBtn = li.querySelector('.delete-btn');

        checkbox.addEventListener('change', (e) => {
            toggleTask(task.id, e.target.checked);
        });

        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });

        taskList.appendChild(li);
    });
}