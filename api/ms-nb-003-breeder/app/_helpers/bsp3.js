const Sequelize = require('sequelize');
const { bsp3Model, cropModel, cropGroupModel, monitoringTeamModel, labelNumberForBreederseed, generatedLabelNumberModel, bsp1ProductionCenterModel } = require('../models');
const status = require('./status.conf');

class bsp3Helper {
    static maxValueFromColumn = async (user_id, crop_code) => {
        const conditionMaxVal = await bsp3Model.findAll({
            raw: true,
            attributes: [
                Sequelize.fn('MAX', Sequelize.col('user_mapping_id'))
            ],
            where: {
                crop_code,
                user_id
            }
        });

        let userMappingId;

        if (conditionMaxVal && conditionMaxVal.length && conditionMaxVal[0].max) {
            userMappingId = conditionMaxVal[0].max;
        } else {
            const maxVal = await bsp3Model.findAll({
                raw: true,
                attributes: [
                    Sequelize.fn('MAX', Sequelize.col('user_mapping_id'))
                ],
            });
            userMappingId = maxVal[0].max;
            userMappingId += 1;
        }

        return userMappingId;
    }

    static createMembers = async ({ memberData: { teamMembers: formData = [] } = {} }) => {
        // const userMappingId = await bsp3Helper.maxValueFromColumn(formData.user_id, formData.crop_code);
        if (!(formData.length)) {
            return true;
        }
        const userMappingId = await bsp3Helper.maxValueFromColumn(formData[0].user_id, formData[0].crop_code);


        const dataToInsert = await Promise.all(formData.map(async (data) => {
            return {
                address: data.address,
                designation: data.designation,
                institute_name: data.institute_name,
                is_active: data.is_active,
                mobile_number: data.mobile_number,
                name: data.name,
                user_id: data.user_id,
                user_mapping_id: userMappingId
            }
        }));

        const data = await monitoringTeamModel.bulkCreate(dataToInsert);

        if (!(data && data.length)) {
            throw new Error('Sowething went wrong');
        }
        return true;
    }

    static updateMember = async ({ memberData: { teamMembers: formData = [] } = {} }) => {
        formData.forEach(async data => {
            if (data.id) {
                const condition = {
                    where: {
                        id: data.id
                    }
                };
                const isExist = await monitoringTeamModel.count(condition);
                if (!isExist) {
                    throw new Error(status.DATA_NOT_AVAILABLE);
                }
                const dataToUpdate = {
                    address: data.address,
                    designation: data.designation,
                    institute_name: data.institute_name,
                    is_active: data.is_active,
                    mobile_number: data.mobile_number,
                    name: data.name,
                    user_id: data.user_id,
                    user_mapping_id: data.user_mapping_id
                };
                await monitoringTeamModel.update(dataToUpdate, condition);
            } else {
                const userMappingId = await bsp3Helper.maxValueFromColumn(data.user_id, data.crop_code);
                const dataToInsert = {
                    address: data.address,
                    designation: data.designation,
                    institute_name: data.institute_name,
                    is_active: data.is_active,
                    mobile_number: data.mobile_number,
                    name: data.name,
                    user_id: data.user_id,
                    user_mapping_id: userMappingId
                };
                await monitoringTeamModel.create(dataToInsert);
            }
        });

        return true;
    }

    static labelNumber = async (lot_number, variety_id, user_id) => {
        let newLabels = [];
        const labels = await Promise.all(await lot_number.split(",").map(async data => {
            const labelForBreeder = await labelNumberForBreederseed.findAll({
                where: {
                    lot_number_creation_id: data,
                    variety_id,
                    user_id
                },
                raw: true,
            });
            labelForBreeder.map(data1 => {
                newLabels.push(data1);
            });
            return true;
        }));
        if (!labels[0]) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const generatedLabels = await Promise.all(newLabels.map(async label => {
            const generatedLabelNumber = await generatedLabelNumberModel.findAll({
                attributes: ['id', 'generated_label_name'],
                where: {
                    label_number_for_breeder_seeds: label.id,
                },
                raw: true
            });
            if (!(generatedLabelNumber && generatedLabelNumber.length)) {
                label.labels = [];
            }
            label['labels'] = generatedLabelNumber;
            return label['labels'];
        }));
        return generatedLabels[0];
    }

    static labelNumberName = async (lot_number) => {
        const labels = await Promise.all(await lot_number.split(",").map(async id => {
            const label = await generatedLabelNumberModel.findOne({
                attributes: ['id', 'generated_label_name'],
                where: {
                    id,
                },
                raw: true
            });
            return label;
        }));
        return labels;
    }

