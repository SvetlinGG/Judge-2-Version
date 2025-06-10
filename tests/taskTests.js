const taskTests = {
    task4: [
        {
            description: "Basic prime number test",
            input: 7,
            expected: true
        },
        {
            description: "Basic non-prime number test",
            input: 8,
            expected: false
        },
        {
            description: "Smallest prime number test",
            input: 2,
            expected: true
        },
        {
            description: "Number one test",
            input: 1,
            expected: false
        },
        {
            description: "Zero test",
            input: 0,
            expected: false
        },
        {
            description: "Negative number test",
            input: -7,
            expected: false
        },
        {
            description: "Large prime number test",
            input: 97,
            expected: true
        },
        {
            description: "Large non-prime number test",
            input: 100,
            expected: false
        },
        {
            description: "Square of a prime number test",
            input: 49,
            expected: false
        },
        {
            description: "Product of two primes test",
            input: 15,
            expected: false
        }
    ]
};

export default taskTests; 