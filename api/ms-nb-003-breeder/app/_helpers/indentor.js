const { nucleusSeedAvailabityModel, userModel, bsp1ProductionCenterModel, labelNumberForBreederseed, generatedLabelNumber } = require('../models');

class indentorHelper {

    static productionCenterName = async (bsp1Id, userId, varietyId) => {
        const productionCenters = await bsp1ProductionCenterModel.findAll({
            attributes: ['id', 'bsp_1_id', 'production_center_id', 'quantity_of_seed_produced', 'members'],
            where: {
                bsp_1_id: bsp1Id,
            },
            raw: true,
        });
        return await Promise.all(productionCenters.map(async productionCenter => {
            const data = await userModel.findOne({
                attributes: ['id', 'name'],
                where: {
                    id: userId,
                },
                order: [['id', 'ASC']],
                raw: true,
            });
            productionCenter.available_nucleus_seed = await indentorHelper.fetchNucleusSeed(productionCenter.production_center_id, varietyId);
            return productionCenter;
        }));

    }

    static fetchNucleusSeed = async (productionCenterId, varietyId) => {
        const data = await nucleusSeedAvailabityModel.findOne({
            attributes: ['id', 'quantity'],
            where: {
                production_center_id: productionCenterId,
                variety_id: varietyId,
            },
            order: [['id', 'ASC']],
            raw: true,
        });
        return data && data.quantity;
    }

    static productionCenters = async (bsp1Id) => {
        const productionCenters = await bsp1ProductionCenterModel.findAll({
            attributes: ['id', 'bsp_1_id', 'quantity_of_seed_produced', 'production_center_id'],
            include: {
                attributes: ['name'],
                model: userModel,
                left: true,
            },
            where: {
                bsp_1_id: bsp1Id,
            },
            raw: true,
            nest: true,
        });
        let allocatedQuantity = productionCenters;
        if (allocatedQuantity.length > 1) {
            const sum = allocatedQuantity.reduce((prev, cur) => prev + Number(cur.quantity_of_seed_produced, 10), 0);
            allocatedQuantity = [];
            allocatedQuantity.push(sum);
        } else {
            const value = allocatedQuantity[0].quantity_of_seed_produced;
            allocatedQuantity = [];
            allocatedQuantity.push(value);
        }
        console.log('productionCenters', productionCenters);
        return {
            quantityOfSeedProduced: allocatedQuantity[0],
            productionCenters: productionCenters
        };

    }

    static labelNumbers = async (cropCode, year, season, cropVariety, user_id) => {
        return await labelNumberForBreederseed.findAll({
            attributes: ['id', 'weight'],
            where: {
                crop_code: cropCode,
                year_of_indent: year,
                season,
                variety_id: cropVariety,
                user_id: user_id
            },
            raw: true,
            nest: true,
        });
    }
    static generatedLabelNumbers = async (id) => {
        return await generatedLabelNumber.findAll({
            // attributes: ['id'],
            where: {
                label_number_for_breeder_seeds: id,
            },
            raw: true,
            nest: true,
        });
    }
    static removeDuplicates(array, key) {
        const uniqueValues = new Set();
        return array.filter(obj => {
            if (!uniqueValues.has(obj[key])) {
                uniqueValues.add(obj[key]);
                return true;
            }
            return false;
        });
    }
}

module.exports = indentorHelper;

