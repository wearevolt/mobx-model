import * as mobx from 'mobx';
import { expect } from 'chai';
import { isFunction } from 'lodash';
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
  mobx,
  models: { AlphaModel, BettaModel, OmegaModel },
});

describe('toJSON()', () => {
  it('method should exist', function() {
    expect(isFunction(MobxModel.prototype.toJSON)).to.equal(true);
  });

  it('should serialize attributes and related models ID`s', function() {
    const topLevelJson = {
      model: {
        id: 1,
        omega_model_ids: [
          11,
          12,
          13, // not existed
        ],
        value: 'foo',
        betta_model: { id: 2, name: 'bar' },
      },

      omega_models: [
        { id: 11, name: 'Omega bar 11' },
        { id: 12, name: 'Omega bar 12' },
      ],
    };

    const modelJson = topLevelJson.model;
    const model = AlphaModel.set({ modelJson, topLevelJson });

    expect(model.toJSON()).to.deep.equal({
      id: 1,
      value: 'foo',
      bettaModelId: 2,
      omegaModelIds: [11, 12],
    });
  });
});
