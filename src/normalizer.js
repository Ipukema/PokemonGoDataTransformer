import { BadgeNormalizer, ItemNormalizer, PokemonNormalizer, MoveNormalizer } from './normalizers/index.js';
import _ from 'lodash';
import fs from 'fs';

class Normalizer {

    static Save(type, data) {
        const dir = 'output';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.writeFile('output/' + type + '.json', JSON.stringify(data));
    }
    static Normalize(data, pokemonGoDataGraber) {
        const groupedAssets = _.chain(data.Items)
            .map(item => {
                const keys = Object.keys(item);
                const itemType = keys.find(k => k !== 'TemplateId');
                return {
                    type: itemType,
                    id: item.TemplateId,
                    data: item[itemType]
                };
            })
            .groupBy('type')
            .value();
        let Moves = MoveNormalizer.Normalize(groupedAssets.Move);
        this.Save('Badge', BadgeNormalizer.Normalize(groupedAssets.Badge));
        this.Save('Item', ItemNormalizer.Normalize(groupedAssets.Item));
        this.Save('Move', Moves);
        this.Save('Pokemon', PokemonNormalizer.Normalize(groupedAssets.Pokemon, Moves, pokemonGoDataGraber));
    }
}

module.exports = Normalizer;