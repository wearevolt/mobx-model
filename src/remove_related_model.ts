interface IRemoveRelatedModelOptions {
  model?: any;
  relation?: any;
  relatedModel?: any;
}

export default function removeRelatedModel(options: IRemoveRelatedModelOptions) {
  const { model, relation, relatedModel } = options || {};

  if (!model || !relation || !relatedModel) return;

  if (relation.isHasMany) {
    const collection = model[relation.propertyName];
    collection.splice(collection.indexOf(relatedModel), 1);
  } else if (relation.isHasOne) {
    model[relation.propertyName] = relation.initialValue;
  }
}
