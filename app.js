/**
 * TaskFlow - Next.js & Express.js Task Management Application
 * 
 * This application demonstrates key concepts from both Next.js and Express.js:
 * 
 * Next.js Patterns Demonstrated:
 * - Component-based architecture
 * - State management with hooks-like patterns
 * - Event handling and form management
 * - Conditional rendering
 * - API integration patterns
 * 
 * Express.js Patterns Simulated:
 * - RESTful API structure
 * - Middleware-like functions
 * - Request/response handling
 * - Error handling patterns
 * - CORS simulation
 */

class TaskFlowApp {
    constructor() {
        // Application state (simulating Next.js state management)
        this.state = {
            tasks: [],
            filteredTasks: [],
            loading: true,
            currentTask: null,
            filters: {
                search: '',
                status: '',
                priority: '',
                sortBy: 'createdAt'
            },
            theme: 'light'
        };

        // Initialize the application
        this.init();
    }

    /**
     * Initialize the application (similar to Next.js _app.js)
     */
    async init() {
        this.applyTheme();
        this.bindEvents();
        await this.loadTasks();
    }

    /**
     * Simulated Express.js API Layer
     * These methods simulate how Express.js would handle HTTP requests
     */
    
    // Middleware simulation for logging requests
    logRequest(method, endpoint, data = null) {
        console.log(`[API] ${method} ${endpoint}`, data ? { body: data } : '');
    }

    // Middleware simulation for request validation
    validateRequest(data, requiredFields) {
        const errors = [];
        requiredFields.forEach(field => {
            if (!data[field] || data[field].toString().trim() === '') {
                errors.push(`${field} is required`);
            }
        });
        
        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.join(', ')}`);
        }
    }

    // Simulated Express.js route: GET /api/tasks
    async apiGetTasks() {
        this.logRequest('GET', '/api/tasks');
        
        try {
            // Simulate network delay
            await this.delay(800);
            
            // Simulate CORS headers
            const corsHeaders = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type'
            };
            
            return {
                status: 200,
                headers: corsHeaders,
                data: this.state.tasks
            };
        } catch (error) {
            return {
                status: 500,
                error: 'Internal server error'
            };
        }
    }

    // Simulated Express.js route: POST /api/tasks
    async apiCreateTask(taskData) {
        this.logRequest('POST', '/api/tasks', taskData);
        
        try {
            // Request validation middleware
            this.validateRequest(taskData, ['title', 'priority', 'dueDate', 'status']);
            
            // Simulate network delay
            await this.delay(300);
            
            const newTask = {
                id: Date.now().toString(),
                title: taskData.title,
                description: taskData.description || '',
                status: taskData.status,
                priority: taskData.priority,
                dueDate: taskData.dueDate,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            this.state.tasks.push(newTask);
            
            return {
                status: 201,
                data: newTask,
                message: 'Task created successfully'
            };
        } catch (error) {
            return {
                status: 400,
                error: error.message
            };
        }
    }

    // Simulated Express.js route: PUT /api/tasks/:id
    async apiUpdateTask(taskId, taskData) {
        this.logRequest('PUT', `/api/tasks/${taskId}`, taskData);
        
        try {
            // Request validation middleware
            this.validateRequest(taskData, ['title', 'priority', 'dueDate', 'status']);
            
            // Simulate network delay
            await this.delay(300);
            
            const taskIndex = this.state.tasks.findIndex(task => task.id === taskId);
            if (taskIndex === -1) {
                return {
                    status: 404,
                    error: 'Task not found'
                };
            }
            
            this.state.tasks[taskIndex] = {
                ...this.state.tasks[taskIndex],
                ...taskData,
                updatedAt: new Date().toISOString()
            };
            
            return {
                status: 200,
                data: this.state.tasks[taskIndex],
                message: 'Task updated successfully'
            };
        } catch (error) {
            return {
                status: 400,
                error: error.message
            };
        }
    }

    // Simulated Express.js route: DELETE /api/tasks/:id
    async apiDeleteTask(taskId) {
        this.logRequest('DELETE', `/api/tasks/${taskId}`);
        
        try {
            // Simulate network delay
            await this.delay(200);
            
            const taskIndex = this.state.tasks.findIndex(task => task.id === taskId);
            if (taskIndex === -1) {
                return {
                    status: 404,
                    error: 'Task not found'
                };
            }
            
            this.state.tasks.splice(taskIndex, 1);
            
            return {
                status: 200,
                message: 'Task deleted successfully'
            };
        } catch (error) {
            return {
                status: 500,
                error: 'Failed to delete task'
            };
        }
    }

    /**
     * Next.js-like Component Methods
     */

    // Component: Task Item (similar to Next.js component)
    renderTaskItem(task) {
        const priorityClass = `priority-badge priority-badge--${task.priority}`;
        const statusClass = `status-badge status-badge--${task.status}`;
        const taskClass = task.status === 'completed' ? 'task-item task-item--completed' : 'task-item';
        
        const dueDate = new Date(task.dueDate).toLocaleDateString();
        const createdDate = new Date(task.createdAt).toLocaleDateString();
        
        return `
            <div class="${taskClass}" data-task-id="${task.id}">
                <div class="task-item__header">
                    <h3 class="task-item__title">${this.escapeHtml(task.title)}</h3>
                    <div class="task-item__actions">
                        <button class="action-btn action-btn--success" onclick="app.toggleTaskStatus('${task.id}')" title="Toggle Status">
                            ${task.status === 'completed' ? '↺' : '✓'}
                        </button>
                        <button class="action-btn" onclick="app.editTask('${task.id}')" title="Edit Task">
                            ✏️
                        </button>
                        <button class="action-btn action-btn--danger" onclick="app.confirmDeleteTask('${task.id}')" title="Delete Task">
                            🗑️
                        </button>
                    </div>
                </div>
                ${task.description ? `<div class="task-item__description">${this.escapeHtml(task.description)}</div>` : ''}
                <div class="task-item__meta">
                    <div class="task-item__badges">
                        <span class="${priorityClass}">${task.priority}</span>
                        <span class="${statusClass}">${task.status.replace('-', ' ')}</span>
                    </div>
                    <div class="task-item__dates">
                        <div>Due: ${dueDate}</div>
                        <div>Created: ${createdDate}</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * State Management (Next.js hooks simulation)
     */
    
