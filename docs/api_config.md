# API config


You can setup API requests by passing config options to `API.config` method. After that you can use `API.request` in your model actions to make requests to your backend. Basically it's just a wrapper around [superagent](https://github.com/visionmedia/superagent) that returns a promise and reduces the boilerplate code.

```js
API.config({
  urlRoot: '/api/v1',
  requestData: { CSRFParam: 'CSRFToken' },
  requestHeaders() {
  	return { Authorization: `Bearer ${Auth.token}` };
  },
  onRequestError(response) {
    console.log(`API Error ${response.status}`);
  },
  onRequestCompleted(response) {
    console.log('API request completed', response.body);
  }
});
```

### Available config options

| Option | Type | Description |
| -- | -- | -- |
| `urlRoot` | `string` | Prefix that will be added to all your api requests |
| `requestData` | `object` or `function` | An object or a function that returns an object that will be merged with data sent with a request. Note that for now if you will use `fileData` option to upload a file then no data will be sent to server, including `requestData` |
| `requestHeaders` | `object` or `function` | An object or a function that returns an object that will be merged with headers sent with a request |
| `onRequestError` | `function` | Callback that will be called with a superagent response object when request is considered as failed by superagent |
| `onRequestCompleted` | `function` | Callback that will be called with a superagent response object on every request (even failed one) |