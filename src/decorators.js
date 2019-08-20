export function attribute(target, key) {
  const hasAttributesProperty = target.constructor.hasOwnProperty('attributes');

  if (!hasAttributesProperty) {
    target.constructor.attributes = {};
  }

  target.constructor.attributes[key] = void 0;
}

export function relation(relationOptions) {
  return function(target, key) {
    const hasRelationsProperty = target.constructor.hasOwnProperty('relations');

    if (!hasRelationsProperty) {
      target.constructor.relations = [];
    }

    target.constructor.relations.push({
      ...relationOptions,
      propertyName: key,
    });
  };
}
