## Changelog

### 0.0.26

Added onInitialize hook for model instances

### 0.0.25

Fixed a bug in setRealation method

### 0.0.24

Updated dependencies to latest versions

### 0.0.23

* file uploads now working, you can supply fileData option like this: `fileData: { attibuteName: 'file', file }`, where attributeName is name of form field that server expects and file is the file object. Note that to data from `data` option won't be sent, as well as no `requestData` from `API.config`

### 0.0.22

* fixed issue with non-updating attributes on subsequent set instace method calls

### 0.0.21

* requestData and requestHeaders in api config can be an object or a function returning object

### 0.0.18

* Allow ids to be non-integer

### 0.0.15

* API onSuccess and onError callbacks are executed with full response object, not just json (which is now response.body)

### 0.0.14

* fixed BaseModel.get bug with mobx 2.0.5

### 0.0.13

* added requestHeaders to api config
* added onError callback to API
* onSuccess and onError now return only json, no requestId elsewhere
* we resolve API promise with whole response object from superagent now
* BaseModel.set static method now works if only { modelJson } was passed
* attributes in JSON can be either camelcased or underscored
* fixed static urlRoot and jsonKey properties for 