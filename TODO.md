## TODO

* add source files to the npm module

* send `data` and `requestData` along with uploaded file, support uploading of multiple files

* do not rely on js class names as they can be mangled during uglification

* add simple example project with CRUD, relations, auth and router

* add model.toJSON method that will by default return foreign key / ids for relations and attributes with underscored keys

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