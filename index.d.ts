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

  static addClassAction(actionName: string | Function, method?: Function): void;

  static addAction(actionName: string | Function, method?: Function): void;

  id: number | string;

  constructor(options: MobxModel.MobxModelSetOptions);

  set(options: MobxModel.MobxModelSetOptions): void;

  urlRoot: string;

  jsonKey: string;

  onInitialize(): void;

  onDestroy(): void;

  toJSON(): object;
}

declare namespace MobxModel {
  export interface MobxModelRelation {
    type: string;
    relatedModel: string;
    reverseRelation?: boolean;
    propertyName?: string;
    topLevelJsonKey?: string;
    foreignKey?: string;
  }

  export interface MobxModelRelationItem {
    foreignKey: string;
    jsonKey: string;
    topLevelJsonKey: string;
    type: string;
    relatedModel: typeof MobxModel;
    propertyName: string;
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

export declare function attribute(target: any, key: string): void;

export declare function relation(
  relationOptions: MobxModel.MobxModelRelation,
): (target: any, key: string) => void;

export default MobxModel;
