/* @flow */

import {
  DEFAULT_HTTP_METHOD,
  DEFAULT_PING_SERVER_URL,
  DEFAULT_TIMEOUT,
  METRIC
} from './constants';

type Options = {
  method?: 'HEAD' | 'OPTIONS',
  url: string,
  timeout?: number,
  testMethod?:
    | 'onload/2xx'
    | 'onload/3xx'
    | 'onload/4xx'
    | 'onload/5xx'
    | 'onerror'
    | 'ontimeout',
};

type ResolvedValue = {
  status: number,
  metric: string, 
  speed: number
};

export const headers = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  Expires: 0,
};

/**
 * Utility that promisifies XMLHttpRequest in order to have a nice API that supports cancellation.
 * @param method
 * @param url
 * @param timeout -> Timeout for rejecting the promise and aborting the API request
 * @param testMethod: for testing purposes
 * @returns {Promise}
 */
export default function makeHttpRequest({
  method = DEFAULT_HTTP_METHOD,
  url = DEFAULT_PING_SERVER_URL,
  timeout = DEFAULT_TIMEOUT,
  testMethod,
}: Options = {}) {
  return new Promise(
    (resolve: ResolvedValue => void, reject: ResolvedValue => void) => {
      // $FlowFixMe
      const startTime = (new Date()).getTime();
      const xhr = new XMLHttpRequest(testMethod);
      xhr.open(method, url);
      xhr.timeout = timeout;
      xhr.onload = function onLoad() {
        const endTime = (new Date()).getTime();
        const duration = (endTime - startTime)/ 1000;
        // 3xx is a valid response for us, since the server was reachable
        if (this.status >= 200 && this.status < 400) {
          const downloadSizeInBits = parseInt(xhr.getResponseHeader("Content-Length"));
          resolve({
            status: this.status,
            metric: METRIC, 
            speed: parseInt(downloadSizeInBits/ (1024 * duration)) 
          });
        } else {
          reject({
            status: this.status,
            metric: METRIC, 
            speed: 0
          });
        }
      };
      xhr.onerror = function onError() {
        reject({
          status: this.status,
          metric: METRIC, 
          speed: 0
        });
      };
      xhr.ontimeout = function onTimeOut() {
        reject({
          status: this.status,
          metric: METRIC, 
          speed: 0
        });
      };
      Object.keys(headers).forEach((key: string) => {
        xhr.setRequestHeader(key, headers[key]);
      });
      xhr.send(null);
    },
  );
}
