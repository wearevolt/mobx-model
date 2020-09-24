import { RelationType } from '../../../../lib/mobx_model';
import ProtoTestModel from './proto-test-model';

class Model4 extends ProtoTestModel {
  static modelName = 'Model4';
  static numberOfItemsInJson = 32;

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
  };

  static relations = [
    {
      type: RelationType.hasMany,
      relatedModel: 'Model8',
    },
  ];
}

export default Model4;
