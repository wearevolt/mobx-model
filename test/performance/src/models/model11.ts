import { RelationType } from '../../../../lib/mobx_model';
import ProtoTestModel from './proto-test-model';

class Model11 extends ProtoTestModel {
  static modelName = 'Model11';
  static numberOfItemsInJson = 3326;

  static attributes = {
    attribute1: '',
    attribute2: '',
    attribute3: '',
    attribute4: '',
    attribute5: '',
    attribute6: '',
    attribute7: '',
    attribute8: '',
  };

  static relations = [
    {
      type: RelationType.hasOne,
      relatedModel: 'Model2',
      reverseRelation: true,
    },
    {
      type: RelationType.hasOne,
      relatedModel: 'Model14',
      reverseRelation: true,
    },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model1',
    },
  ];
}

export default Model11;
