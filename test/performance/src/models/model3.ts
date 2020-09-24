import { RelationType } from '../../../../lib/mobx_model';
import ProtoTestModel, { TestModelAttributeType } from './proto-test-model';

class Model3 extends ProtoTestModel {
  static modelName = 'Model3';
  static numberOfItemsInJson = 6;

  static attributeTypes = {
    attribute26: TestModelAttributeType.number,
  };

  static attributes = {
    attribute1: '',
    attribute2: 0,
  };

  static relations = [
    {
      type: RelationType.hasMany,
      relatedModel: 'Model2',
      reverseRelation: true,
    },
  ];
}

export default Model3;
