import { runInAction } from 'mobx';
import { tableize, underscore, camelize } from 'inflection';
import filter from 'lodash/filter';
import uniqueId from 'lodash/uniqueId';
import result from 'lodash/result';

import initAttributes from './init_attributes';
import setAttributes from './set_attributes';
import initRelations from './init_relations';
import setRelations from './set_relations';

/*
 * This is a hack to allow each model that extends
 * BaseModel to have its own collection. Model is
 * assigned a collection when first instance of model is
 * created or when Model.all() method is called
 */
const initObservables = function(target) {
  if (!target.observables) {
    target.observables = { collection: [] };
  }
};

class MobxModel {
  static attributes = {};
  static relations = [];

  id = null;
  lastSetRequestId = null;

  static get = function(id) {
    let items = result(this, 'observables.collection');
    if (items) {
      let l = items.length;
      for (var i = 0; i < l; i++) {
        if (items[i].id.toString() === id.toString()) return items[i];
      }
    }

    return null;
  };

  static set = function(options = {}) {
    let { modelJson, topLevelJson, requestId } = options;

    /*
      requestId is used to allow models to 
      prevent loops when setting same attributes
      multiple times, we set one if none is set
     */
    if (!requestId) requestId = uniqueId('request_');

    /*
     * topLevelJson is used to get json for models referenced by ids
     */
    if (!topLevelJson) topLevelJson = modelJson;

    let model = this.get(modelJson.id);

    runInAction(() => {
      if (!model) {
        model = new this({
          modelJson,
          topLevelJson,
          requestId,
        });

        this.observables.collection.push(model);
      }

      model.set({ modelJson, topLevelJson, requestId });
    });

    // console.log('set', model)

    return model;
  };

  static remove = function(model) {
    if (this.observables && this.observables.collection) {
      this.observables.collection.splice(
        this.observables.collection.indexOf(model),
        1,
      );
    }
  };

  static all = function() {
    initObservables(this);
    return this.observables.collection.slice();
  };

  static addClassAction(actionName, method) {
    Object.defineProperty(this, actionName, {
      get: function() {
        return method.bind(this);
      },
    });
  }

  static addAction(actionName, method) {
    Object.defineProperty(this.prototype, actionName, {
      get: function() {
        return method.bind(this);
      },
    });
  }

  constructor(options = {}) {
    let { modelJson, topLevelJson, requestId } = options;

    initObservables(this.constructor);

    if (modelJson && modelJson.id) {
      this.id = modelJson.id;
    }

    initAttributes({ model: this });
    initRelations({ model: this });

    this.onInitialize();
  }

  set(options = {}) {
    let { requestId, modelJson, topLevelJson } = options;
    let model = this;

    if (!requestId) requestId = uniqueId('request_');

    if (this.lastSetRequestId === requestId) {
      return;
    } else {
      this.lastSetRequestId = requestId;
    }

    runInAction(() => {
      setAttributes({ model, modelJson });

      setRelations({
        model,
        requestId,
        modelJson,
        topLevelJson,
      });
    });
  }

  get urlRoot() {
    return this.constructor.urlRoot;
  }

  get jsonKey() {
    return this.constructor.jsonKey;
  }

  onInitialize() {}

  onDestroy() {
    runInAction(() => {
      this.removeSelfFromCollection();
      this.destroyDependentRelations();
      this.removeSelfFromRelations();
    });
  }

  removeSelfFromCollection() {
    this.constructor.remove(this);
  }

  destroyDependentRelations() {
    let relationsToDestroy = filter(this.constructor.relations, relation => {
      let reverseRelation = relation.reverseRelation;
      return reverseRelation && reverseRelation.onDestroy === 'destroyRelation';
    });

    relationsToDestroy.forEach(relation => {
      if (relation.isHasMany) {
        this[relation.propertyName].slice().forEach(relatedModel => {
          relatedModel.onDestroy();
        });
      } else if (relation.isHasOne) {
        this[relation.propertyName].onDestroy();
      }
    });
  }

  removeSelfFromRelations() {
    let relationsToRemoveFrom = filter(this.constructor.relations, relation => {
      let reverseRelation = relation.reverseRelation;
      return reverseRelation && reverseRelation.onDestroy === 'removeSelf';
    });

    relationsToRemoveFrom.forEach(relation => {
      let removeMethodName = relation.reverseRelation.removeMethodName;

      if (relation.isHasMany) {
        this[relation.propertyName].slice().forEach(relatedModel => {
          if (relatedModel[removeMethodName]) {
            relatedModel[removeMethodName](this);
          }
        });
      } else if (relation.isHasOne) {
        if (
          this[relation.propertyName] &&
          this[relation.propertyName][removeMethodName]
        ) {
          this[relation.propertyName][removeMethodName](this);
        }
      }
    });
  }

  toJSON() {
    const { id, constructor } = this;
    const { attributes, relations } = constructor;

    // collect attributes
    const attributeValues = Object.keys(attributes || {}).reduce(
      (values, attributeName) => {
        values[attributeName] = this[attributeName];
        return values;
      },
      {},
    );

    // collect relation models id
    const relationValues = (relations || []).reduce(
      (values, { type, propertyName, foreignKey }) => {
        const camelizedForeignKey = camelize(foreignKey, true);

        if (type === 'hasMany') {
          values[camelizedForeignKey] = (this[propertyName] || [])
            .slice()
            .map(model => model.id);
        }

        if (type === 'hasOne') {
          values[camelizedForeignKey] = (this[propertyName] || {}).id;
        }

        return values;
      },
      {},
    );

    return {
      id,
      ...attributeValues,
      ...relationValues,
    };
  }
}

Object.defineProperty(MobxModel, 'urlRoot', {
  get: function() {
    return this._urlRoot
      ? this._urlRoot
      : '/' + tableize(this.modelName || this.name);
  },
  set: function(value) {
    this._urlRoot = value;
  },
});

Object.defineProperty(MobxModel, 'jsonKey', {
  get: function() {
    return this._jsonKey
      ? this._jsonKey
      : underscore(this.modelName || this.name);
  },
  set: function(value) {
    this._jsonKey = value;
  },
});

export default MobxModel;