    static getGroupCode = async (crop) => {
        const groupCode = await cropModel.findOne({
            attributes: ['group_code'],
            where: {
                crop_code: crop
            },
            raw: true,
        })
        return groupCode.group_code;
    }

    static groupName = async (data) => {
        return await Promise.all(await data.map(async el => {
            if (!el.crop_group_code) {
                return true;
            }
            const groupName = await cropGroupModel.findOne({
                attributes: ['group_name'],
                where: {
                    group_code: el.crop_group_code
                }
            });
            el.group_name = groupName.group_name;
            return el;
        }));
    }

    static sumOfAllElements(data, keys) {
        return data.reduce((prev, current) => prev + Number(current[keys], 10), 0);
    }

    static stateCode = (sector) => {
        console.log('sectore', sector);
        switch (sector) {
            case 'NSC':
                return 201
            case 'DADF':
                return 202
            case 'HIL':
                return 203
            case 'IFFDC':
                return 204
            case 'IFFCO':
                return 205
            case 'KRIBHCO':
                return 206
            case 'KVSSL':
                return 207
            case 'NAFED':
                return 208
            case 'NDDB':
                return 209
            case 'NFL':
                return 210
            case 'NHRDF':
                return 211
            case 'SOPA':
                return 212
            case 'NSAI':
                return 213
            case 'Private Company':
                return 213
            case 'PRIVATE':
                return 213
            case 'BBSSL':
                return 214
                
            default:
                break
        }

    }

    // Function to remove duplicates based on a specific key
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

    static removeTwoDuplicates(arr, key1, key2) {
        const uniqueObjects = {};

        arr.forEach(obj => {
            const uniqueKey = obj[key1] + '|' + obj[key2];

            if (!uniqueObjects.hasOwnProperty(uniqueKey)) {
                uniqueObjects[uniqueKey] = obj;
            }
        });

        return Object.values(uniqueObjects);
    }

    static quantityProduced = async (varietyData, userId) => {
        const data = await Promise.all(varietyData.map(async variety => {
            const productionCenter = await bsp1ProductionCenterModel.findAll({
                attributes: ['quantity_of_seed_produced'],
                where: {
                    bsp_1_id: variety.bsp1ids.length ? variety.bsp1ids.split(',') : variety.bsp1ids,
                    production_center_id: userId,
                },
                raw: true,
            });
            console.log('productionCenter', productionCenter);
            const quantityProduced = productionCenter.reduce((prevVal, currVal) => {
                return prevVal + Number(currVal.quantity_of_seed_produced, 10)
            }, 0);
            variety.bsp_1.quantity_of_seed_produced = quantityProduced;
            return variety;
        }));
        return data;
    }

    static removeNestedDuplicates(array, key) {
        const seen = new Set();

        return array.filter((item) => {
            const nestedValue = bsp3Helper.getNestedValue(item, key);

            if (!seen.has(nestedValue)) {
                seen.add(nestedValue);
                return true;
            }

            return false;
        });
    }

    static getNestedValue(obj, key) {
        const keys = key.split('.');
        let value = obj;

        for (const k of keys) {
            if (value[k] === undefined) {
                return undefined;
            }

            value = value[k];
        }

        return value;
    }

    static checkArraysEquality(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false; // Different lengths, not all items can be present
        }

        for (let i = 0; i < arr1.length; i++) {
            if (!arr2.includes(arr1[i])) {
                return false; // Item from arr1 not found in arr2
            }
        }

        return true; // All items present in both arrays
    }

    static sortArray(array) {
        array.sort(function (a, b) {
            // Sort based on the number of objects in the indentor array
            if (b.indenter.length !== a.indenter.length) {
                return b.indenter.length - a.indenter.length;
            }

            // Sort indentor array in ascending order based on name
            a.indenter.sort(function (x, y) {
                return x.name.localeCompare(y.name);
            });

            b.indenter.sort(function (x, y) {
                return x.name.localeCompare(y.name);
            });

            // Sort allocation array based on indentor array's order and indent_quantity array
            for (let i = 0; i < a.indenter.length; i++) {
                if (b.indenter[i].name !== a.indenter[i].name) {
                    return a.indenter[i].name.localeCompare(b.indenter[i].name);
                }

                if (b.indent_quantity[i].indent_quantity !== a.indent_quantity[i].indent_quantity) {
                    return a.indent_quantity[i].indent_quantity - b.indent_quantity[i].indent_quantity;
                }
            }

            return 0; // Objects are equal in terms of sorting criteria
        });

        return array;
    }

}
module.exports = bsp3Helper;