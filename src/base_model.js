import { 
  transaction, extendObservable, isObservableArray, asFlat
} from 'mobx';
import { tableize, underscore } from 'inflection';
import filter from 'lodash/filter';
import isArray from 'lodash/isArray';
import uniqueId from 'lodash/uniqueId';
import result from 'lodash/result';

import initAttributes from './init_attributes';
import setAttributes from './set_attributes';
import initRelations from './init_relations';
import setRelations from './set_relations';

/*
 * This is a hack to allow each model that extends
 * BaseModel to have its own observable collection. Model is
 * assigned an observable collection when first instance of model is
 * created or when Model.all() method is called
 */
const initObservables = function(target) {
  if (!target.observables || !isObservableArray(target.observables.collection)) {
    target.observables = {};
    extendObservable(target.observables, { collection: asFlat([]) });  
  }
}


class BaseModel {

  static attributes = {};
  static relations = [];
  // static observables = {};

  id = null;
  lastSetRequestId = null;  

  // static config = function(options = {}) {
  //   let { models } = options;
  //   this.models = models;
  // };

  /*
   * NOTE: we access internal mobservable array of values to
   * prevent notifying observers when we're just getting single
   * value. This way we'll prevent re-rendering components displaying
   * single model when collection changes
   */
  static get = function(id) {
    let items = result(this, 'observables.$mobx.values.collection.value')   
    if (items && isObservableArray(items)) {
      let l = items.length;
      for(var i = 0; i < l; i++) {
        if (items[i].id.toString() === id.toString()) return items[i];
      } 
    }    

    return null;
  };  

  static set = function(options = {}) {

    // console.log('set static', this.name)

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
    
    transaction(() => {
      if (!model) {
        model = new this({
          modelJson,
          topLevelJson,
          requestId
        });

        this.observables.collection.push(model);
      }

      model.set({ modelJson, topLevelJson, requestId });
    });

    // console.log('set', model)

    return model;
  };

  static remove = function (model) {
    if (this.observables && isObservableArray(this.observables.collection)) {
      this.observables.collection.splice(this.observables.collection.indexOf(model), 1);
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
      }
    });
  };

  static addAction(actionName, method) {
    Object.defineProperty(this.prototype, actionName, {
      get: function() {
        return method.bind(this);
      }
    });
  };
  
  constructor(options = {}) {
    let { 
      modelJson,
      topLevelJson,
      requestId
    } = options;

    
    initObservables(this.constructor)



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

    transaction(() => {
      setAttributes({ model, modelJson });
      
      setRelations({
        model,
        requestId,
        modelJson,
        topLevelJson
      });
    });
  }


  get urlRoot() {
    return this.constructor.urlRoot;
  }

  get jsonKey() {
    return this.constructor.jsonKey;
  }

  onInitialize() {
  }

  onDestroy() {    
    transaction(() => {
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
        })
      } else if (relation.isHasOne) {
        this[relation.propertyName].onDestroy();
      }
    })
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
        })
      } else if (relation.isHasOne) {
        // console.log(relation.propertyName, removeMethodName, this[relation.propertyName])
        if (this[relation.propertyName] && this[relation.propertyName][removeMethodName]) {
          this[relation.propertyName][removeMethodName](this);
        }
      }
    })
  }

}

Object.defineProperty(BaseModel, 'urlRoot', {
  get: function() {
    return this._urlRoot ? this._urlRoot : '/'+tableize(this.name);
  },
  set: function(value) {
    this._urlRoot = value;
  }
});

Object.defineProperty(BaseModel, 'jsonKey', {
  get: function() {
    return this._jsonKey ? this._jsonKey : underscore(this.name);
  },
  set: function(value) {
    this._jsonKey = value;
  }
});


export default BaseModel;