export default function removeRelatedModel(options: any = {}) {
  const { model, relation, relatedModel } = options;

  if (relation.isHasMany) {
    const collection = model[relation.propertyName];
    collection.splice(collection.indexOf(relatedModel), 1);
  } else if (relation.isHasOne) {
    model[relation.propertyName] = relation.initialValue;
  }
}
