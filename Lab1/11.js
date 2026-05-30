// ==================== ЗАВДАННЯ 11.1 ====================

function analyzeResults(promises) {
    return Promise.allSettled(promises).then(results => {
        const successfulCount = results.filter(result => result.status === 'fulfilled').length;
        
        const failedCount = results.filter(result => result.status === 'rejected').length;
        
        return {
            successful: successfulCount,
            failed: failedCount,
            results: results
        };
    });
}

const testPromises1 = [
    Promise.resolve(1),
    Promise.reject(new Error('Fail')),
    Promise.resolve(3),
    Promise.reject(new Error('Another fail')),
    Promise.resolve(5)
];

analyzeResults(testPromises1)
    .then(stats => {
        console.log(' Тест 11.1:', stats);
    });

// ==================== ЗАВДАННЯ 11.2 ====================

function sendEmail(email) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.7) {
                reject(new Error(`Failed to send to ${email}`));
            } else {
                resolve(`Email sent to ${email}`);
            }
        }, 100);
    });
}

async function sendBulkEmails(emails) {
    const promises = emails.map(email => sendEmail(email));
    
    const results = await Promise.allSettled(promises);
    
    const sentCount = results.filter(result => result.status === 'fulfilled').length;
    const failedCount = results.filter(result => result.status === 'rejected').length;
    
    return {
        sent: sentCount,
        failed: failedCount,
        details: results
    };
}

const emails = ['user1@test.com', 'user2@test.com', 'user3@test.com', 'user4@test.com'];
sendBulkEmails(emails)
    .then(result => console.log(' Тест 11.2:', result));