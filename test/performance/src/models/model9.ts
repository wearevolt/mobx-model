import { RelationType } from '../../../../lib/mobx_model';
import ProtoTestModel from './proto-test-model';

class Model9 extends ProtoTestModel {
  static modelName = 'Model9';
  static numberOfItemsInJson = 46;

  static relations = [
    {
      type: RelationType.hasOne,
      relatedModel: 'Model2',
      reverseRelation: true,
    },
  ];

  static attributes = {
    attribute1: '',
    attribute2: '',
    attribute3: '',
    attribute4: '',
  };
}

export default Model9;
