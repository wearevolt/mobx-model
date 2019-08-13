import { expect } from 'chai';
import * as mobx from 'mobx';
import isFunction from 'lodash/isFunction';

import MobxModel from '../../lib/index';

class TestModel extends MobxModel {
  static modelName = 'TestModel';

  static attributes = {
    value: null,
  };

  static relations = [];
}

const topLevelJson = {
  model: {
    id: 1,
    value: 'foo',
  },
};

const pluginZero = function(target) {
  target.addClassAction('pluginZeroClassAction', function() {
    return { basicClass: this };
  });

  target.addAction('pluginZeroModelAction', function() {
    return { model: this };
  });
};

const pluginOne = function(target, options) {
  target.addClassAction('pluginOneClassAction', function() {
    return { basicClass: this, options };
  });

  target.addAction('pluginOneModelAction', function() {
    return { model: this, options };
  });
};

const functionalPluginOptions = {
  option1: 123,
  option2: 'foo',
  option3: ['bar', { baz: 'buz' }],
};

describe('Plugins', () => {
  MobxModel.config({
    mobx,
    models: { TestModel },
    plugins: [
      pluginZero,
      [pluginOne, { ...functionalPluginOptions }],
      [`${__dirname}/test_plugins/external_plugin`, { ...functionalPluginOptions }],
    ],
  });

  const modelJson = topLevelJson.model;
  const testModel = TestModel.set({ modelJson, topLevelJson });

  describe('Functional plugin without options', () => {
    it('should have class action added by plugin', function() {
      expect(isFunction(MobxModel.pluginZeroClassAction)).to.equal(true);
    });

    it('should have model action added by plugin', function() {
      expect(isFunction(testModel.pluginZeroModelAction)).to.equal(true);
    });
  });

  describe('Functional plugin with options', () => {
    it('should have class action added by plugin', function() {
      expect(isFunction(MobxModel.pluginOneClassAction)).to.equal(true);
    });

    it('class action should return basic class as context and options from plugin configuration', function() {
      const { basicClass, options } = MobxModel.pluginOneClassAction();

      expect(basicClass === MobxModel).to.equal(true);
      expect(options).to.deep.equal(functionalPluginOptions);
    });

    it('should have model action added by plugin', function() {
      expect(isFunction(testModel.pluginOneModelAction)).to.equal(true);
    });

    it('model action should return model as context and options from plugin configuration', function() {
      const { model, options } = testModel.pluginOneModelAction();

      expect(model === testModel).to.equal(true);
      expect(options).to.deep.equal(functionalPluginOptions);
    });
  });

  describe('External plugin', () => {
    it('should have class action added by plugin', function() {
      expect(isFunction(MobxModel.externalPluginClassAction)).to.equal(true);
    });

    it('class action should return basic class as context and options from plugin configuration', function() {
      const { basicClass, options } = MobxModel.externalPluginClassAction();

      expect(basicClass === MobxModel).to.equal(true);
      expect(options).to.deep.equal(functionalPluginOptions);
    });

    it('should have model action added by plugin', function() {
      expect(isFunction(testModel.externalPluginModelAction)).to.equal(true);
    });

    it('model action should return model as context and options from plugin configuration', function() {
      const { model, options } = testModel.externalPluginModelAction();

      expect(model === testModel).to.equal(true);
      expect(options).to.deep.equal(functionalPluginOptions);
    });
  });
});
