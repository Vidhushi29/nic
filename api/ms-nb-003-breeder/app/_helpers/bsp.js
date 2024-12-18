const pagination = ({ formData }) => {

    let condition = {};
    let { page, pageSize, search } = formData;
    if (page === undefined) page = 1;
    if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing

    if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
    }

    const sortOrder = formData.sort ? formData.sort : 'updated_at';
    const sortDirection = formData.order ? formData.order : 'DESC';


    condition.order = [[sortOrder, sortDirection]];
    if (search) {
        const { yearOfIndent: year, cropName, season, cropGroupCode, cropVariety, userId, isDraft: isdraft = 0, icar_freeze } = formData.search;

        condition.where = {
            user_id: userId,
            isdraft,
            // icar_freeze
        }

        if (userId && year) {
            condition.where.year = year;
        }
        if (icar_freeze) {
            condition.where.icar_freeze = icar_freeze;
        }

        if (userId && cropName) {
            condition.where.crop_code = cropName;
        }


        if (userId && cropVariety) {
            condition.where.variety_id = cropVariety;
        }

        if (userId && cropGroupCode) {
            condition.where.crop_group_code = cropGroupCode;
        }

        if (userId && season) {
            condition.where.season = season;
        }

        if (userId && cropVariety && year) {
            condition.where.variety_id = cropVariety;
            condition.where.year = year;
        }

        if (userId && cropVariety && year && season) {
            condition.where.variety_id = cropVariety;
            condition.where.year = year;
            condition.where.season = season;
        }

        if (userId && cropVariety && year && cropGroupCode) {
            condition.where.variety_id = cropVariety;
            condition.where.year = year;
            condition.where.crop_group_code = cropGroupCode;
        }

        if (userId && cropName && year && cropGroupCode) {
            condition.where.crop_code = cropName;
            condition.where.year = year;
            condition.where.crop_group_code = cropGroupCode;
        }

        if (userId && cropName && year && season) {
            condition.where.crop_code = cropName;
            condition.where.year = year;
            condition.where.season = season;
        }

        if (userId && cropName && year) {
            condition.where.crop_code = cropName;
            condition.where.year = year;
        }

        if (userId && cropName && cropVariety) {
            condition.where.crop_code = cropName;
            condition.where.variety_id = cropVariety;
        }

        if (userId && cropName && cropVariety && season) {
            condition.where.crop_code = cropName;
            condition.where.variety_id = cropVariety;
            condition.where.season = season;
        }

        if (userId && cropName && cropVariety && cropGroupCode) {
            condition.where.crop_code = cropName;
            condition.where.variety_id = cropVariety;
            condition.where.crop_group_code = cropGroupCode;
        }

        if (userId && year && cropName && cropVariety) {
            condition.where.year = year;
            condition.where.crop_code = cropName;
            condition.where.variety_id = cropVariety;
        }

        if (userId && year && cropName && cropVariety && cropGroupCode) {
            condition.where.year = year;
            condition.where.crop_code = cropName;
            condition.where.variety_id = cropVariety;
            condition.where.crop_group_code = cropGroupCode;
        }

        if (year && cropName && cropVariety && cropGroupCode && season) {
            condition.where.year = year;
            condition.where.crop_code = cropName;
            condition.where.variety_id = cropVariety;
            condition.where.crop_group_code = cropGroupCode;
            condition.where.season = season;
        }
    }
    return condition;
}
module.exports = pagination;