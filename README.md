This is a library to simplify data stores that mimic backend models. It includes class that makes API requests and executes callbacks on success/failure. Model attributes and relations are then updated from server-side json. Note that you will need es6 support with static properties to use mobx-model.

It is not perfect, but it works for us together with Rails + ActiveModel Serializers 0.8.3 on the backend, making work with normalized database structure much easier.  If you want to make it work with your backend setup I'll be glad to help you out.

## TODO

* Add tests
* Add support for polymorphism
* Add support for other JSON formats, such as JSON-api