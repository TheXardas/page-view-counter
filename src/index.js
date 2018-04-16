import runServer from './helpers/runServer';
import config from './config';
import pageViewCounter from './helpers/pageViewCounter';
import getContainerName from './helpers/getContainerName';

const { host, port } = config;

getContainerName().then((containerName) => config.containerName = containerName);

runServer(host, port, (req, res) => {
    pageViewCounter.incr();
    return pageViewCounter.getLastMinuteCount().then(count => {
        return `Hello World! Current page view count is ${count}.
            Instance: ${config.containerName}
        `;
    });
});