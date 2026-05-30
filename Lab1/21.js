// ==================== ЗАВДАННЯ 21.1 ====================

class PromiseQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    add(promiseFactory) {
        this.queue.push(promiseFactory);
        
        if (!this.processing) {
            this.processing = true;
            this.process();
        }
    }

    async process() {
        while (this.queue.length > 0) {
            const currentTask = this.queue.shift();
            
            try {
                await currentTask();
            } catch (error) {
                console.error('Помилка в завданні:', error);
            }
        }
        
        this.processing = false;
    }
}

const queue1 = new PromiseQueue();

queue1.add(() => new Promise(resolve => {
    setTimeout(() => {
        console.log(' Тест 21.1: Task 1 completed');
        resolve(1);
    }, 300);
}));

queue1.add(() => new Promise(resolve => {
    setTimeout(() => {
        console.log(' Тест 21.1: Task 2 completed');
        resolve(2);
    }, 100);
}));

queue1.add(() => new Promise(resolve => {
    setTimeout(() => {
        console.log(' Тест 21.1: Task 3 completed');
        resolve(3);
    }, 200);
}));

// ==================== ЗАВДАННЯ 21.3 ====================

class ControllableQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.paused = false;
    }

    add(promiseFactory) {
        this.queue.push(promiseFactory);
        
        if (!this.processing && !this.paused) {
            this.process();
        }
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
        
        if (!this.processing && this.queue.length > 0) {
            this.process();
        }
    }

    async process() {
        this.processing = true;

        while (this.queue.length > 0 && !this.paused) {
            const currentTask = this.queue.shift();
            try {
                await currentTask();
            } catch (error) {
                console.error('Помилка в завданні:', error);
            }
        }

        this.processing = false;
    }
}

console.log(' Тест 21.3: Контрольована черга');
const queue3 = new ControllableQueue();

queue3.add(() => Promise.resolve(console.log('  Task A')));
queue3.add(() => Promise.resolve(console.log('  Task B')));

setTimeout(() => {
    queue3.pause();
    console.log('  Queue paused');
}, 100);

setTimeout(() => {
    queue3.add(() => Promise.resolve(console.log('  Task C')));
    queue3.resume();
    console.log('  Queue resumed');
}, 500);

// ==================== ЗАВДАННЯ 21.4 ⭐ ====================

class TimedQueue {
    constructor(timeout = 5000) {
        this.queue = [];
        this.timeout = timeout;
        this.processing = false;
    }

    add(promiseFactory) {
        this.queue.push(promiseFactory);
        
        if (!this.processing) {
            this.process();
        }
    }

    async process() {
        this.processing = true;

        while (this.queue.length > 0) {
            const currentTaskFactory = this.queue.shift();

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error(`Таймаут: завдання перевищило ліміт у ${this.timeout}мс`));
                }, this.timeout);
            });

            try {
                await Promise.race([
                    currentTaskFactory(), 
                    timeoutPromise
                ]);
            } catch (error) {
                console.error(' Помилка:', error.message);
            }
        }

        this.processing = false;
    }
}

console.log(' Тест 21.4: Черга з таймаутом');
const queue4 = new TimedQueue(500);

queue4.add(() => new Promise(resolve => {
    setTimeout(() => {
        console.log('  Fast task completed');
        resolve();
    }, 200);
}));

queue4.add(() => new Promise(resolve => {
    setTimeout(() => {
        console.log('  This should not print');
        resolve();
    }, 1000);
}));