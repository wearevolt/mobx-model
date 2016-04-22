# Base model config

You need to config `BaseModel` somewhere, at least to set up a way to resolve related model classes. `BaseModel` is a class all your other models should inherit from, You can also add actions to `BaseModel` that will be shared between all your models, such as common REST actions.

### getModel(modelName)

This method is used to derive model class from its name. We need this method to solve circular dependency problem when models reference each other.

```js
import models from 'models';

BaseModel.getModel = (modelName) => {
  return models[modelName]
}
```

### addClassAction(actionName, fn)

This method is a shortcut to add static method and bind its `this` to a class.

```js
BaseModel.addClassAction('load', function(id) {
  return API.request({
    endpoint: `${this.urlRoot}/${id}`,
    onSuccess: (options = {}) => {
      let { json, requestId } = options;
      this.set({
        modelJson: json[this.jsonKey], 
        topLevelJson: json,
        requestId
      });
    }
  })
});
```


### addAction(actionName, fn)

This method is a shortcut to add instance method and bind its `this` to model instance

```js
BaseModel.addAction('destroy', function() {
  return API.request({
    method: 'del',
    endpoint: `${this.urlRoot}/${this.id}`,
    onSuccess: (options = {}) => {
      let { json, requestId } = options;
      this.onDestroy();
    }
  });
});
```

### Additinal config

You can also add other common behaviour, for example you can add static `init` method to your models that will load cache when your app is loaded, and call it during config time

```js
Object.keys(models).forEach(modelName => {
  if (models[modelName].init) models[modelName].init();
})
```