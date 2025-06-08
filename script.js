document.addEventListener('DOMContentLoaded', () => {
    // Clock functionality
    function updateClock() {
        const now = new Date();
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('current-date');
        
        // Update time
        timeElement.textContent = now.toLocaleTimeString();
        
        // Update date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString(undefined, options);
    }
    
    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);

    // Timer functionality
    let timerInterval;
    let startTime;
    let elapsedTime = 0;
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('startTimer');
    const stopButton = document.getElementById('stopTimer');
    const resetButton = document.getElementById('resetTimer');
    let isRunning = false;

    function updateTimer() {
        const now = Date.now();
        elapsedTime = now - startTime;
        const time = new Date(elapsedTime);
        const hours = time.getUTCHours().toString().padStart(2, '0');
        const minutes = time.getUTCMinutes().toString().padStart(2, '0');
        const seconds = time.getUTCSeconds().toString().padStart(2, '0');
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    startButton.addEventListener('click', () => {
        if (!isRunning) {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(updateTimer, 10);
            startButton.textContent = 'Pause';
            isRunning = true;
        } else {
            clearInterval(timerInterval);
            startButton.textContent = 'Start';
            isRunning = false;
        }
    });

    stopButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        startButton.textContent = 'Start';
        isRunning = false;
    });

    resetButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        elapsedTime = 0;
        timerDisplay.textContent = '00:00:00';
        startButton.textContent = 'Start';
        isRunning = false;
    });

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

    // Test cases for each task
    const testCases = {
        task1: [
            { input: [], expected: "Hello, World!", description: "Basic hello world test" },
            { input: [], expected: "Hello, World!", description: "Case sensitivity test" }
        ],
        task2: [
            { input: [5, 3], expected: 8, description: "Positive numbers" },
            { input: [-1, 1], expected: 0, description: "Negative and positive" },
            { input: [0, 0], expected: 0, description: "Zero values" },
            { input: [10, 20], expected: 30, description: "Larger numbers" }
        ],
        task3: [
            { input: ["radar"], expected: true, description: "Simple palindrome" },
            { input: ["hello"], expected: false, description: "Non-palindrome" },
            { input: ["A man, a plan, a canal: Panama"], expected: true, description: "Complex palindrome" },
            { input: ["racecar"], expected: true, description: "Odd length palindrome" },
            { input: ["noon"], expected: true, description: "Even length palindrome" },
            { input: [""], expected: true, description: "Empty string" }
        ]
    };

    taskItems.forEach(task => {
        task.addEventListener('click', () => {
            taskItems.forEach(t => t.classList.remove('active'));
            task.classList.add('active');

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
    const coveragePercentage = document.getElementById('coveragePercentage');
    const coverageDetails = document.getElementById('coverageDetails');
    const executionTime = document.getElementById('executionTime');

    submissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const activeTask = document.querySelector('.task-item.active');
        if (!activeTask) {
            resultContent.innerHTML = '<p class="error">Please select a task first!</p>';
            return;
        }

        const code = solutionCode.value;
        const taskId = activeTask.getAttribute('data-task');
        const tests = testCases[taskId];
        
        // Measure execution time
        const startTime = performance.now();
        
        // Run tests
        let passedTests = 0;
        const results = [];
        
        try {
            const func = new Function(...getFunctionParameters(code), code);
            
            tests.forEach((test, index) => {
                const result = func(...test.input);
                const passed = result === test.expected;
                if (passed) passedTests++;
                
                results.push({
                    testNumber: index + 1,
                    description: test.description,
                    passed,
                    expected: test.expected,
                    received: result
                });
            });
        } catch (error) {
            resultContent.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            return;
        }

        const endTime = performance.now();
        const executionTimeMs = endTime - startTime;
        
        // Update coverage percentage
        const percentage = (passedTests / tests.length) * 100;
        coveragePercentage.textContent = `${percentage.toFixed(0)}%`;
        
        // Update coverage details
        coverageDetails.innerHTML = results.map(result => `
            <div class="test-result ${result.passed ? 'passed' : 'failed'}">
                Test ${result.testNumber}: ${result.description}
                ${!result.passed ? `<br>Expected: ${result.expected}, Got: ${result.received}` : ''}
            </div>
        `).join('');
        
        // Update execution time
        executionTime.textContent = `Execution time: ${executionTimeMs.toFixed(2)}ms`;
        
        // Update result content
        resultContent.innerHTML = `
            <p>Task: ${activeTask.querySelector('h3').textContent}</p>
            <p>${passedTests} out of ${tests.length} tests passed</p>
            <pre><code>${code}</code></pre>
        `;
    });

    // Helper function to extract function parameters from code
    function getFunctionParameters(code) {
        const match = code.match(/function\s+\w+\s*\(([^)]*)\)/);
        if (!match) return [];
        return match[1].split(',').map(param => param.trim()).filter(Boolean);
    }
}); 