import MobxModel, {
  RelationType,
  MobxModelRelationItem,
  MobxModelSetOptions,
} from '../../../../lib/mobx_model';
import ProtoTestModel from './proto-test-model';

class RootModel extends MobxModel {
  constructor() {
    super({ modelJson: {} });
  }

  set(options: MobxModelSetOptions) {
    super.set(options);
  }

  static relations = [
    {
      type: RelationType.hasMany,
      relatedModel: 'Model1',
    },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model2',
    },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model3',
    },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model4',
    },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model5',
    },
    { type: RelationType.hasMany, relatedModel: 'Model6' },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model7',
    },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model8',
    },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model9',
    },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model10',
    },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model11',
    },
    { type: RelationType.hasMany, relatedModel: 'Model12' },
    {
      type: RelationType.hasMany,
      relatedModel: 'Model13',
    },
    { type: RelationType.hasMany, relatedModel: 'Model14' },
  ];

  generateAttributesJson() {
    const json = RootModel.relations.reduce(
      (acc, relation: MobxModelRelationItem) => {
        const { relatedModel, topLevelJsonKey } = relation;

        if (relatedModel.prototype instanceof ProtoTestModel) {
          acc[topLevelJsonKey] = relatedModel.generateAttributesJsonList();
        }

        return acc;
      },
      {},
    );

    return json;
  }

  setRelationsIdsToJson(attributesJson: any) {
    const json = RootModel.relations.reduce(
      (acc, relation: MobxModelRelationItem) => {
        const { relatedModel, jsonKey } = relation;

        if (relatedModel.prototype instanceof ProtoTestModel) {
          acc[jsonKey] = acc[jsonKey].map(item => ({
            ...item,
            ...relatedModel.generateRelationsIds(attributesJson),
          }));
        }

        return acc;
      },
      attributesJson,
    );

    return json;
  }

  generateJson() {
    const attributesJson = this.generateAttributesJson();
    const json = this.setRelationsIdsToJson(attributesJson);

    return json;
  }
}

export default RootModel;
