import isArray from 'lodash/isArray';
import includes from 'lodash/includes';

interface ISetRelationOptions {
  ids?: (string | number)[];
  modelJson?: any;
  relation: any;
  model: any;
  requestId: any;
  topLevelJson: any;
}

export default function setRelation(options: ISetRelationOptions) {
  const { ids, modelJson, relation, model, requestId, topLevelJson } =
    options || {};

  // if no ids and json was passed, do nothing
  if (!modelJson && ids === undefined) return;

  if (relation.isHasMany) {
    if ((ids && !isArray(ids)) || (modelJson && !isArray(modelJson))) {
      throw new Error(
        `Expected json or ids for ${relation.propertyName} to be an array`,
      );
    }

    const relatedModelIds: (number | string)[] = [];
    const collection = model[relation.propertyName];

    const attributes = modelJson ? modelJson : ids;

    // add new relations to this model
    attributes.forEach((relatedModelAttributes: any) => {
      const options = {
        requestId,
        topLevelJson,
      };

      if (modelJson) {
        Object.assign(options, { modelJson: relatedModelAttributes });
      } else {
        Object.assign(options, { id: relatedModelAttributes });
      }

      const relatedModel = model[relation.setMethodName](options);

      // can be undefined for example if we haven't found
      // id in a separate store
      if (relatedModel) {
        relatedModelIds.push(relatedModel.id);
      }
    });

    // remove relations not in json
    collection.slice().forEach((relatedModel: any) => {
      if (!includes(relatedModelIds, relatedModel.id)) {
        model[relation.removeMethodName](relatedModel);
      }
    });
  } else if (relation.isHasOne) {
    const options = {
      requestId,
      topLevelJson,
    };

    if (modelJson) {
      Object.assign(options, { modelJson });
    } else {
      Object.assign(options, { id: ids });
    }

    // try to set relation
    const relatedModel = model[relation.setMethodName](options);

    // if no related model was returned then reset property
    if (!relatedModel) {
      model[relation.propertyName] = relation.initialValue;
    }
  }
}
