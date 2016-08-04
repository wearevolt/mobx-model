# Model instance methods

```js

import { BaseModel } from 'mobx-model';

class Post extends BaseModel {

	static attributes = {
		title: ''
	}

	static relations = [
		{
			type: 'hasMany',
			relatedModel: 'Comment'
		}
	]
	
}

```

## model.set

Set method is used to update model instance's attributes, its relations and attributes of relations recursively. If relation had a `reverseRelation` property defined or set to `true` then this model instance will be made available at `reverseRelation.propertyName`

```js
let json = {
	comments: [
		{
			id: 1,
			content: 'nice post!'
		}
	],
	post: {
		id: 1,
		title: 'new title',
		comment_ids: [1]
	}
}

let post = Post.get(1);
post.set({ modelJson: json.post, topLevelJson: json });
```

#### Options

| option | type | description |
| -- | -- | -- |
| `modelJson` | `object` | Json with model's attributes. It can contain either ids of relations deisgnated by the relation `foreignKey` property, or embedded json for relations designated by `jsonKey` property in relation config  |
| `topLevelJson` | `object` | When looking up relations referenced by ids `topLevelJsonKey` relation config property is used to find object in `topLevelJson` that contains related objects |


## model.urlRoot, model.jsonKey

Just couple of shorthand methods that returns prefix for model's RESTful methods and model's key to find its attributes in JSON. Both methods are usually used in server actions

```js
class Post extends BaseModel {

	update(attributes = {}) {
	  return API.request({
	    method: 'put',
	    data: attributes,
	    endpoint: `${this.urlRoot}/${this.id}`,
	    onSuccess: (response) => {
	    	let json = response.body;
	      this.set({ modelJson: json[this.jsonKey] });
	    }
	  });
	}

}

```

### model.onInitialize

This is a hook called when model instance is initialized.
Redefine it in your models to add functionality to each model instance, such as custom observable attribute

```
class Model extends BaseModel {
	onInitialize() {
		this.observableMeta = observable({
			action: null,
			someStuff: null
		})
	}
}
```

### model.onDestroy

This is a shorthand method that calls all methods listed below — `removeSelfFromCollection`, `destroyDependentRelations`, `removeSelfFromRelations`. It does all cleanup that is neccessary when model is being destroyed.

### model.removeSelfFromCollection

Removes this model instance from collection of cached models of this class

### model.destroyDependentRelations

Finds relations that have `onDestroy: 'destroyRelation'` config option and calls `onDestroy` method on those relations, removing them from model cache.

### model.removeSelfFromRelations

Finds relations that have `onDestroy: 'removeSelf'` config option set (which is default) and removes this model instance from those relation model instances



