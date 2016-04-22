# Defining relations

To use relations you must extend `BaseModel` class and add static `relations` property

```js
import { BaseModel } from 'mobx-model';

class Post extends BaseModel
  static relations = [
    {
      type: 'hasMany',
      relatedModel: 'Comments'
    }
  ]
end
```

## Relation config options

Note that if config option has a default it can be ommitted when declaring relations. Note that defaults are dynamic, so that you can incrementally override defautls as you need.

| option | type | default | description |
| -- | -- | -- | -- |
| `type` | `string` |  | Can be `hasOne` or `hasMany`. An observable property defined by `propertyName` will be added to instance of model. If relation is `hasMany` an observable array will be added |
| `relatedModel` | `string` |  | Name of the model that will be supplied to `getModel` method to get related model class. We need this due to circular dependency problem when models refer to each other  |
| `propertyName` | `string` | `relatedModel` with lowercased first letter for `hasOne` and is further pluralized for `hasMany` | Name of the property that will be set on model instance. For example if model is `Post` and `relatedModel` is `BestComment` then when relation is `hasOne` propertyName defaults to `bestComment`. When relation is `hasMany` it defaults to `bestComments` and can be later accessed with `post.bestComments`  |
| `jsonKey` | `string` | uderscored `propertyName` | Is used to get relation json from provided model json. When `propertyName` is `bestComments` relation json by default is expected to be under `best_comments` key, and when `propertyName` is `bestComment` then it defaults to `best_comment` |
| `topLevelJsonKey` | `string` | tableized `propertyName` | Is used to get relation json from normalized array of objects in top level. if `propertyName` is `bestComments` than by default top level json must have `best_comments` key that is an array of objects   |
| `foreignKey` | `string` | foreign key derived from `propertyName` | Used to look up relation ids in model json, that later will be used to find relation json in top level defined by `topLevelJsonKey`. If `propertyName` is `bestComment` and relation type is `hasOne` then `foreignKey` defaults to `best_comment_id`. If `propertyName` is `bestComments` and relation type is `hasMany` then `foreignKey` defaults to `best_comment_ids` |
| `setMethodName` | `string` | `set` + singularized `propertyName` with uppercased first letter | Name of the instance method to set related model, for `Post` that `hasMany` `Comment` it will default to `setComment`  |
| `removeMethodName` | `string` | `remove` + singularized `propertyName` with uppercased first letter | Name of the instance method to remove related model, for `Post` that `hasMany` `Comment` it will default to `removeComment` |
| `reverseRelation` | `boolean` or `object` | `false` | If set to true or to an object then related model will have a property defined by `reverseRelation.propertyName` be set to this model instance. E.g. `Post` that `hasMany` `Comment` and `reverseRelation: true` will make `comment.post` available if `Post` relation is also set for `Comment` as `hasOne` relation |


## Reverse relation config options

| option | type | default | description |
| -- | -- | -- | -- |
| `onDestroy` | `string` | `removeSelf` | Can be `removeSelf` or `destroyRelation`. Defines what needs to be done when relation is destroyed. When option is `removeSelf` this model will be removed from reverse relation, e.g. a comment will be removed from list of comments for a post. When it is set to `destroyRelation` then related model will be destroyed when this model is destroyed, e.g. when deleting a post we can delete all related comments. |
| `propertyName` | `string` | this model's name with lowercased first letter | {roperty name to set or remove on reverse relation. If `Post` has `Comment` then defaulP `reverseRelation.propertyName` will be `post`. Note that it should be singular even for `hasMany` relations  |
| `setMethodName` | `string` | `set` + `reverseRelation.propertyName` with uppercased first letter  | Instance method name on related model to set reverse relation. For `Post` that `hasMany` `Comment` it will default to `setPost`  |
| `removeMethodName` | `string` | `remove` + `reverseRelation.propertyName` with uppercased first letter  | Instance method name on related model to remove reverse relation. For `Post` that `hasMany` `Comment` it will default to `removePost`  |