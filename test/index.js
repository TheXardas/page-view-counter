import http from 'http';
import assert from 'assert';
import config from '../src/config';

import '../src/index.js';

describe('Example Node Server', () => {
    it('should return 200', done => {
        http.get(`http://${config.host}:${config.port}`, res => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});