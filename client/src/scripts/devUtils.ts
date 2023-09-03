export function wait5secPromise() {
    return new Promise((res) => setTimeout(res, 5000));
}

export function waitRandomMax5secPromise() {
    return new Promise((res) => {
        setTimeout(res, Math.floor(Math.random() * 5000));
    });
}
