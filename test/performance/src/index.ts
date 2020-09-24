import * as mobx from 'mobx';
import * as models from './models';
import { RootModel } from './models';
import MobxModel from '../../../lib';

MobxModel.config({
  mobx,
  models,
});

const rootModel = new RootModel();
const modelJson = rootModel.generateJson();

console.time();
rootModel.set({ modelJson, topLevelJson: modelJson });
console.timeEnd();
