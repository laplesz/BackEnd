// ==================== ЗАВДАННЯ 1.1 ====================

function makePromiseWithConstructor(itShouldResolve) {
    return new Promise((resolve, reject) => {
        if (itShouldResolve) {
            resolve('Success!');
        } else {
            reject('Failed!');
        }
    });
}

makePromiseWithConstructor(true)
    .then(result => console.log(' Тест 1.1 (resolve):', result))
    .catch(error => console.log('   Помилка:', error));

makePromiseWithConstructor(false)
    .then(result => console.log('   Не повинно виконатися'))
    .catch(error => console.log(' Тест 1.1 (reject):', error));

// ==================== ЗАВДАННЯ 1.2 ====================

function checkEvenNumber(number) {
    return new Promise((resolve, reject) => {
        if (number % 2 === 0) {
            resolve(number);
        } else {
            reject('Число непарне!');
        }
    });
}

checkEvenNumber(4)
    .then(num => console.log(' Тест 1.2 (парне):', num))
    .catch(err => console.log('   Помилка:', err));

checkEvenNumber(5)
    .then(num => console.log('   Не повинно виконатися'))
    .catch(err => console.log(' Тест 1.2 (непарне):', err));

// ==================== ЗАВДАННЯ 1.4 ====================

function authenticateUser(username, password) {
    return new Promise((resolve, reject) => {
        if (!username || username.trim() === '') {
            reject('Username is required');
        } 
        else if (!password || password.trim() === '') {
            reject('Password is required');
        } 
        else if (password.length < 6) {
            reject('Password too short');
        } 
        else {
            resolve({ 
                username: username, 
                authenticated: true 
            });
        }
    });
}

authenticateUser('john', 'password123')
    .then(user => console.log(' Тест 1.4 (успіх):', user))
    .catch(err => console.log('   Помилка:', err));

authenticateUser('', 'password123')
    .then(user => console.log('   Не повинно виконатися'))
    .catch(err => console.log(' Тест 1.4 (немає username):', err));

authenticateUser('john', '12345')
    .then(user => console.log('   Не повинно виконатися'))
    .catch(err => console.log(' Тест 1.4 (короткий пароль):', err));