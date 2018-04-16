import request from 'request';

export default function getContainerName() {
    return new Promise((resolve) => {
        request('http://169.254.169.254/latest/meta-data/instance-id', {
            timeout: 3000,
        }, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return resolve('local');
            }
            return resolve(body);
        });
    });
}