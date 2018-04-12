import runServer from './helpers/runServer';
import config from './config';
import pageViewCounter from './helpers/pageViewCounter';

const { host, port } = config;

runServer(host, port, (req, res) => {
    pageViewCounter.incr();
    return pageViewCounter.getLastMinuteCount().then(count => {
        return `Hello World! Current page view count is ${count}`;
    });
});