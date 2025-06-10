// Import test cases
import taskTests from './tests/taskTests.js';

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
        taskConditionsSection: document.querySelector('.task-conditions-section'),
        taskConditionsContent: document.querySelector('.task-conditions-content'),
        closeTaskBtn: document.querySelector('.close-task-btn')
    };

    // Validate that all required elements exist
    Object.entries(elements).forEach(([key, element]) => {
        if (!element) {
            console.error(`Required element not found: ${key}`);
        }
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

    // Task selection and condition loading
    const taskItems = document.querySelectorAll('.task-item');
    const taskConditionsSection = document.querySelector('.task-conditions-section');
    const taskConditionsContent = document.querySelector('.task-conditions-content');
    const closeTaskBtn = document.querySelector('.close-task-btn');
    const codeTextarea = document.querySelector('#solutionCode');

    let currentTask = null;

    async function loadTaskCondition(taskNumber) {
        try {
            // Show loading state
            taskConditionsContent.innerHTML = '<p>Loading task conditions...</p>';
            taskConditionsSection.classList.add('visible');

            const response = await fetch(`task-conditions/${taskNumber}.md`);
            if (!response.ok) {
                throw new Error(`Failed to load task ${taskNumber}`);
            }
            
            const content = await response.text();
            
            // Convert markdown to HTML
            const htmlContent = marked.parse(content);
            
            // Update the content with proper styling
            taskConditionsContent.innerHTML = `
                <div class="task-details">
                    ${htmlContent}
                </div>
            `;
            
            currentTask = taskNumber;
            
            // Enable code textarea
            codeTextarea.disabled = false;
            codeTextarea.placeholder = `Write your solution for Task ${taskNumber} here...`;
            
            // Clear previous code
            codeTextarea.value = '';
            
            // Update active state
            taskItems.forEach(item => {
                item.classList.toggle('active', item.dataset.task === taskNumber);
            });

            // Scroll to task conditions
            taskConditionsSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error loading task condition:', error);
            taskConditionsContent.innerHTML = `
                <div class="error-message">
                    <h4>Error loading task conditions</h4>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    // Close task conditions
    function closeTaskConditions() {
        taskConditionsSection.classList.remove('visible');
        taskItems.forEach(item => item.classList.remove('active'));
        codeTextarea.disabled = true;
        codeTextarea.value = '';
        codeTextarea.placeholder = 'Select a task to see the example code...';
        currentTask = null;
    }

    taskItems.forEach(item => {
        item.addEventListener('click', () => {
            const taskNumber = item.dataset.task;
            if (currentTask !== taskNumber) {
                loadTaskCondition(taskNumber);
            }
        });
    });

    closeTaskBtn.addEventListener('click', closeTaskConditions);

    // Initialize with first task
    if (taskItems.length > 0) {
        loadTaskCondition(taskItems[0].dataset.task);
    }

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
        const tests = taskTests[taskId];

        // Show loading state
        const submitButton = submissionForm.querySelector('.submit-btn');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Testing...';
        submitButton.disabled = true;
        submitButton.classList.add('testing');

        try {
            // Add a small delay to show the testing state
            await new Promise(resolve => setTimeout(resolve, 500));

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
            // Reset button state with a small delay
            setTimeout(() => {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                submitButton.classList.remove('testing');
            }, 500);
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
});
