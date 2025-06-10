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
        taskItems: document.querySelectorAll(".task-item")
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
        task.addEventListener("click", () => {
            elements.taskItems.forEach((t) => t.classList.remove("active"));
            task.classList.add("active");

            const taskId = task.getAttribute("data-task");
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
        });
    });

    // Form submission handling
    if (elements.submissionForm) {
        elements.submissionForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            clearResults();

            const activeTask = document.querySelector(".task-item.active");
            if (!activeTask) {
                alert("Please select a task first!");
                return;
            }

            const code = elements.solutionCode.value.trim();
            if (!code) {
                alert("Please enter your solution code!");
                return;
            }

            const taskId = activeTask.getAttribute("data-task");
            const tests = testCases[taskId];

            // Show loading state
            elements.submitButton.textContent = 'Testing...';
            elements.submitButton.disabled = true;

            try {
                const startTime = performance.now();
                const results = runTests(code, tests);
                const endTime = performance.now();
                const executionTimeMs = endTime - startTime;

                updateResults(results, tests.length, executionTimeMs);
            } catch (error) {
                showError(error.message);
            } finally {
                elements.submitButton.textContent = 'Submit Solution';
                elements.submitButton.disabled = false;
            }
        });
    }

    function clearResults() {
        if (elements.resultContent) elements.resultContent.innerHTML = '';
        if (elements.coveragePercentage) elements.coveragePercentage.textContent = '0%';
        if (elements.coverageDetails) elements.coverageDetails.innerHTML = '';
        if (elements.executionTime) elements.executionTime.textContent = '';
    }

    function runTests(code, tests) {
        let passedTests = 0;
        const results = [];

        const match = code.match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/);
        const functionName = match ? match[1] : null;

        if (!functionName) {
            throw new Error("No valid function found in your code. Please include a function definition.");
        }

        const params = getFunctionParameters(code);
        const func = new Function(...params, `${code}; return ${functionName}(${params.join(",")});`);

        tests.forEach((test, index) => {
            try {
                const result = executeTest(func, test);
                if (result.passed) passedTests++;
                results.push(result);
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

        return { results, passedTests };
    }

    function executeTest(func, test) {
        let result;
        const input = test.input;

        if (typeof input === "string") {
            result = func(input);
        } else if (Array.isArray(input)) {
            result = func(...input);
        } else {
            result = func(input);
        }

        return {
            testNumber: test.testNumber,
            description: test.description,
            passed: result === test.expected,
            expected: test.expected,
            received: result,
        };
    }

    function updateResults(testResults, totalTests, executionTimeMs) {
        const { results, passedTests } = testResults;
        const coverage = (passedTests / totalTests) * 100;

        if (elements.resultContent) {
            elements.resultContent.innerHTML = `
                <div class="test-progress-container">
                    <div class="test-stats">
                        <span>Tests Passed: <span class="test-stats-value">${passedTests}/${totalTests}</span></span>
                        <span>Coverage: <span class="test-stats-value">${coverage.toFixed(0)}%</span></span>
                    </div>
                    <div class="test-progress-bar">
                        <div class="test-progress-fill" style="width: ${coverage}%"></div>
                    </div>
                    <div class="test-results-summary">
                        <h4>Test Results</h4>
                        <div class="test-results-list">
                            ${results.map(result => `
                                <div class="test-result-item">
                                    <div class="test-result-icon ${result.passed ? 'passed' : 'failed'}"></div>
                                    <div class="test-result-text">
                                        ${result.description}
                                        ${!result.passed ? `<br><small>Expected: ${JSON.stringify(result.expected)}, Got: ${JSON.stringify(result.received)}</small>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        if (elements.coveragePercentage) {
            elements.coveragePercentage.textContent = `${coverage.toFixed(0)}%`;
            elements.coveragePercentage.classList.add('updated');
            setTimeout(() => {
                elements.coveragePercentage.classList.remove('updated');
            }, 500);
        }

        if (elements.executionTime) {
            elements.executionTime.textContent = `Execution time: ${executionTimeMs.toFixed(2)}ms`;
        }
    }

    function showError(message) {
        if (elements.resultContent) {
            elements.resultContent.innerHTML = `
                <div class="error-message">
                    <h4>Error in your solution:</h4>
                    <p>${message}</p>
                </div>
            `;
        }
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
