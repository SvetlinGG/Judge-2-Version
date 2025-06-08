document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', newTheme);
    });

    // Task selection functionality
    const taskItems = document.querySelectorAll('.task-item');
    const solutionCode = document.getElementById('solutionCode');

    taskItems.forEach(task => {
        task.addEventListener('click', () => {
            // Remove active class from all tasks
            taskItems.forEach(t => t.classList.remove('active'));
            // Add active class to selected task
            task.classList.add('active');

            // Update textarea placeholder based on selected task
            const taskId = task.getAttribute('data-task');
            switch(taskId) {
                case 'task1':
                    solutionCode.placeholder = `Example:
function sayHello() {
    return "Hello, World!";
}`;
                    break;
                case 'task2':
                    solutionCode.placeholder = `Example:
function sum(a, b) {
    return a + b;
}`;
                    break;
                case 'task3':
                    solutionCode.placeholder = `Example:
function isPalindrome(str) {
    return str === str.split('').reverse().join('');
}`;
                    break;
            }
        });
    });

    // Form submission handling
    const submissionForm = document.getElementById('submissionForm');
    const resultContent = document.getElementById('resultContent');

    submissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const activeTask = document.querySelector('.task-item.active');
        if (!activeTask) {
            resultContent.innerHTML = '<p class="error">Please select a task first!</p>';
            return;
        }

        const code = solutionCode.value;
        const taskId = activeTask.getAttribute('data-task');
        
        // Here you would typically send the code to your backend for evaluation
        // For now, we'll just show a placeholder message
        resultContent.innerHTML = `
            <p>Task: ${activeTask.querySelector('h3').textContent}</p>
            <p>Code submitted successfully!</p>
            <pre><code>${code}</code></pre>
        `;
    });
}); 