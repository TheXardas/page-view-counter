import http from 'http';
import assert from 'assert';
import sinon from 'sinon';
import pageViewCounter from '../src/helpers/pageViewCounter';
import config from '../src/config';

import '../src/index.js';

const makeRequest = (callback) => {
    http.get(`http://${config.host}:${config.port}`, callback);
};

// TODO write more tests
describe('Example Node Server', () => {
    const sandbox = sinon.sandbox.create();
    beforeEach(() => {
        sandbox.stub(pageViewCounter, 'incr');
        sandbox.stub(pageViewCounter, 'getLastMinuteCount').callsFake(() =>
            Promise.resolve(123)
        );
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return 200', done => {
        makeRequest((res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should call incr and getLastMinutes methods', done => {
        makeRequest((res) => {
            //console.log(res);
            sinon.assert.calledOnce(pageViewCounter.incr);
            sinon.assert.calledOnce(pageViewCounter.getLastMinuteCount);
            done();
        });
    })
});