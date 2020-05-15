import { MobxModelRelation } from "./mobx_model";

export function attribute(target: any, key: string): void {
  const hasAttributesProperty = target.constructor.hasOwnProperty('attributes');

  if (!hasAttributesProperty) {
    target.constructor.attributes = {};
  }

  target.constructor.attributes[key] = void 0;
}

export function relation(relationOptions: MobxModelRelation) {
  return function(target: any, key: string): void {
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
