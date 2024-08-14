const axios = require('axios');
const loggly = require('../lib/loggly');

jest.mock('axios');

const origSetTimeout = global.setTimeout;

describe('when trying to send logs', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    global.setTimeout = (cb, ms) => cb(); // ignore ms
  });

  afterEach(() => {
    axios.mockClear();
  });

  afterAll(() => {
    global.setTimeout = origSetTimeout;
    jest.runAllTimers();
  });

  it('should set correct token, URL, tags, headers and response', (done) => {
    axios.mockResolvedValueOnce({ status: 200, data: { response: 'ok' } });

    const client = loggly.createClient({
      token: 'my-token',
      subdomain: 'my-sub',
      tags: ['global-tag'],
    });

    client.log('message', ['custom-tag'], function (err, result) {
      const [uri, options] = axios.mock.calls[0];
      expect(uri).toEqual('https://logs-01.loggly.com/inputs/my-token');
      expect(options.data).toEqual('message');
      expect(options.proxy).toEqual(null);
      expect(options.headers['X-LOGGLY-TAG']).toEqual('global-tag,custom-tag');
      expect(result.response).toEqual('ok');
      expect(err).toEqual(null);
      done();
    });
  });

  it('should work with a non-json message', (done) => {
    axios.mockResolvedValueOnce({ status: 200, data: { response: 'ok' } });

    const client = loggly.createClient({
      token: 'my-token',
      subdomain: 'my-sub',
      tags: ['global-tag'],
    });

    client.log('message', function (err, result) {
      const [uri, options] = axios.mock.calls[0];
      expect(options.data).toEqual('message');
      done();
    });
  });

  it('should work with a json message', (done) => {
    axios.mockResolvedValueOnce({ status: 200, data: { response: 'ok' } });

    const client = loggly.createClient({
      token: 'my-token',
      subdomain: 'my-sub',
      json: true,
      tags: ['global-tag'],
    });

    client.log({ hi: 'all' }, function (err, result) {
      const [uri, options] = axios.mock.calls[0];
      expect(options.data).toEqual('{"hi":"all"}');
      done();
    });
  });

  it('should retry several times when error occurs', (done) => {
    axios.mockResolvedValue({ status: 500, data: { response: 'ok' } });

    const client = loggly.createClient({
      token: 'my-token',
      subdomain: 'my-sub',
      tags: ['global-tag'],
    });

    client.log('message', ['custom-tag'], function (err, result) {
      throw new Error('This should not be called');
    });

    origSetTimeout(() => {
      expect(axios).toHaveBeenCalledTimes(5);
      done();
    }, 10);

  });

});
