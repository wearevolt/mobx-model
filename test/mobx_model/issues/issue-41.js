/*****************************************************/
/* https://github.com/wearevolt/mobx-model/issues/41 */
/*****************************************************/

import * as mobx from 'mobx';
import { expect } from 'chai';
import { isFunction } from 'lodash';
import MobxModel from '../../../lib/index';

class IssueModel extends MobxModel {
  static modelName = 'IssueModel';

  static attributes = {
    numberValue: void 0,
    booleanValue: void 0,
    nullValue: void 0,
    voidValue: void 0,

    numberValuePositive: void 0,
    booleanValuePositive: void 0,
  };

  static relations = [];
}

MobxModel.config({
  mobx,
  models: { IssueModel },
});

describe('Issue #41: Wrong boolean attribute value when boolean false set', () => {
  const modelJson = {
    numberValue: 0,
    booleanValue: false,
    nullValue: null,
    voidValue: void 0,

    numberValuePositive: 1,
    booleanValuePositive: true,
  };

  const model = IssueModel.set({ modelJson });

  it('Model number attribute has correct value', function() {
    expect(model.numberValue).to.equal(modelJson.numberValue);
  });

  it('Model boolean attribute has correct value', function() {
    expect(model.booleanValue).to.equal(modelJson.booleanValue);
  });

  it('Model null attribute has correct value', function() {
    expect(model.nullValue).to.equal(modelJson.nullValue);
  });

  it('Model void attribute has correct value', function() {
    expect(model.voidValue).to.equal(modelJson.voidValue);
  });

  it('Model positive number attribute has correct value', function() {
    expect(model.numberValuePositive).to.equal(modelJson.numberValuePositive);
  });

  it('Model positive boolean attribute has correct value', function() {
    expect(model.booleanValuePositive).to.equal(modelJson.booleanValuePositive);
  });
});
