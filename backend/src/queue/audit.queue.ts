const auditQueue: any[] = [];

export function addToQueue(log: any) {
    auditQueue.push(log);
}

export function getNextLog() {
    return auditQueue.shift();
}

export function getBatch(batchSize: number = 1000) {
    return auditQueue.splice(0, batchSize);
}