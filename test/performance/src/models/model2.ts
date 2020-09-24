import { RelationType } from '../../../../lib/mobx_model';
import ProtoTestModel, { TestModelAttributeType } from './proto-test-model';

class Model2 extends ProtoTestModel {
  static modelName = 'Model2';
  static numberOfItemsInJson = 115;

  static attributeTypes = {
    attribute26: TestModelAttributeType.boolean,
  };

  static attributes = {
    attribute1: '',
    attribute2: '',
    attribute3: '',
    attribute4: '',
    attribute5: '',
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
    attribute24: '',
    attribute25: '',
    attribute26: false,
    attribute27: '',
    attribute28: '',
    attribute29: '',
    attribute30: '',
  };

  static relations = [
    {
      type: RelationType.hasOne,
      relatedModel: 'Model3',
      reverseRelation: true,
    },
    { type: RelationType.hasMany, relatedModel: 'Model12' },
    { type: RelationType.hasMany, relatedModel: 'Model5' },
    { type: RelationType.hasMany, relatedModel: 'Model11' },
    { type: RelationType.hasMany, relatedModel: 'Model7' },
    {
      type: RelationType.hasOne,
      relatedModel: 'Model9',
    },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model10',
    },
  ];
}

export default Model2;
