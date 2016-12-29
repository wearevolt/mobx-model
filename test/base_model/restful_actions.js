import { expect } from 'chai';
import { BaseModel } from '../../lib/index';
import isFunction from 'lodash/isFunction';


describe('RESTful actions in BaseModel', () => {

  it("should have class static method `load`", function() {
    expect(isFunction(BaseModel.load)).to.equal(true);
  });

  it("should have class static method `create`", function() {
    expect(isFunction(BaseModel.create)).to.equal(true);
  });

  it("should have method `update` in prototype", function() {
    expect(isFunction(BaseModel.prototype.update)).to.equal(true);
  });

  it("should have method `destroy` in prototype", function() {
    expect(isFunction(BaseModel.prototype.destroy)).to.equal(true);
  });

});