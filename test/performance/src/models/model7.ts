import { RelationType } from '../../../../lib/mobx_model';
import ProtoTestModel from './proto-test-model';

class Model7 extends ProtoTestModel {
  static modelName = 'Model7';
  static numberOfItemsInJson = 239;

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
  };

  static relations = [
    {
      type: RelationType.hasOne,
      relatedModel: 'Model2',
      reverseRelation: true,
    },
    {
      type: RelationType.hasOne,
      relatedModel: 'Model6',
      reverseRelation: true,
    },
    {
      type: RelationType.hasOne,
      relatedModel: 'Model8',
      reverseRelation: true,
    },
  ];
}

export default Model7;
