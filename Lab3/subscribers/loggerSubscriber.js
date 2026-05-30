const fs = require('fs');
const path = require('path');
const statsEmitter = require('../events/statsEmitter');

const logPath = path.join(__dirname, '../../stats.json');

statsEmitter.on('requestCompleted', statsData => {
    console.log(`[Subscriber] Отримано статистику для: ${statsData.method} ${statsData.path}`);

    let logs = [];
    if (fs.existsSync(logPath)) {
        const content = fs.readFileSync(logPath, 'utf8');
        try {
            logs = JSON.parse(content);
        } catch (e) {
            logs = [];
        }
    }

    logs.push(statsData);

    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
});
