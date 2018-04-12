export default {
    host: '0.0.0.0',
    port: 8080,
    get redis() {
        return {
            host: process.env.REDIS_HOST || 'redis',
            port: process.env.REDIS_PORT || '6379',
        };
    }
}