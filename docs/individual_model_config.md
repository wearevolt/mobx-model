# Individual model config

```js
export default class Post extends BaseModel {

	static urlRoot = '/posts';

	static jsonKey = 'post';

	static relations = [
		{
			type: 'hasMany',
			relatedModel: 'Comment'
		}
	];
	
	static attributes = {
		title: null,
		createdAt: null
	}

}
```

## Model config options

Most of the options are not needed to be defined manually as defaults can be used for RESTful API. Note that these config options must be defined as es6 static variables on a model class.

| option | type | default | description |
| -- | -- | -- | -- |
| `urlRoot` | `string` | tableized model class name with a prepending slash, e.g. for `Post` model it will be `/posts` | Can be used in model actions as a prefix for API endpoints |
| `jsonKey` | `string` | underscored model class name, e.g. for `Post` model it will be `post` | Can be used in model actions to find object containing model json |
| `attributes` | `object` |  | An object describing model attributes, read more on [defining attributes](defining_attributes.md) |
| `relations` | `array` |  | An array of objects describing model's relations with other models, read more on [defining relations](defining_relations.md) |