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


urlRoot

jsonKey

onDestroy

removeSelfFromCollection

destroyDependentRelations

removeSelfFromRelations

