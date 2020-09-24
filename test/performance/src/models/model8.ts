import { RelationType } from '../../../../lib/mobx_model';
import ProtoTestModel from './proto-test-model';

class Model8 extends ProtoTestModel {
  static modelName = 'Model8';
  static numberOfItemsInJson = 71;

  static attributes = {
    attribute1: '',
  };

  static relations = [
    { type: RelationType.hasMany, relatedModel: 'Model5' },
    { type: RelationType.hasMany, relatedModel: 'Model7' },
    {
      type: RelationType.hasOne,
      relatedModel: 'Model4',
      reverseRelation: true,
    },
  ];
}

export default Model8;
