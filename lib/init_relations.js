import { extendObservable } from 'mobservable';

import setRelationsDefaults from 'lib/set_relations_defaults';
import removeRelatedModel from 'lib/remove_related_model';
import setRelatedModel from 'lib/set_related_model';

export default function initRelations(options = {}) {
  let { model } = options;

  // set defaults for relations
  setRelationsDefaults(model);
  
  model.constructor.relations.forEach(relation => {      

    extendObservable(model, { [relation.propertyName]: relation.initialValue });

    // add alias method to set relation to model's instance
    model[relation.setMethodName] = function(options = {}) {
      Object.assign(options, { relation });
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