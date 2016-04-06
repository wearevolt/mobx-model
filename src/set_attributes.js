import keys from 'lodash/object/keys';
import { underscore } from 'inflection';

export default function setAttributes(options = {}) {
	let { model, modelJson } = options;

  keys(model.constructor.attributes).forEach(attributeName => {
  	model[attributeName] = modelJson[attributeName] ? modelJson[attributeName] : modelJson[underscore(attributeName)];
  });
}