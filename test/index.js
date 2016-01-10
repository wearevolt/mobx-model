import { should } from 'chai';
import { API, BaseModel } from '../src/index';

should();

class Model extends BaseModel {
	static attributes = { value: null };

	static relations = [
		{
			type: 'hasOne',
			relatedModel: 'OtherModel',
			reverseRelation: true
		}
	];
}

class OtherModel extends BaseModel {
	static attributes = { name: null };

	static relations = [
		{
			type: 'hasOne',
			relatedModel: 'Model',
			reverseRelation: true
		}
	];
}

BaseModel.config({ models: { Model, OtherModel } });

let requestId = '';
let topLevelJson = {
	model: {
		value: 'foo',
		other_model: {
			name: 'bar'
		}
	}
};

let modelJson = topLevelJson.model;
let model = Model.set({ modelJson, topLevelJson, requestId });

describe('static #set', () => {
  it('should set model value', () => {
  	model.value.should.equal('foo');
  });

  it('should set otherModel and its name', () => {
  	model.otherModel.name.should.equal('bar');
  });
});