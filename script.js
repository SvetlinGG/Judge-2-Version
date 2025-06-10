document.addEventListener("DOMContentLoaded", () => {
    // Initialize all required elements
    const elements = {
        submissionForm: document.getElementById("submissionForm"),
        solutionCode: document.getElementById("solutionCode"),
        resultContent: document.getElementById("resultContent"),
        coveragePercentage: document.getElementById("coveragePercentage"),
        coverageDetails: document.getElementById("coverageDetails"),
        executionTime: document.getElementById("executionTime"),
        submitButton: document.querySelector(".submit-btn"),
        taskItems: document.querySelectorAll(".task-item"),
        taskConditionsContent: document.getElementById("taskConditionsContent")
    };

    // Validate that all required elements exist
    Object.entries(elements).forEach(([key, element]) => {
        if (!element) {
            console.error(`Required element not found: ${key}`);
        }
    });

    // Clock functionality
    function updateClock() {
        const now = new Date();
        const timeElement = document.getElementById("current-time");
        const dateElement = document.getElementById("current-date");

        // Update time
        timeElement.textContent = now.toLocaleTimeString();

        // Update date
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
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
        const hours = time.getUTCHours().toString().padStart(2, "0");
        const minutes = time.getUTCMinutes().toString().padStart(2, "0");
        const seconds = time.getUTCSeconds().toString().padStart(2, "0");
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    startButton.addEventListener("click", () => {
        if (!isRunning) {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(updateTimer, 10);
            startButton.textContent = "Pause";
            isRunning = true;
        } else {
            clearInterval(timerInterval);
            startButton.textContent = "Start";
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
        timerDisplay.textContent = "00:00:00";
        startButton.textContent = "Start";
        isRunning = false;
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle.querySelector(".theme-icon");

    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
        themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";
    }

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", newTheme);
        themeIcon.textContent = newTheme === "dark" ? "☀️" : "🌙";
        localStorage.setItem("theme", newTheme);
        
        // Update syntax highlighting after theme change
        setTimeout(updateHighlighting, 0);
    });

    // Syntax highlighting functionality
    const solutionCode = document.getElementById("solutionCode");
    let highlightedCode = '';

    function highlightSyntax(code) {
        // Method names pattern (common JavaScript methods)
        const methodPattern = /\b(function|return|if|else|for|while|const|let|var)\b/g;
        
        // Replace methods with highlighted spans
        return code.replace(methodPattern, match => `<span class="method">${match}</span>`);
    }

    function updateHighlighting() {
        const code = solutionCode.value;
        highlightedCode = highlightSyntax(code);
        
        // Create a temporary div to hold the highlighted content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = highlightedCode;
        
        // Get the plain text content
        const plainText = tempDiv.textContent;
        
        // Update the textarea with plain text
        solutionCode.value = plainText;
        
        // Store the highlighted version
        solutionCode.dataset.highlighted = highlightedCode;
    }

    // Add event listeners for syntax highlighting
    solutionCode.addEventListener('input', updateHighlighting);
    solutionCode.addEventListener('focus', updateHighlighting);
    solutionCode.addEventListener('blur', updateHighlighting);

    // Initialize highlighting for any existing content
    updateHighlighting();

    // Task selection functionality
    elements.taskItems.forEach((task) => {
        task.addEventListener("click", async () => {
            // Remove active class from all tasks
            elements.taskItems.forEach((t) => t.classList.remove("active"));
            // Add active class to clicked task
            task.classList.add("active");

            const taskId = task.getAttribute("data-task");
            
            // Update code placeholder
            switch (taskId) {
                case "task1":
                    solutionCode.placeholder = `Example:
function sayHello() {
    return "Hello, World!";
}`;
                    break;
                case "task2":
                    solutionCode.placeholder = `Example:
function sum(a, b) {
    return a + b;
}`;
                    break;
                case "task3":
                    solutionCode.placeholder = `Example:
function isPalindrome(str) {
    // Convert input to lowercase and remove non-alphabet characters manually
    let cleanStr = "";
    str = String(str).toLowerCase();

    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if ((char >= "a" && char <= "z") || (char >= "0" && char <= "9")) {
            cleanStr += char;
        }
    }

    // Reverse and compare
    let reversedStr = "";
    for (let j = cleanStr.length - 1; j >= 0; j--) {
        reversedStr += cleanStr[j];
    }

    return cleanStr === reversedStr;
}`;
                    break;
                case "task4":
                    solutionCode.placeholder = `Example:
function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}`;
                    break;
                case "task5":
                    solutionCode.placeholder = `Example:
function checkWinner(board) {
    // Check rows and columns
    for (let i = 0; i < 3; i++) {
        // Row check
        if (board[i][0] !== 0 && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            return board[i][0] === 1 ? "First player won" : "Second player won";
        }

        // Column check
        if (board[0][i] !== 0 && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
            return board[0][i] === 1 ? "First player won" : "Second player won";
        }
    }

    // Diagonal (top-left to bottom-right)
    if (board[0][0] !== 0 && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[0][0] === 1 ? "First player won" : "Second player won";
    }

    // Diagonal (top-right to bottom-left)
    if (board[0][2] !== 0 && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2] === 1 ? "First player won" : "Second player won";
    }

    // No winner
    return "Draw!";
}`;
                    break;
                case "task6":
                    solutionCode.placeholder = `Example:
function largestNumber(n) {
    // Convert number to string, remove negative sign if present
    const isNegative = n < 0;
    let sortedDigits = Math.abs(n)
        .toString()
        .split('')
        .sort((a, b) => b - a)
        .join('');
    
    // Return number, preserving negative sign if needed
    return isNegative ? -parseInt(sortedDigits) : parseInt(sortedDigits);
}`;
                    break;
                case "task7":
                    solutionCode.placeholder = `Example:
function processInput(type, input) {
    if (type === "int") {
        return parseInt(input, 10) * 2;
    } else if (type === "real") {
        return parseFloat((parseFloat(input) * 1.5).toFixed(2));
    } else if (type === "string") {
        return "$" + input + "$"; // Updated formatting
    } else {
        return "Invalid type";
    }
}`;
                    break;
            }

            // Load and display task conditions
            try {
                const response = await fetch(`task-conditions/${taskId}.md`);
                if (response.ok) {
                    const content = await response.text();
                    // Convert markdown to HTML with better formatting
                    const htmlContent = content
                        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
                        .replace(/`(.*?)`/g, '<code>$1</code>')
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/\n/g, '<br>');
                    
                    elements.taskConditionsContent.innerHTML = `<p>${htmlContent}</p>`;
                } else {
                    elements.taskConditionsContent.innerHTML = `
                        <div class="task-conditions-placeholder">
                            <h3>${task.querySelector('h3').textContent}</h3>
                            <p>${task.querySelector('p').textContent}</p>
                            <p class="note">Detailed conditions will be available soon.</p>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Error loading task conditions:', error);
                elements.taskConditionsContent.innerHTML = `
                    <div class="task-conditions-error">
                        <p>Error loading task conditions. Please try again later.</p>
                    </div>
                `;
            }
        });
    });

    // Form submission handling
    const submissionForm = document.getElementById("submissionForm");
    const resultContent = document.getElementById("resultContent");
    const coveragePercentage = document.getElementById("coveragePercentage");
    const coverageDetails = document.getElementById("coverageDetails");
    const executionTime = document.getElementById("executionTime");

    submissionForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearResults();

        const activeTask = document.querySelector(".task-item.active");
        if (!activeTask) {
            alert("Please select a task first!");
            return;
        }

        const code = solutionCode.value.trim();
        if (!code) {
            alert("Please enter your solution code!");
            return;
        }

        const taskId = activeTask.getAttribute("data-task");
        const tests = testCases[taskId];

        // Show loading state
        const submitButton = submissionForm.querySelector('.submit-btn');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Testing...';
        submitButton.disabled = true;

        try {
            // Measure execution time
            const startTime = performance.now();

            // Run tests
            let passedTests = 0;
            const results = [];

            // Dynamically create a function
            let match = code.match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/);
            const functionName = match ? match[1] : null;

            if (!functionName) {
                throw new Error("No valid function found in your code. Please include a function definition.");
            }

            const params = getFunctionParameters(code);
            const func = new Function(...params, `${code}; return ${functionName}(${params.join(",")});`);

            // Run each test case
            tests.forEach((test, index) => {
                try {
                    let result;
                    const input = test.input;

                    if (typeof input === "string") {
                        result = func(input);
                    } else if (Array.isArray(input)) {
                        result = func(...input);
                    } else {
                        result = func(input);
                    }

                    const passed = result === test.expected;
                    if (passed) passedTests++;

                    results.push({
                        testNumber: index + 1,
                        description: test.description,
                        passed,
                        expected: test.expected,
                        received: result,
                    });
                } catch (error) {
                    results.push({
                        testNumber: index + 1,
                        description: test.description,
                        passed: false,
                        expected: test.expected,
                        received: `Error: ${error.message}`,
                    });
                }
            });

            // Update results display
            resultContent.innerHTML = `
                <div class="test-progress-container">
                    <div class="test-stats">
                        <span>Tests Passed: <span class="test-stats-value">${passedTests}/${tests.length}</span></span>
                        <span>Coverage: <span class="test-stats-value">${((passedTests / tests.length) * 100).toFixed(0)}%</span></span>
                    </div>
                    <div class="test-progress-bar">
                        <div class="test-progress-fill" style="width: ${(passedTests / tests.length) * 100}%"></div>
                    </div>
                    <div class="test-results-summary">
                        <h4>Test Results</h4>
                        <div class="test-results-list">
                            ${results.map(result => `
                                <div class="test-result-item ${result.passed ? 'passed' : 'failed'}">
                                    <div class="test-result-icon"></div>
                                    <div class="test-result-text">
                                        <div class="test-description">${result.description}</div>
                                        ${!result.passed ? `
                                            <div class="test-details">
                                                <div class="test-expected">
                                                    <strong>Expected:</strong> ${JSON.stringify(result.expected)}
                                                </div>
                                                <div class="test-received">
                                                    <strong>Received:</strong> ${JSON.stringify(result.received)}
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            // Update coverage percentage display
            coveragePercentage.textContent = `${((passedTests / tests.length) * 100).toFixed(0)}%`;
            coveragePercentage.classList.add('updated');
            setTimeout(() => {
                coveragePercentage.classList.remove('updated');
            }, 500);

            // Update coverage details
            coverageDetails.innerHTML = results
                .map(
                    (result) => `
                        <div class="test-result ${result.passed ? "passed" : "failed"}">
                            Test ${result.testNumber}: ${result.description}
                            ${!result.passed
                                ? `<br>Expected: ${JSON.stringify(result.expected)}, Got: ${JSON.stringify(result.received)}`
                                : ""
                            }
                        </div>
                    `
                )
                .join("");

            // Measure execution time
            const endTime = performance.now();
            const executionTimeMs = endTime - startTime;
            executionTime.textContent = `Execution time: ${executionTimeMs.toFixed(2)}ms`;

        } catch (error) {
            resultContent.innerHTML = `
                <div class="error-message">
                    <h4>Error in your solution:</h4>
                    <p>${error.message}</p>
                </div>
            `;
        } finally {
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });

    function clearResults() {
        if (elements.resultContent) elements.resultContent.innerHTML = '';
        if (elements.coveragePercentage) elements.coveragePercentage.textContent = '0%';
        if (elements.coverageDetails) elements.coverageDetails.innerHTML = '';
        if (elements.executionTime) elements.executionTime.textContent = '';
    }

    function getFunctionParameters(code) {
        const match = code.match(/function\s+\w+\s*\(([^)]*)\)/);
        if (!match) return [];
        return match[1]
            .split(",")
            .map((param) => param.trim())
            .filter(Boolean);
    }

    // Initialize the first task
    if (elements.taskItems.length > 0) {
        elements.taskItems[0].click();
    }
});
