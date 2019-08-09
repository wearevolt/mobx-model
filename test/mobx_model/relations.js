import { expect } from 'chai';
import MobxModel from '../../lib/index';

class AlphaModel extends MobxModel {
  static attributes = {
    value: null,
  };

  static relations = [
    {
      type: 'hasOne',
      relatedModel: 'BettaModel',
      reverseRelation: true,
    },
    {
      type: 'hasMany',
      relatedModel: 'OmegaModel',
      reverseRelation: true,
    },
  ];
}

class BettaModel extends MobxModel {
  static attributes = {
    name: null,
  };

  static relations = [
    {
      type: 'hasOne',
      relatedModel: 'AlphaModel',
      reverseRelation: true,
    },
  ];
}

class OmegaModel extends MobxModel {
  static attributes = {
    name: null,
  };

  static relations = [
    {
      type: 'hasOne',
      relatedModel: 'AlphaModel',
      reverseRelation: true,
    },
  ];
}

MobxModel.config({
  models: { AlphaModel, BettaModel, OmegaModel },
});

function getAlphaModel() {
  const topLevelJson = {
    alpha_model: {
      id: 1,
      omega_model_ids: [11, 12],
      value: 'foo',
      betta_model: { id: 2, name: 'bar' },
    },

    omega_models: [
      { id: 11, name: 'Omega bar 11' },
      { id: 12, name: 'Omega bar 12' },
    ],
  };
  const modelJson = topLevelJson.alpha_model;
  return AlphaModel.set({ modelJson, topLevelJson });
}

function getOmegaModel() {
  const topLevelJson = {
    omega_model: {
      id: 13,
      name: 'Omega bar 13',
      alpha_model_id: 1,
    },
  };
  const modelJson = topLevelJson.omega_model;
  return OmegaModel.set({ modelJson, topLevelJson });
}

const model = getAlphaModel();
const modelOmega = getOmegaModel();

describe('Relations', () => {
  it('should set model value', function() {
    expect(model.value).to.equal('foo');
  });

  describe('hasOne', () => {
    it('should set `hasOne`-type related model data', function() {
      expect(model.bettaModel.id).to.equal(2);
      expect(model.bettaModel.name).to.equal('bar');
    });

    it('should have reverse related model attribute', function() {
      expect(model.bettaModel.alphaModel.id).to.equal(1);
      expect(model.bettaModel.alphaModel.value).to.equal('foo');
    });
  });

  describe('hasMany', () => {
    it('should set `hasMany`-type related models data', function() {
      expect(!!model.omegaModels).to.equal(true);
      expect(model.omegaModels[0].id).to.equal(11);
      expect(model.omegaModels[0].name).to.equal('Omega bar 11');
      expect(model.omegaModels[1].id).to.equal(12);
      expect(model.omegaModels[1].name).to.equal('Omega bar 12');
    });

    it('should have reverse related model attribute', function() {
      expect(model.omegaModels[0].alphaModel.id).to.equal(1);
      expect(model.omegaModels[0].alphaModel.value).to.equal('foo');
      expect(model.omegaModels[1].alphaModel.id).to.equal(1);
      expect(model.omegaModels[1].alphaModel.value).to.equal('foo');
    });
  });

  describe('Reverse relation', () => {
    it('should have parent AlphaModel related to OmegaModel', function() {
      expect(!!modelOmega).to.equal(true);

      expect(modelOmega.alphaModel.id).to.equal(1);
      expect(modelOmega.alphaModel.value).to.equal('foo');
      expect(modelOmega.alphaModel.omegaModels[2].id).to.equal(13);
      expect(modelOmega.alphaModel.omegaModels[2].name).to.equal(
        'Omega bar 13',
      );
    });
  });
});
