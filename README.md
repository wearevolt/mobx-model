# Mobx-model 1.0 [![npm version](https://badge.fury.io/js/mobx-model.svg)](https://badge.fury.io/js/mobx-model)

This is a library to simplify [mobx](https://github.com/mobxjs/mobx) data stores that mimic backend models. It includes simple class that makes API requests and executes callbacks on success/failure. Model attributes and relations are then updated from server-side json. Note that you will need es6 support with static properties to use mobx-model.

The idea is to have single source of truth — graph of model objects that reference each other. Each model class holds collection of cached model instances available through `Model.all()` and `Model.get(:id)` methods.

Mobx-model is not a replacement for Backbone.Model since it supports single source of truth principle. Model instance methods that are created by defining attributes and relations are intended to be used as a way to access state of the models. To hydrate the state you have to use `set` method on an instance or a class, that will set or update your model attributes and trigger re-renders on appropriate components thanks to `mobx-react`.

You can also define actions on model classes or instances or on the `BaseModel` itself that will communicate with your data store — API, localstorage or whatever you need, just make sure to call `set` when you need to update state of the models.

This library is not perfect, but it works for us together with Rails + ActiveModel Serializers 0.8.3 on the backend, making work with normalized database structure much easier. If you want to make it work with your backend setup then raise an issue — I'll be glad to help you out to make library universal.

Note that currently polymorphic associations are not supported, though there are some workarounds.
