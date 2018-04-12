import RedisMetrics from 'redis-metrics';

export default {
    counterInstance: null,

    getCounter() {
        if (!this.counterInstance) {
            // lazy-setting up a counter instance, so we won't set up a connection, when not needed.
            const metrics = new RedisMetrics({
                host: 'redis',
                port: '6379',
            });

            metrics.client.on('error', (err) => {
                console.error(err);
                throw err;
            });

            this.counterInstance = metrics.counter('pageview', { timeGranularity: 'second' });
        }
        return this.counterInstance;
    },

    incr() {
        // Basically that just runs redis's ZINCRBY with a key, granulated by second
        // Only last 10 minutes are stored, so old keys will expire automatically
        return this.getCounter().incr();
    },

    async getLastMinuteCount(now = Date.now()) {
        const dateMinuteAgo = new Date(now - 1000 * 60);

        // That fetches ZSCORE's for all keys, granulated by second.
        const response = await this.getCounter().countRange('second', dateMinuteAgo, now);

        // Sum it all up.
        return Object.keys(response).reduce((sum, key) => sum + response[key], 0);
    }
}