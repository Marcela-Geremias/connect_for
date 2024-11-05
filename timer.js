function measureTime(func, ...args) {
    const start = performance.now();
    func(...args);
    const end = performance.now();
    return end - start;
}
