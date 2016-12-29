import API from './api';
import BaseModel from './base_model';

import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';


BaseModel.addClassAction('create', function(attributes) {

  if (isString(attributes)) {
    attributes = { name: attributes }
  }

  return API.request({
    method: 'post',
    data: attributes,
    endpoint: this.urlRoot,
    onSuccess: (options = {}) => {
      const json = options.body;

      let model = this.set({
        modelJson: json[this.jsonKey],
        topLevelJson: json
      });

      if (isFunction(model.afterCreate)) {
        model.afterCreate(options);
      }

    }
  });
});


BaseModel.addClassAction('load', function(id, isIncludeDeleted) {
  return API.request({
    endpoint: `${this.urlRoot}/${id}`,
    data: {
      include_deleted: isIncludeDeleted
    },
    onSuccess: (options = {}) => {
      const json = options.body;

      this.set({
        modelJson: json[this.jsonKey],
        topLevelJson: json
      });

    }
  })
});


BaseModel.addAction('update', function(attributes = {}) {
  return API.request({
    method: 'put',
    data: attributes,
    endpoint: `${this.urlRoot}/${this.id}`,
    onSuccess: (options = {}) => {
      const json = options.body;

      this.set({
        modelJson: json[this.jsonKey],
        topLevelJson: json
      });

      if (isFunction(this.afterUpdate)) {
        this.afterUpdate(options);
      }

    }
  });
});


BaseModel.addAction('destroy', function() {
  return API.request({
    method: 'del',
    endpoint: `${this.urlRoot}/${this.id}`,
    onSuccess: (options = {}) => {
      this.onDestroy();

      if (isFunction(this.afterDestroy)) {
        this.afterDestroy(options);
      }

    }
  });
});

