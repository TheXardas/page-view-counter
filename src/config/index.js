export default {
    host: '0.0.0.0',
    port: 8080,
    redis: {
        host: process.env.REDIS_HOST || 'redis',
        // REDIS_PORT is busy by docker redis image, and it is not actually a port
        port: process.env.REDIS_CUSTOM_PORT || '6379',
    },
    containerName: process.env.CONTAINER_NAME || 'local',
}