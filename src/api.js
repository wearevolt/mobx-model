'use strict';

import request from 'superagent';
import qs from 'qs';
import BPromise from 'bluebird';

import pick from 'lodash/pick';
import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';

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

		let { method, data, endpoint, onSuccess, onError, fileData } = options;
    let requestData, requestHeaders, doRequest;

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
		doRequest = request[method](this.urlRoot+endpoint)
                      

    if (isEmpty(fileData)) {
      doRequest.accept('json');
    }

    if (isFunction(this.requestHeaders)) {
      requestHeaders = this.requestHeaders();
    } else {
      requestHeaders = this.requestHeaders;
    }

    Object.keys(requestHeaders).forEach(header => {
      doRequest = doRequest.set(header, requestHeaders[header]);
    });

    // for now do not send any data except files if they are passed
    if (!isEmpty(fileData)) {
      // merge default requestData with object passed with this request
      if (isFunction(this.requestData)) {
  		  requestData = this.requestData();
      } else {
        requestData = this.requestData;
      }

      Object.assign(data, requestData);
    }

    // just send as POST or prepare data for GET request
    if (method === 'post' || method === 'put') {
      if (!isEmpty(fileData)) {
        let formData = new FormData();
        formData.append(fileData.attibuteName, fileData.file);
        doRequest.send(formData);
      } else {
        doRequest.send(data);
      }
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

      		if (this.onRequestError) this.onRequestError(response);          

          onError(response);	        
	      } else {
	      	onSuccess(response);          
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