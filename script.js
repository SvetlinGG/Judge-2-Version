document.addEventListener("DOMContentLoaded", () => {
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
    });

    // Task selection functionality
    const taskItems = document.querySelectorAll(".task-item");
    const solutionCode = document.getElementById("solutionCode");

    // Test cases for each task
    const testCases = {
        task1: [
            {
                input: [],
                expected: "Hello, World!",
                description: "Basic hello world test",
            },
            {
                input: [],
                expected: "Hello, World!",
                description: "Case sensitivity test",
            },
        ],
        task2: [
            { input: [5, 3], expected: 8, description: "Positive numbers" },
            { input: [-1, 1], expected: 0, description: "Negative and positive" },
            { input: [0, 0], expected: 0, description: "Zero values" },
            { input: [10, 20], expected: 30, description: "Larger numbers" },
        ],
        task3: [
            { input: ["radar"], expected: true, description: "Simple palindrome" },
            { input: ["hello"], expected: false, description: "Non-palindrome" },
            {
                input: ["A man, a plan, a canal: Panama"],
                expected: true,
                description: "Complex palindrome",
            },
            {
                input: ["racecar"],
                expected: true,
                description: "Odd length palindrome",
            },
            {
                input: ["noon"],
                expected: true,
                description: "Even length palindrome",
            },
            { input: [""], expected: true, description: "Empty string" },
        ],
        task4: [
            { input: [7], expected: true, description: "IsPrime Number" },
            { input: [8], expected: false, description: "Is not a Prime Number" },
            { input: [81], expected: false, description: "Is not a Prime Number" },
            { input: [2], expected: true, description: "IsPrime Number" },
            { input: [1], expected: false, description: "Is not a Prime Number" },
            { input: [-7], expected: false, description: "Is not a Prime Number" },
            { input: [97], expected: true, description: "IsPrime Number" },
            { input: [100], expected: false, description: "Is not a Prime Number" },
        ],
        task5: [
            {
                input: [
                    [1, 0, 2],
                    [0, 1, 0],
                    [2, 0, 1],
                ],
                expected: "First player won",
                description: "Win by 1 - diagonal",
            },
            {
                input: [
                    [0, 1, 0],
                    [2, 2, 2],
                    [1, 0, 0],
                ],
                expected: "Second player won",
                description: "Win by 2 - horizontal",
            },
            {
                input: [
                    [1, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0],
                ],
                expected: "Draw!",
                description: "Only one move by player 1",
            },
            {
                input: [
                    [1, 2, 0],
                    [1, 0, 2],
                    [1, 2, 0],
                ],
                expected: "First player won",
                description: "Win by 1 - vertical",
            },
            {
                input: [
                    [1, 0, 2],
                    [0, 1, 2],
                    [1, 2, 0],
                ],
                expected: "Draw!",
                description: "Ongoing game - draw",
            },
            {
                input: [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0],
                ],
                expected: "Draw!",
                description: "Empty board",
            },
            {
                input: [
                    [1, 0, 2],
                    [1, 2, 0],
                    [2, 1, 0],
                ],
                expected: "Second player won",
                description: "Win by 2 - diagonal",
            },
            {
                input: [
                    [2, 0, 0],
                    [2, 1, 0],
                    [2, 1, 1],
                ],
                expected: "Second player won",
                description: "Win by 2 - vertical",
            },
            {
                input: [
                    [1, 1, 2],
                    [2, 2, 1],
                    [1, 2, 1],
                ],
                expected: "Draw!",
                description: "Full board - draw",
            },
        ],
        task6: [
            { input: 213, expected: 321, description: "Positive number" },
            {
                input: 7389,
                expected: 9873,
                description: "Positive number with multiple digits",
            },
            { input: 10200, expected: 21000, description: "Includes zeros" },
            { input: 2, expected: 2, description: "Single-digit number" },
            { input: -3412, expected: -4321, description: "Negative number" },
            { input: 777, expected: 777, description: "Same digits" },
            { input: 0, expected: 0, description: "Zero value" },
        ],
        task7: [
            {
                description: "Type int, input 5",
                input: ["int", "5"],
                expected: 10,
            },
            {
                description: "Type real, input 2.00",
                input: ["real", "2.00"],
                expected: 3.0,
            },
            {
                description: "Type real, input 3.14",
                input: ["real", "3.14"],
                expected: 4.71,
            },
            {
                description: 'Type string, input "hello"',
                input: ["string", "hello"],
                expected: "$hello$",
            },
            {
                description: 'Type string, input "123"',
                input: ["string", "123"],
                expected: "$123$",
            },
            {
                description: "Type int, input 0",
                input: ["int", "0"],
                expected: 0,
            },
            {
                description: "Type real, input 0.00",
                input: ["real", "0.00"],
                expected: 0.00,
            },
        ]
    };

    taskItems.forEach((task) => {
        task.addEventListener("click", () => {
            taskItems.forEach((t) => t.classList.remove("active"));
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
    const submissionForm = document.getElementById("submissionForm");
    const resultContent = document.getElementById("resultContent");
    const coveragePercentage = document.getElementById("coveragePercentage");
    const coverageDetails = document.getElementById("coverageDetails");
    const executionTime = document.getElementById("executionTime");

    // Statistics and Results Management
    let taskResults = {
        totalTasks: 7, // Total number of available tasks
        completedTasks: 0,
        totalPoints: 0,
        maxPoints: 0,
        passedTests: 0,
        totalTests: 0
    };

    function updateStatistics() {
        // Update result cards
        document.getElementById('totalPoints').textContent = taskResults.totalPoints;
        document.getElementById('completedTasks').textContent = taskResults.completedTasks;
        
        const successRate = taskResults.totalTests > 0 
            ? Math.round((taskResults.passedTests / taskResults.totalTests) * 100) 
            : 0;
        document.getElementById('successRate').textContent = `${successRate}%`;

        // Update statistics
        const taskCompletion = Math.round((taskResults.completedTasks / taskResults.totalTasks) * 100);
        document.getElementById('taskCompletion').textContent = `${taskCompletion}%`;

        const averageScore = taskResults.maxPoints > 0 
            ? Math.round((taskResults.totalPoints / taskResults.maxPoints) * 100) 
            : 0;
        document.getElementById('averageScore').textContent = `${averageScore}%`;

        document.getElementById('overallSuccessRate').textContent = `${successRate}%`;

        // Update circular progress indicators
        updateCircularProgress('totalPointsCircle', taskResults.totalPoints / 100);
        updateCircularProgress('successRateCircle', successRate / 100);
        updateCircularProgress('completedTasksCircle', taskResults.completedTasks / taskResults.totalTasks);
        updateCircularProgress('taskCompletionCircle', taskCompletion / 100);
        updateCircularProgress('averageScoreCircle', averageScore / 100);
    }

    function updateCircularProgress(elementId, percentage) {
        const circle = document.getElementById(elementId);
        if (circle) {
            const degrees = percentage * 360;
            circle.style.background = `conic-gradient(var(--accent-primary) ${degrees}deg, transparent ${degrees}deg)`;
        }
    }

    function addTestCase(testCase) {
        const testCasesList = document.getElementById('testCasesList');
        const testCaseElement = document.createElement('div');
        testCaseElement.className = 'test-case';
        
        testCaseElement.innerHTML = `
            <div class="test-case-header">
                <span class="test-case-title">${testCase.name}</span>
                <span class="test-case-status ${testCase.passed ? 'passed' : 'failed'}">
                    ${testCase.passed ? 'Passed' : 'Failed'}
                </span>
            </div>
            <div class="test-case-details">
                <div>Input: ${JSON.stringify(testCase.input)}</div>
                <div>Expected: ${JSON.stringify(testCase.expected)}</div>
                <div>Actual: ${JSON.stringify(testCase.actual)}</div>
            </div>
        `;
        
        testCasesList.appendChild(testCaseElement);
    }

    function clearTestCases() {
        const testCasesList = document.getElementById('testCasesList');
        testCasesList.innerHTML = '';
    }

    function updateTaskResults(results) {
        taskResults.completedTasks++;
        taskResults.totalPoints += results.points;
        taskResults.maxPoints += results.maxPoints;
        taskResults.passedTests += results.passedTests;
        taskResults.totalTests += results.totalTests;
        
        updateStatistics();
    }

    submissionForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const activeTask = document.querySelector(".task-item.active");
        if (!activeTask) {
            resultContent.innerHTML =
                '<p class="error">Please select a task first!</p>';
            return;
        }

        const code = solutionCode.value;
        const taskId = activeTask.getAttribute("data-task");
        const tests = testCases[taskId];

        // Measure execution time
        const startTime = performance.now();

        // Run tests
        let passedTests = 0;
        const results = [];

        try {
            // Dynamically create a function
            let match = code.match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/);
            const functionName = match ? match[1] : null;

            if (!functionName) {
                resultContent.innerHTML = `<p class="error">No valid function found in your code.</p>`;
                return;
            }

            console.log("Extracted function name:", functionName);

            const params = getFunctionParameters(code);
            const func = new Function(...params, `${code}; return ${functionName}(${params.join(",")});`
            );

            let passedTests = 0;
            const results = [];

            tests.forEach((test, index) => {
                try {
                    const normalizedInput = Array.isArray(test.input)
                        ? test.input
                        : [test.input];

                    let result;

                    if (typeof test.input === "string") {
                        // Single string argument
                        result = func(test.input);
                    } else if (Array.isArray(test.input) && test.input.every(item => typeof item === "string")) {
                        // Multiple string arguments
                        result = func(...test.input);

                    } else if (
                        Array.isArray(test.input) &&
                        test.input.every((num) => typeof num === "number")
                    ) {
                        result = func(...test.input); // Task 2
                    } else if (typeof test.input === "number") {
                        result = func(test.input); // Task 6
                    } else if (
                        Array.isArray(test.input) &&
                        typeof test.input[0] === "object"
                    ) {
                        result = func(test.input); // Task 5 - nested arrays or objects
                    } else {
                        result = func(test.input); // fallback
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

            resultContent.innerHTML = `
                <p>Task: ${activeTask.querySelector("h3").textContent}</p>
                <p>${passedTests} out of ${tests.length} tests passed</p>
            `;
            // Update coverage percentage display
            coveragePercentage.textContent = `${(
                (passedTests / tests.length) *
                100
            ).toFixed(0)}%`;

            // Update coverage details with test results
            coverageDetails.innerHTML = results
                .map(
                    (result) => `
    <div class="test-result ${result.passed ? "passed" : "failed"}">
        Test ${result.testNumber}: ${result.description}
        ${!result.passed
                            ? `<br>Expected: ${result.expected}, Got: ${result.received}`
                            : ""
                        }
    </div>
`
                )
                .join("");

            // Measure execution time
            const endTime = performance.now();
            const executionTimeMs = endTime - startTime;
            executionTime.textContent = `Execution time: ${executionTimeMs.toFixed(
                2
            )}ms`;

            // Update task results
            updateTaskResults({
                points: passedTests,
                maxPoints: tests.length,
                passedTests: passedTests,
                totalTests: tests.length
            });
        } catch (error) {
            resultContent.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        }
    });

    // Helper function to extract function parameters from code
    function getFunctionParameters(code) {
        const match = code.match(/function\s+\w+\s*\(([^)]*)\)/);
        if (!match) return [];
        return match[1]
            .split(",")
            .map((param) => param.trim())
            .filter(Boolean);
    }

    // Initialize statistics
    updateStatistics();
});
