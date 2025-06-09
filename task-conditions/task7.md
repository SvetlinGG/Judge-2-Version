# Task 7: Process Data

Write a function processInput(type, input) that processes different types of data according to specific rules.

## Requirements:
1. The function should take two parameters:
   - type: a string indicating the data type ("int", "real", or "string")
   - input: the value to be processed
2. Process the input based on the type:
   - For "int": multiply the number by 2
   - For "real": multiply the number by 1.5 and round to 2 decimal places
   - For "string": wrap the string with "$" symbols
3. Handle edge cases:
   - Invalid type should return "Invalid type"
   - Invalid input for the specified type should return appropriate error message
   - Handle null and undefined inputs

## Example:
Input: ("int", "5")
Output: 10

Input: ("real", "2.00")
Output: 3.00

Input: ("real", "3.14")
Output: 4.71

Input: ("string", "hello")
Output: "$hello$"

Input: ("string", "123")
Output: "$123$"

Input: ("int", "0")
Output: 0

Input: ("real", "0.00")
Output: 0.00

## Note:
- For integers, ensure the result is a number, not a string
- For real numbers, maintain 2 decimal places
- For strings, ensure proper formatting with "$" symbols
- Handle type conversion appropriately
- Consider input validation for each type 