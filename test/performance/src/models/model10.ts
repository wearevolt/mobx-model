const times = require('lodash/times');
const random = require('lodash/random');

import { RelationType } from '../../../../lib/mobx_model';
import ProtoTestModel, { TestModelAttributeType } from './proto-test-model';

interface IItem1 {
  item1Attribute1: string;
  item1Attribute2: string;
  item1Attribute3: string;
}

interface IItem2 {
  item2Attribute1: string;
  item2Attribute2: string;
  item2Attribute3: string;
  item2Attribute4: string;
}

class Model10 extends ProtoTestModel {
  static modelName = 'Model10';
  static numberOfItemsInJson = 133;

  static attributeTypes = {
    attribute4: TestModelAttributeType.boolean,
  };

  static generateAttributeValue(attributeName: string): any {
    if (attributeName === 'attribute7') {
      return this.generateItem1();
    }

    if (attributeName === 'attribute8') {
      return times(random(5), this.generateItem1);
    }

    if (attributeName === 'attribute9') {
      return times(random(5), this.generateItem2);
    }

    return super.generateAttributeValue(attributeName);
  }

  static generateItem1(): IItem1 {
    return {
      item1Attribute1: ProtoTestModel.generateRandomString(),
      item1Attribute2: ProtoTestModel.generateRandomString(),
      item1Attribute3: ProtoTestModel.generateRandomString(),
    };
  }

  static generateItem2(): IItem2 {
    return {
      item2Attribute1: ProtoTestModel.generateRandomString(),
      item2Attribute2: ProtoTestModel.generateRandomString(),
      item2Attribute3: ProtoTestModel.generateRandomString(),
      item2Attribute4: ProtoTestModel.generateRandomString(),
    };
  }

  static attributes = {
    attribute1: '',
    attribute2: '',
    attribute3: '',
    attribute4: false,
    attribute5: '',
    attribute6: '',
    attribute7: void 0,
    attribute8: [],
    attribute9: [],
  };

  static relations = [
    {
      type: RelationType.hasOne,
      relatedModel: 'Model2',
      reverseRelation: true,
    },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model12',
      reverseRelation: true,
    },
  ];
}

export default Model10;
