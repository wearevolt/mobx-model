import { RelationType } from '../../../../lib/mobx_model';
import ProtoTestModel from './proto-test-model';

class Model1 extends ProtoTestModel {
  static modelName = 'Model1';
  static numberOfItemsInJson = 7165;

  static attributes = {
    attribute1: '',
    attribute2: '',
    attribute3: '',
    attribute4: '',
    attribute5: '',
    attribute6: '',
  };

  static relations = [
    {
      type: RelationType.hasOne,
      relatedModel: 'Model11',
      reverseRelation: true,
    },
  ];
}

export default Model1;
