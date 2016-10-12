import isArray from 'lodash/isArray';
import includes from 'lodash/includes';

export default function setRelation(options = {}) {  

  let {
    ids,
    modelJson,
    relation,
    model,
    requestId,
    topLevelJson
  } = options;

  // console.log('setRelation', relation, ids, modelJson)

  // if no ids and json was passed, do nothing
  if (!modelJson && ids===undefined) return

  if (relation.isHasMany) {

    if ((ids && !isArray(ids)) || (modelJson && !isArray(modelJson))) {
      throw new Error(`Expected json or ids for ${relation.propertyName} to be an array`);
    }

    let relatedModelIds = [];
    let collection = model[relation.propertyName];

    let attributes = modelJson ? modelJson : ids;

    // add new relations to this model
    attributes.forEach(relatedModelAttributes => {

      // console.log('relatedModelAttributes', relatedModelAttributes)

      let options = {
        requestId,
        topLevelJson
      }

      if (modelJson) {
        Object.assign(options, { modelJson: relatedModelAttributes })
      } else {
        Object.assign(options, { id: relatedModelAttributes })
      }

      let relatedModel = model[relation.setMethodName](options);
      
      // can be undefined for example if we haven't found
      // id in a separate store
      if (relatedModel) {
        relatedModelIds.push(relatedModel.id);
      }
      
    });

    // remove relations not in json
    collection.slice().forEach(relatedModel => {
      if (!includes(relatedModelIds, relatedModel.id)) {
        model[relation.removeMethodName](relatedModel);
      }
    });

  } else if (relation.isHasOne) {

    let options = {
      requestId,
      topLevelJson
    }

    if (modelJson) {
      Object.assign(options, { modelJson })
    } else {
      Object.assign(options, { id: ids })
    }

    // try to set relation
    let relatedModel = model[relation.setMethodName](options);

    // if no related model was returned then reset property
    if (!relatedModel) {
      model[relation.propertyName] = relation.initialValue;
    }

  }
}