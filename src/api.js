'use strict';

import request from 'superagent';
import qs from 'qs';
import uniqueId from 'lodash/utility/uniqueId';
import BPromise from 'bluebird';

BPromise.config({
  warnings: true,
  longStackTraces: true,
  cancellation: true
});


const API = {

  config(options = {}) {
    let { onRequestError, onRequestCompleted, requestData, urlRoot } = options;

    this.onRequestCompleted = onRequestCompleted;
    this.onRequestError = onRequestError;
    this.requestData = requestData;
    this.urlRoot = urlRoot;
  },
	
	request(options = {}) {

		let { method, data, endpoint, onSuccess } = options;    

		if (!method) { method = 'get' }
		if (!data) { data = {} }
		if (!endpoint) {
			throw new Error('Please provide an endpoint for an API call');
		}

		if (!onSuccess) {
			throw new Error('Please provide onSuccess callback that accepts responseBody object');
		}

		let doRequest;

		Object.assign(data, this.requestData);

    if (method === 'post' || method === 'put') {
      doRequest = request[method](this.urlRoot+endpoint)
        .accept('json')
        .send(data);
    } else if (method === 'get' || method == 'del') {
      doRequest = request[method](this.urlRoot+endpoint)
        .accept('json')
        .query(
          qs.stringify(
            data,
            { arrayFormat: 'brackets' }
          )
        );
    }

    
    /*
      requestId is used on onSuccess callback to allow models to 
      prevent loops when setting same attributes
      multiple times
     */
    let requestId = uniqueId('request_');
    let isCancelled = false;
    return new BPromise( (resolve, reject) => {

    	doRequest.end( (err, response) => {

        if (this.onRequestCompleted) this.onRequestCompleted(response);

        let resolveOptions;

	      if (!response.ok) {
	      	let errors = response.body ? response.body.errors : 'Something bad happened';
      		let statusCode = response.status;

      		if (this.onRequestError) this.onRequestError({ statusCode, errors });

          /*
            we resolve promise even if request
            was not successfull to reduce boilerplat
            + because we  typically don't want ui do 
            have some specific behaviour in this case
           */
          resolveOptions = {
            ok: false,
            errors: 'Something bad happened',
            requestId
          };

	        
	      } else {
	      	// showSuccessMessage(successType)

	      	onSuccess({
            json: response.body,
            requestId
          });

          resolveOptions = {
            ok: true,
            body: response.body,
            requestId,            
          };
          
        }

        resolve(resolveOptions);

      });

    });

	}
}

export default API;