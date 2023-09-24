export function waitPromise(seconds = 5000) {
    return new Promise((res) => setTimeout(res, seconds));
}

export function waitRandomPromise(maxSeconds = 5000) {
    return new Promise((res) => {
        setTimeout(res, Math.floor(Math.random() * maxSeconds));
    });
}
