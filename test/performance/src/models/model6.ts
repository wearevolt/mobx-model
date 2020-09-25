const times = require('lodash/times');
const random = require('lodash/random');

import ProtoTestModel, { TestModelAttributeType } from './proto-test-model';
import { RelationType } from '../../../../lib/mobx_model';

interface IItem {
  itemAttribute1: string;
  itemAttribute2: number;
}

class Model6 extends ProtoTestModel {
  static modelName = 'Model6';
  static numberOfItemsInJson = 26;

  static attributeTypes = {
    attribute24: TestModelAttributeType.number,
  };

  static generateAttributeValue(attributeName: string): any {
    if (attributeName === 'attribute5') {
      const values: IItem[] = times(random(6), () => ({
        itemAttribute1: ProtoTestModel.generateRandomString(),
        itemAttribute2: ProtoTestModel.generateRandomNumber(),
      }));

      return values;
    }

    return super.generateAttributeValue(attributeName);
  }

  static attributes = {
    attribute1: '',
    attribute2: '',
    attribute3: '',
    attribute4: '',
    attribute5: [],
    attribute6: '',
    attribute7: '',
    attribute8: '',
    attribute9: '',
    attribute10: '',
    attribute11: '',
    attribute12: '',
    attribute13: '',
    attribute14: '',
    attribute15: '',
    attribute16: '',
    attribute17: '',
    attribute18: '',
    attribute19: '',
    attribute20: '',
    attribute21: '',
    attribute22: '',
    attribute23: '',
    attribute24: 0,
    attribute25: '',
    attribute26: '',
    attribute27: '',
    attribute28: '',
    attribute29: '',
    attribute30: '',
  };

  static relations = [
    { type: RelationType.hasMany, relatedModel: 'Model5' },
    { type: RelationType.hasMany, relatedModel: 'Model7' },
  ];
}

export default Model6;
