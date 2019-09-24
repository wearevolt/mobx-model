import setRelation from './set_relation';

export default function setRelations(options = {}) {

  let { model, modelJson, requestId, topLevelJson } = options;
  
  model.constructor.relations.forEach(relation => {

    let embeddedJson = modelJson[relation.jsonKey];
    let foreignKeys = modelJson[relation.foreignKey];

    options = {
      model,
      relation,
      requestId,
      topLevelJson
    }

    if (embeddedJson) {
      Object.assign(options, { modelJson: embeddedJson });
    } else if (foreignKeys !== undefined) {
      Object.assign(options, { ids: foreignKeys });
    }

    // console.log(relation.propertyName, attributes);
    setRelation(options);

  });

}