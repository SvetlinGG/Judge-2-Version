
import taskTests from './tests/taskTests.js';


const markedScript = document.createElement('script');
markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
document.head.appendChild(markedScript);

document.addEventListener("DOMContentLoaded", () => {
    
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
        closeTaskBtn: document.querySelector('.close-task-btn'),
        currentTime: document.getElementById("current-time"),
        themeToggle: document.getElementById("themeToggle")
    };

    
    Object.entries(elements).forEach(([key, element]) => {
        if (!element) {
            console.error(`Required element not found: ${key}`);
        }
    });

    
    function updateClock() {
        const now = new Date();
        const timeElement = elements.currentTime;
        
        if (timeElement) {
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    
    
    updateClock();
    setInterval(updateClock, 1000);
    
    
    const themeToggle = elements.themeToggle;
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector(".theme-icon");
        
        
        const savedTheme = localStorage.getItem("theme") || "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);
        themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";
        
        themeToggle.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            
            document.documentElement.setAttribute("data-theme", newTheme);
            themeIcon.textContent = newTheme === "dark" ? "☀️" : "🌙";
            
            localStorage.setItem("theme", newTheme);
        });
    }
    
    
    const solutionCode = document.getElementById("solutionCode");
    let highlightedCode = '';

    function highlightSyntax(code) {
        
        const methodPattern = /\b(function|return|if|else|for|while|const|let|var)\b/g;
        
        
        return code.replace(methodPattern, match => `<span class="method">${match}</span>`);
    }

    function updateHighlighting() {
        const code = solutionCode.value;
        highlightedCode = highlightSyntax(code);
        
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = highlightedCode;
        
        
        const plainText = tempDiv.textContent;
        
        
        solutionCode.value = plainText;
        
        
        solutionCode.dataset.highlighted = highlightedCode;
    }

    
    solutionCode.addEventListener('input', updateHighlighting);
    solutionCode.addEventListener('focus', updateHighlighting);
    solutionCode.addEventListener('blur', updateHighlighting);

    
    updateHighlighting();

    
    const taskItems = document.querySelectorAll('.task-item');
    const taskConditionsSection = document.querySelector('.task-conditions-section');
    const taskConditionsContent = document.querySelector('.task-conditions-content');
    const closeTaskBtn = document.querySelector('.close-task-btn');
    const codeTextarea = document.querySelector('#solutionCode');
    const testInputTextarea = document.querySelector('#testInput');

    let currentTask = null;

    async function loadTaskCondition(taskNumber) {
        try {
            
            testInputTextarea.value = 'Loading task conditions...';
            
            
            const taskId = taskNumber.replace('task', '');
            
            
            const response = await fetch(`task-conditions/task${taskId}.md`);
            if (!response.ok) {
                throw new Error(`Failed to load task ${taskId}`);
            }
            
            const content = await response.text();
            
            
            testInputTextarea.value = content;
            
            
            testInputTextarea.readOnly = true;
            testInputTextarea.style.overflowY = 'auto';
            testInputTextarea.style.height = '300px';
            testInputTextarea.style.whiteSpace = 'pre-wrap';
            testInputTextarea.style.fontFamily = 'monospace';
            testInputTextarea.style.lineHeight = '1.5';
            testInputTextarea.style.padding = '10px';
            
            currentTask = taskNumber;
            
            
            codeTextarea.disabled = false;
            codeTextarea.placeholder = `Write your solution for Task ${taskId} here...`;
            
            
            codeTextarea.value = '';
            
            
            taskItems.forEach(item => {
                item.classList.toggle('active', item.dataset.task === taskNumber);
            });

            
            document.getElementById('closeTestInput').style.display = 'block';

        } catch (error) {
            console.error('Error loading task condition:', error);
            testInputTextarea.value = `Error loading task ${taskNumber}: ${error.message}`;
        }
    }

    
    function closeTaskConditions() {
        taskConditionsSection.classList.remove('visible');
        taskItems.forEach(item => item.classList.remove('active'));
        codeTextarea.disabled = true;
        codeTextarea.value = '';
        codeTextarea.placeholder = 'Select a task to see the example code...';
        testInputTextarea.value = '';
        testInputTextarea.readOnly = true;
        currentTask = null;
        
        
        document.getElementById('closeTestInput').style.display = 'none';
    }
    
   
    function closeTestInput() {
        testInputTextarea.value = '';
        document.getElementById('closeTestInput').style.display = 'none';
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
    
    
    document.getElementById('closeTestInput').addEventListener('click', closeTestInput);
    
    
    document.getElementById('closeTestInput').style.display = 'none';

    
    if (taskItems.length > 0) {
        loadTaskCondition(taskItems[0].dataset.task);
    }

    
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

        
        const submitButton = submissionForm.querySelector('.submit-btn');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Testing...';
        submitButton.disabled = true;
        submitButton.classList.add('testing');

        try {
            
            await new Promise(resolve => setTimeout(resolve, 500));

            
            const startTime = performance.now();

            
            let passedTests = 0;
            const results = [];

            
            let match = code.match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/);
            const functionName = match ? match[1] : null;

            if (!functionName) {
                throw new Error("No valid function found in your code. Please include a function definition.");
            }

            const params = getFunctionParameters(code);
            const func = new Function(...params, `${code}; return ${functionName}(${params.join(",")});`);

            
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

            
            coveragePercentage.textContent = `${((passedTests / tests.length) * 100).toFixed(0)}%`;
            coveragePercentage.classList.add('updated');
            setTimeout(() => {
                coveragePercentage.classList.remove('updated');
            }, 500);

            
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
