export default function catchify(promise) {
    return promise
        .then(result => [null, result])
        .catch(error => [error, null]);
}
