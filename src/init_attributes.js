import { extendObservable } from 'mobx';

export default function initAttributes(options = {}) {
	let { model } = options;
  extendObservable(model, model.constructor.attributes);
}