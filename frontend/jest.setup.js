import '@testing-library/jest-dom';

// Mock de IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {
        return null;
    }
    disconnect() {
        return null;
    }
    unobserve() {
        return null;
    }
};

// Mock de console.error para evitar ruido en tests
const originalError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (
        typeof args[0] === 'string' &&
        args[0].includes('Warning: ReactDOM.render is deprecated')
        ) {
        return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});