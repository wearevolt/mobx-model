import setRelation from './set_relation';

interface ISetRelationsOptions {
  model: any;
  modelJson: any;
  topLevelJson: any;
  requestId: any;
}

export default function setRelations(options: ISetRelationsOptions): void {
  const { model, modelJson, requestId, topLevelJson } = options || {};

  if (!model || !modelJson) return;

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
