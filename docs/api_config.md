# API config


You can setup API requests by passing config options to `API.config` method.

```
API.config({
  urlRoot: '/api/v1',
  requestData: { CSRFParam: 'CSRFToken' },
  onRequestError(options) {
    console.log(`API Error ${options.statusCode}`);
  },
  onRequestCompleted(response) {
    console.log('API request completed', response.body);
  }
});
```

### Available config options

| Option | Type | Description |
| -- | -- | -- |
| `urlRoot` | `string` |  |
| `requestData` | `object` |  |
| `requestHeaders` | `object` |  |
| `onRequestError` | `function` |  |
| `onRequestCompleted` | `function` |  |