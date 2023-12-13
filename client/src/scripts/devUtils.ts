export function waitPromise(seconds = 5) {
    return new Promise((res) => setTimeout(res, seconds * 1000));
}

export function waitRandomPromise(maxSeconds = 5) {
    return new Promise((res) => {
        setTimeout(res, Math.floor(Math.random() * maxSeconds * 1000));
    });
}
