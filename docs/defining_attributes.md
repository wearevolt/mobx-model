# Defining attributes

To use attributes you must extend `BaseModel` class and add static `attributes` property object.

```
import { BaseModel } from 'mobx-model';

class Post extends BaseModel
  static attributes = {
    name: null,
    someAttribute: 'default value'
  }
end
```

Attributes are defined as an object. Each property name is observable property name that will be set on model instance. Value is default attribute value (used when new instance of model is created). When setting/updating attribtues from model JSON attribute names are underscored, e.g. to update `someAttribute` property you must provide `some_attribute` key in model JSON.