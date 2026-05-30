function job(delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(delay);
        }, delay);
    });
}

console.log('Запуск таймерів... чекаємо 2 секунди');

Promise.all([
    job(1000),
    job(2000),
    job(500),
    job(1500)
]).then(results => {
    results.forEach(delay => {
        console.log(`done ${delay}`);
    });
});