document.addEventListener('DOMContentLoaded', () => {
    const submissionForm = document.getElementById('submissionForm');
    const resultContent = document.getElementById('resultContent');

    // Sample test cases for each task
    const testCases = {
        task1: {
            description: "Hello World",
            test: (code) => {
                try {
                    // Create a function from the submitted code
                    const func = new Function(code);
                    const result = func();
                    return result === "Hello, World!";
                } catch (error) {
                    return false;
                }
            }
        },
        task2: {
            description: "Sum of Numbers",
            test: (code) => {
                try {
                    const func = new Function('a', 'b', code);
                    return func(5, 3) === 8 && func(10, 20) === 30;
                } catch (error) {
                    return false;
                }
            }
        },
        task3: {
            description: "Palindrome Checker",
            test: (code) => {
                try {
                    const func = new Function('str', code);
                    return func("radar") === true && 
                           func("hello") === false && 
                           func("A man, a plan, a canal: Panama") === true;
                } catch (error) {
                    return false;
                }
            }
        }
    };

    submissionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskSelect = document.getElementById('taskSelect');
        const solutionCode = document.getElementById('solutionCode');
        const selectedTask = taskSelect.value;
        const code = solutionCode.value;

        if (!selectedTask || !code) {
            showResult('Please select a task and provide your solution code.', 'error');
            return;
        }

        // Test the solution
        const testCase = testCases[selectedTask];
        const passed = testCase.test(code);

        if (passed) {
            showResult('✅ Congratulations! Your solution passed all test cases.', 'success');
        } else {
            showResult('❌ Your solution did not pass the test cases. Please try again.', 'error');
        }
    });

    function showResult(message, type) {
        resultContent.innerHTML = `
            <div class="result-message ${type}">
                ${message}
            </div>
        `;
    }
}); 