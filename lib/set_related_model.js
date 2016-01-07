import isNumber from 'lodash/lang/isNumber';
import isPlainObject from 'lodash/lang/isPlainObject';
import BaseModel from 'models/base';
import findWhere from 'lodash/collection/findWhere';

export default function setRelatedModel(options = {}) {

  let {
    id,
    modelJson,
    relatedModel,
    model,
    relation,
    requestId,
    topLevelJson,
  } = options;

  let existingRelatedModel;
  // id, json, relatedModel, 

  // console.log('setRelatedModel', modelJson, id, relatedModel)

  if (!id && !modelJson && !relatedModel) return;

  // if only id was passed, try to get json from top level
  if (id && !modelJson) {
    let topLevelModelJson = topLevelJson[relation.topLevelJsonKey];                  
    if (topLevelModelJson) {
      modelJson = findWhere(topLevelModelJson, { id });
    }
  }

  if (!id && modelJson) id = modelJson.id;
  if (!id && relatedModel) id = relatedModel.id;



  // try to find it in array by id if hasMany relation
  if (relation.isHasMany) {
    existingRelatedModel = model[relation.propertyName].find(m => m.id === id);
  // or just check if property is assigned
  } else if (relation.isHasOne) {
    existingRelatedModel = model[relation.propertyName];
    if (existingRelatedModel && existingRelatedModel.id !== id) existingRelatedModel = undefined;
  }




  // if no existing related model was not found 
  if (!existingRelatedModel) {

    // if no related model was passed
    if (!relatedModel) {    

      // if no json passed, then just try to fetch model 
      // with given id from the store, if any
      if (!modelJson) {

        relatedModel = relation.relatedModel.get(id)

      // if not only id was passed in json then do regular
      // processing
      } else {

        // add relation to its store
        relatedModel = relation.relatedModel.set({
          modelJson,
          requestId,
          topLevelJson
        })

      }
    }

    // if we finally got related model, or it was passed
    // add it to relation property
    if (relatedModel) {

      // push new model to array
      if (relation.isHasMany) {
        model[relation.propertyName].push(relatedModel);

      // or just assign it to the property
      } else {
        model[relation.propertyName] = relatedModel;
      }

      // if there is reverse relation, add current model
      // to the related model's reverse relation.
      let reverseRelation = relation.reverseRelation;
      if (reverseRelation) {
        let setReverseRelation = relatedModel[reverseRelation.setMethodName]
        // console.log('reverseRelation', relation, relatedModel, reverseRelation.setMethodName, model)
        if (setReverseRelation) setReverseRelation({ relatedModel: model });
      }

    }

    return relatedModel;

  // if there is existing related model
  } else {

    // update it with json if it was passed
    if (modelJson) {
      existingRelatedModel.set({
        requestId,
        modelJson,
        topLevelJson
      });
    }

    return existingRelatedModel;

  }

}