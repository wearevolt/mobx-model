'use strict';

import request from 'superagent';
import qs from 'qs';
import uniqueId from 'lodash/utility/uniqueId'


const API = {

  config(options = {}) {
    let { errorHandler, requestData } = options;

    this.errorHandler = errorHandler;
    this.requestData = requestData;
  }
	
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
      doRequest = request[method](url_for(endpoint))
        .accept('json')
        .send(data);
    } else if (method === 'get' || method == 'del') {
      doRequest = request[method](url_for(endpoint))
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
    let promise = new Promise( (resolve, reject) => {

    	doRequest.end( (err, response) => {

    		// console.log('api', response.body);

        let resolveOptions;

	      if (!response.ok) {
	      	let errors = response.body ? response.body.errors : 'Something bad happened';
      		let statusCode = response.status;

      		if (this.errorHandler) this.errorHandler({ statusCode, errors });

          /*
            we resolve promise even if request
            was not successfull to reduce boilerplat
            + because we  typically don't want ui do 
            have some specific behaviour in this case
           */
          resolveOptions = {
            ok: false,
            cancelled: isCancelled,
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
            cancelled: isCancelled,
            body: response.body,
            requestId,            
          };
          
        }

        resolve(resolveOptions);

      });

    });

    /* 
      we return another promise wrapped around superagent
      cause we want to do our own error handling (e.g. display
      error message) and maybe process response before passing
      it back + we make this promise cancellable
     */
    return {
      then: promise.then.bind(promise),
      catch: promise.catch.bind(promise),
      requestId,
      cancel() {
        // console.log('cancelling promise');
        isCancelled = true;
      }
    }

	}
}

export default API;