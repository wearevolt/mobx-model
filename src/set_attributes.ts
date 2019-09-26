/// <reference path="../index.d.ts" />

import keys from 'lodash/keys';

interface ISetAttributesOptions {
  model: any;
  modelJson: any;
}

const { underscore } = require('inflection');

export default function setAttributes(options: ISetAttributesOptions): void {
  const { model, modelJson = {} } = options || {};

  if (!model) return;

  keys(model.constructor.attributes).forEach(attributeName => {
    model[attributeName] = modelJson[attributeName]
      ? modelJson[attributeName]
      : modelJson[underscore(attributeName)];
  });
}
