'use strict';

import request from 'superagent';
import qs from 'qs';
import BPromise from 'bluebird';
import pick from 'lodash/object/pick';

BPromise.config({
  warnings: true,
  longStackTraces: true,
  cancellation: true
});


const API = {

  config(options = {}) {
    Object.assign(this, pick(options, [
      'onRequestError',
      'onRequestCompleted',
      'requestData',
      'requestHeaders',
      'urlRoot'
    ]))
  },
	
	request(options = {}) {

		let { method, data, endpoint, onSuccess, onError } = options;    

		if (!method) { method = 'get' }
		if (!data) { data = {} }
		if (!endpoint) {
			throw new Error('Please provide an endpoint for an API call');
		}

		if (!onSuccess) {
			onSuccess = (options) => { }
		}

    if (!onError) {
      onError = (options) => { }
    }

    // set headers
		let doRequest = request[method](this.urlRoot+endpoint)
                      .accept('json')

    Object.keys(this.requestHeaders).forEach(header => {
      doRequest = doRequest.set(header, this.requestHeaders[header]);
    });

    // merge default requestData with object passed with this request
		Object.assign(data, this.requestData);

    // just send as POST or prepare data for GET request
    if (method === 'post' || method === 'put') {      
      doRequest.send(data);
    } else if (method === 'get' || method == 'del') {
      doRequest.query(
        qs.stringify(
          data,
          { arrayFormat: 'brackets' }
        )
      );
    }

    return new BPromise( (resolve, reject) => {

      // send request and act upon result
    	doRequest.end( (err, response) => {
        if (this.onRequestCompleted) this.onRequestCompleted(response);
        
	      if (!response.ok) {
	      	let errors = response.body ? response.body.errors : 'Something bad happened';
      		let statusCode = response.status;

      		if (this.onRequestError) this.onRequestError({ statusCode, errors });          

          onError(response.body);	        
	      } else {
	      	onSuccess(response.body);          
        }

        /*
          we resolve promise even if request
          was not successfull to reduce boilerplat
          + because we  typically don't want ui do 
          have some specific behaviour in this case
         */        

        resolve(response);

      });

    });

	}
}

export default API;