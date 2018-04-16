import http from 'http';

export default function getContainerName() {
    return new Promise((resolve) => {
        const request = http.get({
            host: '169.254.169.254',
            path: '/latest/meta-data/instance-id',
        }, (response) => {
            console.log(response);
            if (response.statusCode === 200) {
                return resolve(response.body);
            }
            return resolve('local');
        });
        request.setTimeout(3000, () => {
            request.abort();
            return resolve('local');
        });

        request.on('error', (err) => {
            console.log('Warning: failed to get container name (production issue only)');
        });
    });
}