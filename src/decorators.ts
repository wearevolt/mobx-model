/// <reference path="../index.d.ts" />

import MobxModel from "../index";

export function attribute(target: any, key: string): void {
  const hasAttributesProperty = target.constructor.hasOwnProperty('attributes');

  if (!hasAttributesProperty) {
    target.constructor.attributes = {};
  }

  target.constructor.attributes[key] = void 0;
}

export function relation(relationOptions: MobxModel.MobxModelRelation) {
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
