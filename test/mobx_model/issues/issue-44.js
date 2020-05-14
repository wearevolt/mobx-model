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

  it('Get model by undefined ID', function() {
    const zeroUndefinedIdModel = Issue44Model.get();
    expect(!!zeroUndefinedIdModel).to.equal(false);
  });

  it('Get model by null ID', function() {
    const zeroNullIdModel = Issue44Model.get();
    expect(!!zeroNullIdModel).to.equal(false);
  });
});
