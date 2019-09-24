/// <reference path="../index.d.ts" />

import { tableize, underscore, camelize } from 'inflection';
import filter from 'lodash/filter';
import uniqueId from 'lodash/uniqueId';
import result from 'lodash/result';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';

import setAttributes from './set_attributes';
import setRelations from './set_relations';
import setRelationsDefaults from './set_relations_defaults';
import setRelatedModel from './set_related_model';
import removeRelatedModel from './remove_related_model';

/*
 * This is a hack to allow each model that extends
 * BaseModel to have its own collection. Model is
 * assigned a collection when first instance of model is
 * created or when Model.all() method is called
 */
const initObservables = function(target: any) {
  if (!target.observables) {
    target.observables = { collection: [] };
  }
};

class MobxModel {
  static $mobx = null;

  static urlRoot: string;
  static jsonKey: string;

  static attributes = {};
  static relations = [];

  static getModel: (modelName: string) => MobxModel;

  id = null;
  lastSetRequestId = null;

  static config(options: any = {}) {
    const { mobx, models = {}, plugins = [] } = options;

    if (!mobx)
      throw Error(
        '"Configuration attribute" `mobx` must be set in MobxModel.config({ mobx })...',
      );

    this.$mobx = mobx;

    this.getModel = function(modelName: string) {
      return models[modelName];
    };

    plugins.forEach((pluginItem: any) => {
      const [plugin, options] = [].concat(pluginItem);

      const pluginFunc = isString(plugin)
        ? require(plugin)
        : isFunction(plugin)
        ? plugin
        : null;

      if (isFunction(pluginFunc)) {
        pluginFunc(this, options);
      }
    });
  }

  static get = function(id: string | number) {
    const items: any[] = result(this, 'observables.collection');

    if (items) {
      let l = items.length;
      for (let i = 0; i < l; i++) {
        if (items[i].id.toString() === id.toString()) return items[i];
      }
    }

    return null;
  };

  static set = function(options: any = {}) {
    const { runInAction } = this.$mobx;

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

    return model;
  };

  static remove = function(model: any) {
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

  static addClassAction(actionName: string | Function, method: Function) {
    const isNameAsFunction = isFunction(actionName);

    if (isNameAsFunction && !(actionName as Function).name)
      throw Error('Class action must have name!');

    if (!isNameAsFunction && !isFunction(method))
      throw Error('Class action method not set!');

    Object.defineProperty(
      this,
      isNameAsFunction ? (actionName as any).name : actionName,
      {
        get: function() {
          return (isNameAsFunction ? (actionName as Function) : method).bind(
            this,
          );
        },
      },
    );
  }

  static addAction(actionName: string | Function, method: Function) {
    const isNameAsFunction = isFunction(actionName);

    if (isNameAsFunction && !(actionName as Function).name)
      throw Error('Action must have name!');

    if (!isNameAsFunction && !isFunction(method))
      throw Error('Action method not set!');

    Object.defineProperty(
      this.prototype,
      isNameAsFunction ? (actionName as any).name : actionName,
      {
        get: function() {
          return (isNameAsFunction ? (actionName as Function) : method).bind(
            this,
          );
        },
      },
    );
  }

  constructor(options: any = {}) {
    let { modelJson, topLevelJson, requestId } = options;

    initObservables(this.constructor);

    if (modelJson && modelJson.id) {
      this.id = modelJson.id;
    }

    this.initAttributes();
    this.initRelations();

    this.onInitialize();
  }

  initAttributes() {
    const { extendObservable } = (this.constructor as typeof MobxModel)
      .$mobx as any;
    extendObservable(this, (this.constructor as typeof MobxModel).attributes);
  }

  initRelations() {
    const model: any = this;
    const { extendObservable } = (this.constructor as typeof MobxModel)
      .$mobx as any;

    // set defaults for relations
    setRelationsDefaults(model);

    (model.constructor as typeof MobxModel).relations.forEach(
      (relation: any) => {
        extendObservable(model, {
          [relation.propertyName]: relation.initialValue,
        });

        // add alias method to set relation to model's instance
        model[relation.setMethodName] = function(options = {}) {
          Object.assign(options, { relation, model });
          return setRelatedModel(options);
        }.bind(model);

        // add alias method to remove relation to model's instance
        model[relation.removeMethodName] = function(relatedModel: any) {
          return removeRelatedModel({
            model,
            relation,
            relatedModel,
          });
        }.bind(model);
      },
    );
  }

  set(options: any = {}) {
    const { runInAction } = (this.constructor as typeof MobxModel).$mobx as any;

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
    return (this.constructor as typeof MobxModel).urlRoot;
  }

  get jsonKey() {
    return (this.constructor as typeof MobxModel).jsonKey;
  }

  onInitialize() {}

  onDestroy() {
    this.destroy();
    console.warn(
      '[mobx-model] onDestroy() method is deprecated. Please use destroy() method instead.',
    );
  }

  destroy() {
    const { runInAction } = (this.constructor as typeof MobxModel).$mobx as any;

    runInAction(() => {
      this.removeSelfFromCollection();
      this.destroyDependentRelations();
      this.removeSelfFromRelations();
    });
  }

  removeSelfFromCollection() {
    (this.constructor as typeof MobxModel).remove(this);
  }

  destroyDependentRelations() {
    let relationsToDestroy = filter(
      (this.constructor as typeof MobxModel).relations,
      (relation: any) => {
        let reverseRelation = relation.reverseRelation;
        return (
          reverseRelation && reverseRelation.onDestroy === 'destroyRelation'
        );
      },
    );

    relationsToDestroy.forEach(relation => {
      if (relation.isHasMany) {
        (this as any)[relation.propertyName]
          .slice()
          .forEach((relatedModel: any) => {
            relatedModel.onDestroy();
          });
      } else if (relation.isHasOne) {
        (this as any)[relation.propertyName].onDestroy();
      }
    });
  }

  removeSelfFromRelations() {
    let relationsToRemoveFrom = filter(
      (this.constructor as typeof MobxModel).relations,
      (relation: any) => {
        let reverseRelation = relation.reverseRelation;
        return reverseRelation && reverseRelation.onDestroy === 'removeSelf';
      },
    );

    relationsToRemoveFrom.forEach(relation => {
      let removeMethodName = relation.reverseRelation.removeMethodName;

      if (relation.isHasMany) {
        (this as any)[relation.propertyName]
          .slice()
          .forEach((relatedModel: any) => {
            if (relatedModel[removeMethodName]) {
              relatedModel[removeMethodName](this);
            }
          });
      } else if (relation.isHasOne) {
        if (
          (this as any)[relation.propertyName] &&
          (this as any)[relation.propertyName][removeMethodName]
        ) {
          (this as any)[relation.propertyName][removeMethodName](this);
        }
      }
    });
  }

  toJSON() {
    const { id, constructor } = this;
    const { attributes, relations } = constructor as typeof MobxModel;

    // collect attributes
    const attributeValues = Object.keys(attributes || {}).reduce(
      (values: any, attributeName) => {
        values[attributeName] = (this as any)[attributeName];
        return values;
      },
      {},
    );

    // collect relation models id
    const relationValues = (relations || []).reduce(
      (values: any, { type, propertyName, foreignKey }) => {
        const camelizedForeignKey = camelize(foreignKey, true);

        if (type === 'hasMany') {
          values[camelizedForeignKey] = (this[propertyName] || [])
            .slice()
            .map((model: MobxModel) => model.id);
        }

        if (type === 'hasOne') {
          values[camelizedForeignKey] = (
            (this as MobxModel)[propertyName] || { id: void 0 }
          ).id;
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
