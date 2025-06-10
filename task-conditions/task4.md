# Prime Number Checker

## Task Description
Write a function `isPrime(number)` that determines whether a given number is prime or not.

## Requirements
- The function should return `true` if the number is prime, and `false` otherwise.
- A prime number is a natural number greater than 1 that is not divisible by any positive integer other than 1 and itself.
- The function should handle edge cases properly:
  - Numbers less than or equal to 1 are not prime
  - The number 2 is prime (the only even prime number)

## Examples
- `isPrime(7)` should return `true` (7 is prime)
- `isPrime(4)` should return `false` (4 = 2 × 2)
- `isPrime(1)` should return `false` (1 is not prime by definition)
- `isPrime(2)` should return `true` (2 is prime)
- `isPrime(13)` should return `true` (13 is prime)
- `isPrime(25)` should return `false` (25 = 5 × 5)

## Constraints
- The input will be a positive integer
- You can assume the input will be within the range of JavaScript's Number type

## Hints
- The most straightforward approach is to check if the number is divisible by any integer from 2 to the square root of the number.
- You don't need to check divisibility beyond the square root of the number.