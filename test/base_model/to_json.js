import { expect } from 'chai';
import { isFunction } from 'lodash';
import { BaseModel } from '../../src/index';


class AlphaModel extends BaseModel {
  static attributes = {
    value: null
  };

  static relations = [
    {
      type: 'hasOne',
      relatedModel: 'BettaModel',
      reverseRelation: true
    },
    {
      type: 'hasMany',
      relatedModel: 'OmegaModel',
      reverseRelation: true
    }
  ];
}

class BettaModel extends BaseModel {
  static attributes = {
    name: null
  };

  static relations = [
    {
      type: 'hasOne',
      relatedModel: 'AlphaModel',
      reverseRelation: true
    }
  ];
}

class OmegaModel extends BaseModel {
  static attributes = {
    name: null
  };

  static relations = [
    {
      type: 'hasOne',
      relatedModel: 'AlphaModel',
      reverseRelation: true
    }
  ];
}

const models = { AlphaModel, BettaModel, OmegaModel };

BaseModel.getModel = function(modelName) {
  return models[modelName];
};


describe('toJSON()', () => {

  it("method should exist", function() {
    expect(isFunction(BaseModel.prototype.toJSON)).to.equal(true);
  });

  it("should serialize attributes and related models ID`s", function() {

    const topLevelJson = {

      model: {
        id: 1,
        omega_model_ids: [
          11,
          12,
          13 // not existed
        ],
        value: 'foo',
        betta_model: { id: 2, name: 'bar' },
      },

      omega_models: [
        { id: 11, name: 'Omega bar 11' },
        { id: 12, name: 'Omega bar 12' }
      ]

    };

    const modelJson = topLevelJson.model;
    const model = AlphaModel.set({ modelJson, topLevelJson });

     expect(model.toJSON()).to.deep.equal({
       id: 1,
       value: 'foo',
       bettaModelId: 2,
       omegaModelIds: [ 11, 12 ]
     });

  });

});
