import { upperCaseFirstLetter, lowercaseFirstLetter } from './utils';
import {
  pluralize, underscore, tableize, foreign_key,
  singularize
} from 'inflection';
import isBoolean from 'lodash/isBoolean';
import isString from 'lodash/isString';

// mutate static relations and add defaults
// to each relation
export default function setRelationsDefaults(model) {

  if (!model.constructor.getModel) {
    throw new Error("getModel static method must be defined for a \
                     base model class, that returns model class given its name")
  }

  model.constructor.relations.forEach(relation => {

    if (relation._isPrepared) return;

    // console.log('setRelationsDefaults', model, relation)   

    // shorthand method to quickly check if relation is of hasMany type
    Object.defineProperty(relation, "isHasMany", {
      get: function() {
        return this.type === 'hasMany'
      }
    });

    // shorthand method to quickly check if relation is of hasOne type
    Object.defineProperty(relation, "isHasOne", {
      get: function() {
        return this.type === 'hasOne'
      }
    });

    // set initialValue for relation property
    if (relation.isHasMany) {
      relation.initialValue = [];
    } else if (relation.isHasOne) {
      relation.initialValue = null;
    }

    if (isString(relation.relatedModel)) {
      relation.relatedModel = model.constructor.getModel(relation.relatedModel);
    }

    // property name on model instance to relation(s)
    if (!relation.propertyName) {
      relation.propertyName = lowercaseFirstLetter(relation.relatedModel.name);

      if (relation.isHasMany) {
        relation.propertyName = pluralize(relation.propertyName)
      }
    }

    // json key for embedded json
    if (!relation.jsonKey) {
      relation.jsonKey = underscore(relation.propertyName);
    }

    // key in top level json
    if (!relation.topLevelJsonKey) {
      relation.topLevelJsonKey = tableize(relation.propertyName);
    }

    // foreign key with ids of relations
    if (!relation.foreignKey) {
      if (relation.isHasMany) {
        relation.foreignKey = foreign_key(singularize(relation.propertyName)) + 's';
      } else if (relation.isHasOne) {
        relation.foreignKey = foreign_key(relation.propertyName);
      }
    }

    let name = upperCaseFirstLetter(relation.propertyName);
    if (relation.isHasMany) name = singularize(name);

    // method name to add single relation, will be used as alias
    if (!relation.setMethodName) {      
      relation.setMethodName = `set${name}`;
    }

    // method name to remove single relation, will be used as alias
    if (!relation.removeMethodName) {
      relation.removeMethodName = `remove${name}`;
    }

    let reverseRelation = relation.reverseRelation;

    if (reverseRelation) {      

      if (isBoolean(reverseRelation)) {
        reverseRelation = relation.reverseRelation = {};
      }

      if (!reverseRelation.onDestroy && reverseRelation.onDestroy !== false) {
        reverseRelation.onDestroy = 'removeSelf'
      }

      if (!reverseRelation.propertyName) {
        reverseRelation.propertyName = lowercaseFirstLetter(model.constructor.name);
      }

      let name = upperCaseFirstLetter(reverseRelation.propertyName);

      if (!reverseRelation.setMethodName) {        
        reverseRelation.setMethodName = `set${name}`;
      }

      if (!reverseRelation.removeMethodName) {        
        reverseRelation.removeMethodName = `remove${name}`;
      }

      //console.log('setRelationsDefaults reverseRelation is true', relation.reverseRelation, relation)

    }

    relation._isPrepared = true;

  });

}