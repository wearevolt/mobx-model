import setRelation from './set_relation';

export default function setRelations(options: any = {}) {
  const { model, modelJson, requestId, topLevelJson } = options;

  model.constructor.relations.forEach((relation: any) => {
    const embeddedJson = modelJson[relation.jsonKey];
    const foreignKeys = modelJson[relation.foreignKey];

    const options = {
      model,
      relation,
      requestId,
      topLevelJson,
    };

    if (embeddedJson) {
      Object.assign(options, { modelJson: embeddedJson });
    } else if (foreignKeys !== undefined) {
      Object.assign(options, { ids: foreignKeys });
    }

    setRelation(options);
  });
}
