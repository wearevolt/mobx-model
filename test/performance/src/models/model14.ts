import { RelationType } from '../../../../lib/mobx_model';
import ProtoTestModel, { TestModelAttributeType } from './proto-test-model';

class Model14 extends ProtoTestModel {
  static modelName = 'Model14';
  static numberOfItemsInJson = 40;

  static attributeTypes = {
    attribute4: TestModelAttributeType.boolean,
  };

  static attributes = {
    attribute1: '',
    attribute2: '',
    attribute3: '',
    attribute4: false,
  };

  static relations = [
    {
      type: RelationType.hasMany,
      relatedModel: 'Model12',
      reverseRelation: true,
    },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model11',
      reverseRelation: true,
    },
  ];
}

export default Model14;
