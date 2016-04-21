# Mobx-model

This is a library to simplify mobx data stores that mimic backend models. It includes simple class that makes API requests and executes callbacks on success/failure. Model attributes and relations are then updated from server-side json. Note that you will need es6 support with static properties to use mobx-model.

The idea is to have single source of truth — graph of model objects that reference each other. Each model class holds collection of cached model instances available through `Model.all()` method. Instead of changing attributes and relations directly on models, that mobx surely supports, we use actions defined in models, that send a request to server and then update model data. 

This library is not perfect, but it works for us together with Rails + ActiveModel Serializers 0.8.3 on the backend, making work with normalized database structure much easier.  If you want to make it work with your backend setup I'll be glad to help you out.

Note that currently polymorphic associations are not supported, though there are some workarounds.