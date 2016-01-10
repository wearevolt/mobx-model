export default function removeRelatedModel(options = {}) {
  let { model, relation, relatedModel } = options;

  if (relation.isHasMany) {
    let collection = model[relation.propertyName];
    collection.splice(collection.indexOf(relatedModel), 1);
  } else if (relation.isHasOne) {
    model[relation.propertyName] = relation.initialValue;
  }
}