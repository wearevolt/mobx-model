import { RelationType } from '../../../../lib/mobx_model';
import ProtoTestModel from './proto-test-model';

class Model5 extends ProtoTestModel {
  static modelName = 'Model5';
  static numberOfItemsInJson = 1508;

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

export default Model5;
