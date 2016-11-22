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


describe('Relations', () => {

  it("should set model value", function() {
    expect(model.value).to.equal('foo');
  });

  describe('hasOne', () => {

    it("should set `hasOne`-type related model data", function() {
      expect(model.bettaModel.id).to.equal(2);
      expect(model.bettaModel.name).to.equal('bar');
    });

    it("should have reverse related model attribute", function() {
      expect(model.bettaModel.alphaModel.id).to.equal(1);
      expect(model.bettaModel.alphaModel.value).to.equal('foo');
    });

  });

  describe('hasMany', () => {

    it("should set `hasMany`-type related models data", function() {
      expect(!!model.omegaModels).to.equal(true);
      expect(model.omegaModels[0].id).to.equal(11);
      expect(model.omegaModels[0].name).to.equal('Omega bar 11');
      expect(model.omegaModels[1].id).to.equal(12);
      expect(model.omegaModels[1].name).to.equal('Omega bar 12');
    });

    it("should have reverse related model attribute", function() {
      expect(model.omegaModels[0].alphaModel.id).to.equal(1);
      expect(model.omegaModels[0].alphaModel.value).to.equal('foo');
      expect(model.omegaModels[1].alphaModel.id).to.equal(1);
      expect(model.omegaModels[1].alphaModel.value).to.equal('foo');
    });

  });


});
