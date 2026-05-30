// ==================== ЗАВДАННЯ 2.1 ====================

function makePromiseResolveWith(value) {
    return Promise.resolve(value);
}

makePromiseResolveWith(5)
    .then(value => console.log(' Тест 2.1:', value));

// ==================== ЗАВДАННЯ 2.2 ====================

function sumNumbers(numbers) {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    
    return Promise.resolve(sum);
}

sumNumbers([1, 2, 3, 4, 5])
    .then(sum => console.log(' Тест 2.2:', sum));

// ==================== ЗАВДАННЯ 2.7 ====================

function tryCatchPromise(fn, ...args) {
    try {
        const result = fn(...args);
        
        return Promise.resolve(result);
    } catch (error) {
        return Promise.reject(error);
    }
}

const goodFunction = (a, b) => a + b;
const badFunction = () => { throw new Error('Oops!'); };

tryCatchPromise(goodFunction, 5, 3)
    .then(result => console.log(' Тест 2.7a:', result));

tryCatchPromise(badFunction)
    .catch(error => console.log(' Тест 2.7b:', error.message));