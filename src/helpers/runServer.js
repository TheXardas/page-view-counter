import http from 'http';

export default function(host, port, routeProcessor) {
    http.createServer(async (req, res) => {
        // Ignoring favicon request
        if (req.url === '/favicon.ico') {
            res.writeHead(200, {'Content-Type': 'image/x-icon'});
            res.end();
            return;
        }

        try {
            const result = await routeProcessor(req, res);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(result.toString());
        } catch (err) {
            console.error(err);
            // TODO display error
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Sorry, we\'re experiencing some magnetic interference. Please, try again later');
        }
    }).listen(port, host);

    console.log(`Server running at ${host}:${port}`);
}