    async loadTasks() {
        console.log('Loading tasks...');
        this.setState({ loading: true });
        
        try {
            // Load sample data immediately
            this.state.tasks = this.getSampleTasks();
            console.log('Sample tasks loaded:', this.state.tasks.length);
            
            // Apply initial filters and render
            this.applyFilters();
            this.updateStats();
            
            // Simulate API call
            const response = await this.apiGetTasks();
            console.log('API response:', response);
            
            if (response.status === 200) {
                // Tasks already loaded, just show success
                this.showToast('success', 'Tasks loaded successfully');
            } else {
                this.showToast('error', 'Failed to load tasks from API');
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showToast('error', 'Failed to load tasks');
        } finally {
            this.setState({ loading: false });
            this.renderTasks();
            console.log('Loading completed, rendering tasks');
        }
    }

    async createTask(taskData) {
        try {
            const response = await this.apiCreateTask(taskData);
            
            if (response.status === 201) {
                this.applyFilters();
                this.updateStats();
                this.renderTasks();
                this.showToast('success', 'Task created successfully');
                this.closeModal();
            } else {
                this.showToast('error', response.error);
            }
        } catch (error) {
            this.showToast('error', 'Failed to create task');
        }
    }

    async updateTask(taskId, taskData) {
        try {
            const response = await this.apiUpdateTask(taskId, taskData);
            
            if (response.status === 200) {
                this.applyFilters();
                this.updateStats();
                this.renderTasks();
                this.showToast('success', 'Task updated successfully');
                this.closeModal();
            } else {
                this.showToast('error', response.error);
            }
        } catch (error) {
            this.showToast('error', 'Failed to update task');
        }
    }

    async deleteTask(taskId) {
        try {
            const response = await this.apiDeleteTask(taskId);
            
            if (response.status === 200) {
                this.applyFilters();
                this.updateStats();
                this.renderTasks();
                this.showToast('success', 'Task deleted successfully');
            } else {
                this.showToast('error', response.error);
            }
        } catch (error) {
            this.showToast('error', 'Failed to delete task');
        }
    }

    setState(newState) {
        Object.assign(this.state, newState);
    }

    /**
     * Event Handlers
     */
    
    bindEvents() {
        console.log('Binding events...');
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
            console.log('Theme toggle bound');
        }
        
        // Export tasks
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportTasks();
            });
            console.log('Export button bound');
        }
        
        // Add task button
        const addTaskBtn = document.getElementById('addTaskBtn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Add task button clicked');
                this.openAddTaskModal();
            });
            console.log('Add task button bound');
        }
        
        // Search and filters
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            console.log('Search input bound');
        }
        
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => this.handleFilter('status', e.target.value));
            console.log('Status filter bound');
        }
        
        const priorityFilter = document.getElementById('priorityFilter');
        if (priorityFilter) {
            priorityFilter.addEventListener('change', (e) => this.handleFilter('priority', e.target.value));
            console.log('Priority filter bound');
        }
        
        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', (e) => this.handleSort(e.target.value));
            console.log('Sort select bound');
        }
        
        // Modal events
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        }
        
        // Confirmation modal events
        const closeConfirmModal = document.getElementById('closeConfirmModal');
        if (closeConfirmModal) {
            closeConfirmModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeConfirmModal();
            });
        }
        
        const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
        if (cancelConfirmBtn) {
            cancelConfirmBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeConfirmModal();
            });
        }
        
        // Close modals on backdrop click
        const taskModal = document.getElementById('taskModal');
        if (taskModal) {
            taskModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal__backdrop')) {
                    this.closeModal();
                }
            });
        }
        
        const confirmModal = document.getElementById('confirmModal');
        if (confirmModal) {
            confirmModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal__backdrop')) {
                    this.closeConfirmModal();
                }
            });
        }
        
        console.log('All events bound successfully');
    }

    handleSearch(searchTerm) {
        console.log('Search:', searchTerm);
        this.state.filters.search = searchTerm;
        this.applyFilters();
        this.renderTasks();
    }

    handleFilter(filterType, value) {
        console.log('Filter:', filterType, value);
        this.state.filters[filterType] = value;
        this.applyFilters();
        this.renderTasks();
    }

    handleSort(sortBy) {
        console.log('Sort by:', sortBy);
        this.state.filters.sortBy = sortBy;
        this.applyFilters();
        this.renderTasks();
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        const formData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            priority: document.getElementById('taskPriority').value,
            dueDate: document.getElementById('taskDueDate').value,
            status: document.getElementById('taskStatus').value
        };
        
        console.log('Form data:', formData);
        
        if (this.state.currentTask) {
            this.updateTask(this.state.currentTask.id, formData);
        } else {
            this.createTask(formData);
        }
    }

    /**
     * Task Operations
     */
    
    async toggleTaskStatus(taskId) {
        console.log('Toggle task status:', taskId);
        const task = this.state.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        await this.updateTask(taskId, { ...task, status: newStatus });
    }

    editTask(taskId) {
        console.log('Edit task:', taskId);
        const task = this.state.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        this.state.currentTask = task;
        this.openEditTaskModal(task);
    }

    confirmDeleteTask(taskId) {
        console.log('Confirm delete task:', taskId);
        const task = this.state.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const confirmMessage = document.getElementById('confirmMessage');
        if (confirmMessage) {
            confirmMessage.textContent = `Are you sure you want to delete "${task.title}"?`;
        }
        
        const confirmActionBtn = document.getElementById('confirmActionBtn');
        if (confirmActionBtn) {
            confirmActionBtn.onclick = () => {
                this.deleteTask(taskId);
                this.closeConfirmModal();
            };
        }
        
        this.openConfirmModal();
    }

    /**
     * UI State Management
     */
    
    applyFilters() {
        let filtered = [...this.state.tasks];
        
        // Apply search filter
        if (this.state.filters.search) {
            const searchTerm = this.state.filters.search.toLowerCase();
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(searchTerm) ||
                task.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply status filter
        if (this.state.filters.status) {
            filtered = filtered.filter(task => task.status === this.state.filters.status);
        }
        
        // Apply priority filter
        if (this.state.filters.priority) {
            filtered = filtered.filter(task => task.priority === this.state.filters.priority);
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            const sortBy = this.state.filters.sortBy;
            
            switch (sortBy) {
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'dueDate':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'title':
                    return a.title.localeCompare(b.title);
                default: // createdAt
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
        
        this.state.filteredTasks = filtered;
        console.log('Filtered tasks:', filtered.length);
    }

    renderTasks() {
        console.log('Rendering tasks...');
        const taskList = document.getElementById('taskList');
        if (!taskList) {
            console.error('Task list element not found');
            return;
        }
        
        const loadingState = document.getElementById('loadingState');
        const emptyState = document.getElementById('emptyState');
        
        if (this.state.loading) {
            console.log('Still loading, showing loading state');
            if (loadingState) loadingState.classList.remove('hidden');
            if (emptyState) emptyState.classList.add('hidden');
            return;
        }
        
        if (loadingState) loadingState.classList.add('hidden');
        
        if (this.state.filteredTasks.length === 0) {
            console.log('No tasks to display');
            if (emptyState) emptyState.classList.remove('hidden');
            taskList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state__icon">📝</div>
                    <h3>No tasks found</h3>
                    <p>Create your first task to get started!</p>
                </div>
            `;
            return;
        }
        
        console.log('Rendering', this.state.filteredTasks.length, 'tasks');
        if (emptyState) emptyState.classList.add('hidden');
        taskList.innerHTML = this.state.filteredTasks.map(task => this.renderTaskItem(task)).join('');
    }

    updateStats() {
        const total = this.state.tasks.length;
        const pending = this.state.tasks.filter(t => t.status === 'pending').length;
        const inProgress = this.state.tasks.filter(t => t.status === 'in-progress').length;
        const completed = this.state.tasks.filter(t => t.status === 'completed').length;
        
        const totalEl = document.getElementById('totalTasks');
        const pendingEl = document.getElementById('pendingTasks');
        const inProgressEl = document.getElementById('inProgressTasks');
        const completedEl = document.getElementById('completedTasks');
        
        if (totalEl) totalEl.textContent = total;
        if (pendingEl) pendingEl.textContent = pending;
        if (inProgressEl) inProgressEl.textContent = inProgress;
        if (completedEl) completedEl.textContent = completed;
        
        console.log('Stats updated:', { total, pending, inProgress, completed });
    }

    /**
     * Modal Management
     */
    
    openAddTaskModal() {
        console.log('Opening add task modal');
        this.state.currentTask = null;
        
        const modalTitle = document.getElementById('modalTitle');
        const saveTaskBtn = document.getElementById('saveTaskBtn');
        const taskForm = document.getElementById('taskForm');
        const taskDueDate = document.getElementById('taskDueDate');
        const taskStatus = document.getElementById('taskStatus');
        
        if (modalTitle) modalTitle.textContent = 'Add New Task';
        if (saveTaskBtn) saveTaskBtn.textContent = 'Create Task';
        if (taskForm) taskForm.reset();
        if (taskStatus) taskStatus.value = 'pending';
        
        // Set minimum date to today
        if (taskDueDate) {
            const today = new Date().toISOString().split('T')[0];
            taskDueDate.min = today;
        }
        
        this.openModal();
    }

    openEditTaskModal(task) {
        console.log('Opening edit task modal for:', task.title);
        const modalTitle = document.getElementById('modalTitle');
        const saveTaskBtn = document.getElementById('saveTaskBtn');
        
        if (modalTitle) modalTitle.textContent = 'Edit Task';
        if (saveTaskBtn) saveTaskBtn.textContent = 'Update Task';
        
        // Populate form
        const taskTitle = document.getElementById('taskTitle');
        const taskDescription = document.getElementById('taskDescription');
        const taskPriority = document.getElementById('taskPriority');
        const taskDueDate = document.getElementById('taskDueDate');
        const taskStatus = document.getElementById('taskStatus');
        
        if (taskTitle) taskTitle.value = task.title;
        if (taskDescription) taskDescription.value = task.description;
        if (taskPriority) taskPriority.value = task.priority;
        if (taskDueDate) taskDueDate.value = task.dueDate;
        if (taskStatus) taskStatus.value = task.status;
        
        this.openModal();
    }

    openModal() {
        console.log('Opening modal');
        const taskModal = document.getElementById('taskModal');
        const taskTitle = document.getElementById('taskTitle');
        
        if (taskModal) {
            taskModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            console.log('Modal opened');
        }
        
        if (taskTitle) {
            setTimeout(() => taskTitle.focus(), 100);
        }
    }

    closeModal() {
        console.log('Closing modal');
        const taskModal = document.getElementById('taskModal');
        
        if (taskModal) {
            taskModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
        
        this.state.currentTask = null;
    }

    openConfirmModal() {
        console.log('Opening confirm modal');
        const confirmModal = document.getElementById('confirmModal');
        
        if (confirmModal) {
            confirmModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeConfirmModal() {
        console.log('Closing confirm modal');
        const confirmModal = document.getElementById('confirmModal');
        
        if (confirmModal) {
            confirmModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    /**
     * Utility Functions
     */
    
    toggleTheme() {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        this.state.theme = newTheme;
        this.applyTheme();
        console.log('Theme toggled to:', newTheme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.state.theme);
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = this.state.theme === 'light' ? '🌙' : '☀️';
        }
    }

    exportTasks() {
        try {
            const dataStr = JSON.stringify(this.state.tasks, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `tasks_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showToast('success', 'Tasks exported successfully');
            console.log('Tasks exported');
        } catch (error) {
            this.showToast('error', 'Failed to export tasks');
            console.error('Export error:', error);
        }
    }

    showToast(type, message, title = '') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <div class="toast__icon">${icons[type]}</div>
            <div class="toast__content">
                ${title ? `<div class="toast__title">${title}</div>` : ''}
                <div class="toast__message">${message}</div>
            </div>
            <button class="toast__close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    getSampleTasks() {
        return [
            {
                "id": "1",
                "title": "Complete Project Documentation",
                "description": "Write comprehensive documentation for the new feature implementation",
                "status": "in-progress",
                "priority": "high",
                "dueDate": "2025-08-20",
                "createdAt": "2025-08-10T10:00:00Z",
                "updatedAt": "2025-08-15T08:30:00Z"
            },
            {
                "id": "2",
                "title": "Code Review Session",
                "description": "Review pull requests from team members and provide feedback",
                "status": "pending",
                "priority": "medium",
                "dueDate": "2025-08-16",
                "createdAt": "2025-08-12T14:20:00Z",
                "updatedAt": "2025-08-12T14:20:00Z"
            },
            {
                "id": "3",
                "title": "Team Meeting Preparation",
                "description": "Prepare slides and agenda for the weekly team standup",
                "status": "completed",
                "priority": "low",
                "dueDate": "2025-08-15",
                "createdAt": "2025-08-13T09:15:00Z",
                "updatedAt": "2025-08-15T09:45:00Z"
            },
            {
                "id": "4",
                "title": "Database Migration Script",
                "description": "Create and test migration script for the new user table schema",
                "status": "pending",
                "priority": "high",
                "dueDate": "2025-08-18",
                "createdAt": "2025-08-14T16:30:00Z",
                "updatedAt": "2025-08-14T16:30:00Z"
            },
            {
                "id": "5",
                "title": "UI Component Library Update",
                "description": "Update the shared component library with new design system changes",
                "status": "in-progress",
                "priority": "medium",
                "dueDate": "2025-08-22",
                "createdAt": "2025-08-11T11:45:00Z",
                "updatedAt": "2025-08-15T10:00:00Z"
            }
        ];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    window.app = new TaskFlowApp();
});