This is a library to simplify data stores that mimic backend models. It includes class that makes API requests and executes callbacks on success/failure. Model attributes and relations are then updated from server-side json. Note that you will need es6 support with static properties to use mobx-model.

It is not perfect, but it works for us together with Rails + ActiveModel Serializers 0.8.3 on the backend, making work with normalized database structure much easier.  If you want to make it work with your backend setup I'll be glad to help you out.

## TODO

* add simple example project with CRUD, relations, auth and router
* add model.toJson method that will by default return foreign key / ids for relations and attributes with underscored keys
* Add model.getAll(ids = []) method that will fetch all cached model instances by id
* Makes sense to make all data in modelJson as attributes, if it's not defined as relations. But we can't do that 
* Add standard restful methods to baseModel
* Dist size is HUGE — 425kb
* Inlude source files in published module
* We can get rid of topLevelJson and requestId in `set` methods, making them optional. They can be added in the first call to this method, if not there yet
* Add tests
* Add support for polymorphism
* Add support for other JSON formats, such as JSON-api
* `del` http method should be `delete`

## Changelog

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