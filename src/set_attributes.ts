import keys from 'lodash/keys';

const { underscore } = require('inflection');

export default function setAttributes(options: any = {}) {
  let { model, modelJson } = options;

  keys(model.constructor.attributes).forEach(attributeName => {
    model[attributeName] = modelJson[attributeName]
      ? modelJson[attributeName]
      : modelJson[underscore(attributeName)];
  });
}
