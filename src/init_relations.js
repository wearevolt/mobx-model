import { extendObservable } from 'mobx';

import setRelationsDefaults from './set_relations_defaults';
import removeRelatedModel from './remove_related_model';
import setRelatedModel from './set_related_model';

export default function initRelations(options = {}) {
  let { model } = options;

  // set defaults for relations
  setRelationsDefaults(model);
  
  model.constructor.relations.forEach(relation => {      

    extendObservable(model, { [relation.propertyName]: relation.initialValue });

    // add alias method to set relation to model's instance
    model[relation.setMethodName] = function(options = {}) {
      Object.assign(options, { relation, model });
      return setRelatedModel(options);
    }.bind(model);

    // add alias method to remove relation to model's instance
    model[relation.removeMethodName] = function(relatedModel) {
      return removeRelatedModel({
        model,
        relation, 
        relatedModel
      });
    }.bind(model);

  });
}