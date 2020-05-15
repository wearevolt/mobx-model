/*****************************************************/
/* https://github.com/wearevolt/mobx-model/issues/41 */
/*****************************************************/

import * as mobx from 'mobx';
import { expect } from 'chai';
import { isFunction } from 'lodash';
import MobxModel from '../../../lib/index';

class Issue44Model extends MobxModel {
  static modelName = 'Issue44Model';

  static attributes = {
    value: 'Test value',
  };

  static relations = [];
}

MobxModel.config({
  mobx,
  models: { Issue44Model },
});

describe('Issue #44: MobxModel get() method: set nill id arg cause unexpected', () => {
  const modelJson = {
    id: '0',
    value: 'String Id',
  };

  Issue44Model.set({ modelJson: {
      id: 0,
      value: 'String Id',
    },
  });

  Issue44Model.set({ modelJson: {
      id: '0',
      value: 'String Id',
    },
  });

  it('Get model by zero ID', function() {
    const zeroIdModel = Issue44Model.get(0);
    expect(!!zeroIdModel).to.equal(true);
  });

  it('Get model by zero string ID', function() {
    const zeroStrIdModel = Issue44Model.get('0');
    expect(!!zeroStrIdModel).to.equal(true);
  });

  it('Get model by boolean false ID', function() {
    const booleanIdModel = Issue44Model.get(false);
    expect(!!booleanIdModel).to.equal(false);
  });

  it('Get model by undefined ID', function() {
    const undefinedIdModel = Issue44Model.get();
    expect(!!undefinedIdModel).to.equal(false);
  });

  it('Get model by null ID', function() {
    const nullIdModel = Issue44Model.get();
    expect(!!nullIdModel).to.equal(false);
  });
});
