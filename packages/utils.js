export const isObjectsEquals = (a, b) => {
    let isOK = true;
    for (let prop in a) {
        if (a[prop] !== b[prop]) {
            isOK = false;
            break;
        }
    }
    return isOK;
};