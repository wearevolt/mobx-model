import { keys } from 'lodash';
import { underscore } from 'inflection';

interface ISetAttributesOptions {
  model: any;
  modelJson: any;
}

export default function setAttributes(options: ISetAttributesOptions): void {
  const { model, modelJson = {} } = options || {};

  if (!model) return;

  keys(model.constructor.attributes).forEach(attributeName => {
    model[attributeName] = modelJson[attributeName]
      ? modelJson[attributeName]
      : modelJson[underscore(attributeName)];
  });
}
