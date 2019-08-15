// Type definitions for MobxModel 1.0.0

declare class MobxModel {
  static modelName?: string;

  static attributes: object;
  static relations: MobxModel.MobxModelRelation[];

  static config(options: MobxModel.MobxModelConfigOptions): void;

  static get(id: number | string): object | null;

  static set(options: MobxModel.MobxModelSetOptions): object;

  static remove(model: object): void;

  static all(): object[];

  static addClassAction(actionName: string, method: Function): void;

  static addAction(actionName: string, method: Function): void;

  constructor(options: MobxModel.MobxModelSetOptions);

  set(options: MobxModel.MobxModelSetOptions): object;

  urlRoot: string;

  jsonKey: string;

  onInitialize(): void;

  onDestroy(): void;

  toJSON(): object;
}

declare namespace MobxModel {
  export interface MobxModelRelation {
    type: 'hasOne' | 'hasMany';
    relatedModel: string;
    reverseRelation?: boolean;
    propertyName?: string;
    topLevelJsonKey?: string;
  }

  export interface MobxModelConfigOptions {
    mobx: any;
    models: object;
    plugins?: { (target: typeof MobxModel, options?: object): void }[];
  }

  export interface MobxModelSetOptions {
    modelJson: object;
    topLevelJson?: object;
    requestId?: number | string;
  }
}

export default MobxModel;
