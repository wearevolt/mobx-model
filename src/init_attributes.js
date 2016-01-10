import { extendObservable } from 'mobservable';

export default function initAttributes(options = {}) {
	let { model } = options;
  extendObservable(model, model.constructor.attributes);
}