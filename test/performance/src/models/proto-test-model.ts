import MobxModel, { MobxModelRelation, RelationType } from '../../../../lib';
import { lowercaseFirstLetter } from '../../../../lib/utils';
import { foreign_key, pluralize, singularize, tableize } from 'inflection';
const random = require('lodash/random');
const times = require('lodash/times');
const sample = require('lodash/sample');

export enum TestModelAttributeType {
  string,
  number,
  boolean,
}

export default class ProtoTestModel extends MobxModel {
  static attributes = {};
  static attributeTypes: {
    [name: string]: TestModelAttributeType;
  } = {};
  static relations: MobxModelRelation[] = [];
  static numberOfItemsInJson: number = 5;

  static generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static generateRandomString(): string {
    return times(20, () => random(35).toString(36)).join('');
  }

  static generateRandomNumber(): number {
    return random(100000);
  }

  static generateRandomBoolean(): boolean {
    return sample(true, false);
  }

  static generateAttributeValue(attributeName: string): any {
    const attributeType = this.attributeTypes[attributeName];

    switch (attributeType) {
      case TestModelAttributeType.boolean:
        return ProtoTestModel.generateRandomBoolean();

      case TestModelAttributeType.number:
        return ProtoTestModel.generateRandomNumber();

      case TestModelAttributeType.string:
      default:
        return ProtoTestModel.generateRandomString();
    }
  }

  static generateAttributesJson() {
    const attributesNames = Object.keys(this.attributes);

    const initialJson = {
      id: ProtoTestModel.generateUUID(),
    };

    const json = attributesNames.reduce((acc, attributeName) => {
      const attributeValue = this.generateAttributeValue(attributeName);
      acc[attributeName] = attributeValue;

      return acc;
    }, initialJson);

    return json;
  }

  static generateAttributesJsonList() {
    return times(this.numberOfItemsInJson, () => this.generateAttributesJson());
  }

  static generateRelationsIds(relationsJson: any) {
    const relationsIds = this.relations.reduce((acc, relation) => {
      const isHasMany = relation.type === RelationType.hasMany;

      if (isHasMany) return acc;

      const relationTopLevelJsonKey = this.getRelationTopLevelJsonKey(relation);
      const foreignKey = this.getRelationForeignKey(relation);

      const relatedEntities = relationsJson[relationTopLevelJsonKey];

      const randomEntity = sample(relatedEntities);

      acc[foreignKey] = randomEntity ? randomEntity.id : void 0;

      return acc;
    }, {});

    return relationsIds;
  }

  private static getRelationPropertyName(relation: MobxModelRelation) {
    const relatedModel = MobxModel.getModel(relation.relatedModel);

    let propertyName =
      relation.propertyName ||
      lowercaseFirstLetter(relatedModel.modelName || relatedModel.name);

    if (relation.isHasMany) {
      propertyName = pluralize(propertyName);
    }

    return propertyName;
  }

  private static getRelationTopLevelJsonKey(relation: MobxModelRelation) {
    if (relation.topLevelJsonKey) return relation.topLevelJsonKey;

    const propertyName = this.getRelationPropertyName(relation);

    return tableize(propertyName);
  }

  private static getRelationForeignKey(relation: MobxModelRelation) {
    if (relation.foreignKey) return relation.foreignKey;

    const isHasMany = relation.type === RelationType.hasMany;

    const propertyName = this.getRelationPropertyName(relation);

    if (isHasMany) {
      return foreign_key(singularize(propertyName)) + 's';
    } else {
      return foreign_key(propertyName);
    }
  }
}
