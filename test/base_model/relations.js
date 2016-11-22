import { expect } from 'chai';
import { isFunction } from 'lodash';
import { BaseModel } from '../../src/index';


class Model extends BaseModel {
  static attributes = {
    value: null
  };

  static relations = [
    {
      type: 'hasOne',
      relatedModel: 'OtherModel',
      reverseRelation: true
    }
  ];
}

class OtherModel extends BaseModel {
  static attributes = {
    name: null
  };

  static relations = [
    {
      type: 'hasOne',
      relatedModel: 'Model',
      reverseRelation: true
    }
  ];
}

const models = { Model, OtherModel };


BaseModel.getModel = function(modelName) {
  return models[modelName];
};

const topLevelJson = {
  model: {
    id: 1,
    value: 'foo',
    other_model: {
      id: 2,
      name: 'bar'
    }
  }
};

const modelJson = topLevelJson.model;
const model = Model.set({ modelJson, topLevelJson });


describe('Relations', () => {

  it("should set model value", function() {
    expect(model.value).to.equal('foo');
  });

  it("should set otherModel and its name", function() {
    expect(model.otherModel.name).to.equal('bar');
  });


  it("should have reverse related model attribute", function() {
    expect(model.otherModel.model.value).to.equal('foo');
  });

});
