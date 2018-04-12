import RedisMetrics from 'redis-metrics';

// TODO move to config
const metrics = new RedisMetrics({
    host: 'redis',
    port: '6379',
});

metrics.client.on('error', (err) => {
    console.error(err);
    throw err;
});

const pageViewCounter = metrics.counter('pageview', { timeGranularity: 'second' });

export default {
    incr() {
        // Basically that just runs redis's ZINCRBY with a key, granulated by second
        // Only last 10 minutes are stored, so old keys will expire automatically
        return pageViewCounter.incr();
    },
    async getLastMinuteCount(now = Date.now()) {
        const dateMinuteAgo = new Date(now - 1000 * 60);

        // That fetches ZSCORE's for all keys, granulated by second.
        const response = await pageViewCounter.countRange('second', dateMinuteAgo, now);

        // Sum it all up.
        return Object.keys(response).reduce((sum, key) => sum + response[key], 0);
    }
}