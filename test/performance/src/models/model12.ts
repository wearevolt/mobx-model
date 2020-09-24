import { RelationType } from '../../../../lib/mobx_model';
import ProtoTestModel, { TestModelAttributeType } from './proto-test-model';

class Model12 extends ProtoTestModel {
  static modelName = 'Model12';
  static numberOfItemsInJson = 2605;

  static attributeTypes = {
    attribute5: TestModelAttributeType.boolean,
    attribute6: TestModelAttributeType.boolean,
    attribute7: TestModelAttributeType.number,
    attribute18: TestModelAttributeType.number,
    attribute19: TestModelAttributeType.boolean,
  };

  static attributes = {
    attribute1: '',
    attribute2: '',
    attribute3: '',
    attribute4: '',
    attribute5: false,
    attribute6: false,
    attribute7: 0,
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
    attribute18: 0,
    attribute19: true,
  };

  static relations = [
    {
      type: RelationType.hasOne,
      relatedModel: 'Model14',
      reverseRelation: true,
    },
    {
      type: RelationType.hasOne,
      relatedModel: 'Model2',
      reverseRelation: true,
    },
    {
      type: RelationType.hasOne,
      relatedModel: 'Model10',
      reverseRelation: true,
    },
  ];
}

export default Model12;
