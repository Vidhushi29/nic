const Op = require('sequelize').Op;

class ConditionCreator {
    static meetingFilter = async(filterData) => {
        let filter = {}
        for (var key in filterData) {
            var value = filterData[key];
            if(value) {
                switch (key) {
                    case 'meeting_number':
                        filter = { meeting_number: value, ...filter }
                        break;
                    case 'is_active':
                        filter = { is_active: value, ...filter }
                        break;
                    case 'id':
                        filter = {id: value, ...filter}
                        break;
                    case 'fromDate':
                        filter = { ...filter,
                            [Op.or]: [{ meeting_datetime: {
                            [Op.between]: [value, filterData['toDate']]
                                }
                            }
                            ]
                        }    
                    // default:
                    //     filter = { key: value, ...filter }
                    //     break;
                }
            }
        }
        return filter
    }

    static masterFilter = async(filterData) => {
        let filter = {}
        for (var key in filterData) {
            var value = filterData[key];
            if(value) {
                switch (key) {
                    case 'state_id':
                        filter = { state_id: value, ...filter }
                        break;
                    case 'district_id':
                        filter = { district_id: value, ...filter }
                        break;
                    case 'sub_district_id':
                        filter = {sub_district_id: value, ...filter}
                        break;
                    case 'block_id':
                        filter = {block_id: value, ...filter}
                        break;
                    case 'village_id':
                            filter = {village_id: value, ...filter}
                            break;
                    case 'state_name':
                        filter = {state_name: value, ...filter}
                        break;
                    case 'district_name':
                        filter = {district_name: value, ...filter}
                        break;
                    case 'subdistrict_name':
                            filter = {subdistrict_name: value, ...filter}
                            break;
                    case 'block_name':
                                filter = {block_name: value, ...filter}
                                break;
                    case 'village_name':
                                    filter = {village_name: value, ...filter}
                                    break;
                    // case 'fromDate':
                    //     filter = { ...filter,
                    //         [Op.or]: [{ meeting_datetime: {
                    //         [Op.between]: [value, filterData['toDate']]
                    //             }
                    //         }
                    //         ]
                    //     }    
                    // default:
                    //     filter = { key: value, ...filter }
                    //     break;
                }
            }
        }
        return filter
    }

    static policyType = async(filterData) => {
        let filter = {}
        for (var key in filterData) {
            var value = filterData[key];
            if(value) {
                switch (key) {
                    case 'userid':
                        filter = { userid: value, ...filter }
                        break;

                    case 'policy_type':
                        if(value == 'life'){
                            filter = {insurancetypeid : 1 , ...filter}
                        }else if(value == 'health'){
                            filter = {insuranceplantypeid: 11, ...filter}
                        }else if(value == 'motor'){
                            filter = {insuranceplantypeid:{ [Op.or]: [12,13]}, ...filter }
                        }
                        break;

                    case 'period':
                        var now = new Date();
                        now = `${now.getFullYear()}-${(now.getMonth()+1)}-${now.getDate()}`
                        var previousDate = new Date();
                        previousDate.setDate(previousDate.getDate() - parseInt(value));
                        previousDate = `${previousDate.getFullYear()}-${(previousDate.getMonth()+1)}-${previousDate.getDate()}`

                        filter = { ...filter, [Op.or]: [{ Policystartdate: {
                        [Op.between]: [previousDate, now]
                            }
                        }
                        ]}
                        break;

                    case 'pay_type':
                        if(value == 'policy_to_pay') {
                            const now = new Date();
                            const nextMonth = new Date(now.getFullYear(), now.getMonth()+1, now.getDate());
                            filter = { ...filter, ispartnerinsurer: 1, [Op.or]: [{ nextduedate: {
                                [Op.between]: [now, nextMonth]
                                    }
                                }
                                ]
                            }
                        } else if(value == 'lapsed_policy') {
                            filter = { ...filter, statusid: 2 }
                        }
                        break;

                    case 'type':
                        if(value == 'self'){
                            filter = { ...filter, type : 'self'}
                        } else if(value == 'dependent') {
                            filter = { ...filter, type: 'dependent'}
                        }else if(value == 'spouse') {
                            filter = { ...filter, type: 'spouse'}
                        }
                        break;

                    case 'request_for':
                        if(value == 'active_policy') {
                            filter = { ...filter,  statusininsurepay: 'Active' }
                        }else if(value == 'inactive') {
                            filter = { ...filter,  statusininsurepay: {[Op.ne]: 'Active'} }
                        } else if(value == 'dashboard') {
                            filter = { ...filter,  statusininsurepay: {[Op.notIn]:['Pending', 'Canceled']} }
                        }
                        break;
                }
            }

        }
        return filter
    }

    static paymenDueAlert = async () => {

        var dueDate = new Date();
        const currentDate =  new Date(`${dueDate.getFullYear()}-${(dueDate.getMonth()+1)}-${dueDate.getDate()}`)

        dueDate.setDate(dueDate.getDate() + 3);
        const dueDateIn3 =  new Date(`${dueDate.getFullYear()}-${(dueDate.getMonth()+1)}-${dueDate.getDate()}`)

        dueDate.setDate(dueDate.getDate() + 5);
        const dueDateIn8 = new Date(`${dueDate.getFullYear()}-${(dueDate.getMonth() +1)}-${dueDate.getDate()}`)

        dueDate.setDate(dueDate.getDate() + 7);
        const dueDateIn15 = new Date(`${dueDate.getFullYear()}-${(dueDate.getMonth() +1)}-${dueDate.getDate()}`)

        dueDate.setDate(dueDate.getDate() + 15);
        const dueDateIn30 = new Date(`${dueDate.getFullYear()}-${(dueDate.getMonth()+1)}-${dueDate.getDate()}`)

        let filter = {
            //  ispartnerinsurer: 1,
            [Op.or]: [
                {
                    nextduedate:
                    {
                        [Op.eq]: currentDate
                    }
                },
                {
                    nextduedate:
                    {
                        [Op.eq]: dueDateIn3
                    }
                },
                {
                    nextduedate:
                    {
                        [Op.eq]: dueDateIn8
                    }
                },
                {
                    nextduedate:
                    {
                        [Op.eq]: dueDateIn15
                    }
                },
                {
                    nextduedate:
                    {
                        [Op.eq]: dueDateIn30
                    }
                },
            ],
        }
        return filter
    }

    static mongoFilter = async(filterData) => {
        let filter = {}
        if(filterData){
            for (var key in filterData) {
                var value = filterData[key];
                if(value) {
                    switch (key) {
                        case  'category':
                            if(value.length){
                                let element3 = []
                                element3 = value.map(item=>{
                                    return {category: new RegExp('' + item + '', "i") }
                                })

                                if(filter.$or) {
                                    const orCondition = filter.$or
                                    delete filter.$or
                                    filter =  { $or: [...element3, ...orCondition ], ...filter }
                                }
                                else
                                    filter =  { $or: [...element3 ], ...filter }

                                console.log("filterfilter", filter)
                                // filter = {...condtion, ...filter}
                                // filter = {name: new RegExp('^' + value + '$') , ...filter}
                            }

                            break;

                        // case 'pincode':
                        //     filter = { pincode: value, ...filter }
                        //     break;

                        case 'area':
                            filter = { location: value, ...filter }
                            break;

                        case 'merchantname':
                            filter = { merchantname: value, ...filter }
                            break;

                        case 'brands':
                            if(!value.length){
                                break
                            }
                            let filterData1 = value.map(item=>{
                                return {"parentbrandname": item }
                            })

                            // {$and: [{$or : [{'a':1},{'b':2}]},{$or : [{'a':2},{'b':3}]}] }
                            let condtion = { $or:[...filterData1 ] }
                            console.log("condtion", condtion)
                            if(filter.$or) {
                                filter =  { $and:  [{ ...condtion }, {...filter}] }

                            } else if(filter.$and){
                                let andCond = filter.$and
                                filter =  { $and: [ {...andCond}, {...condtion} ], ...filter }
                            } else
                                filter =  { $or: [...filterData1 ], ...filter }

                                console.log("filter", filter)

                            break;

                        case 'merchants':
                            if(!value.length){
                                break
                            }
                            let filterDataMerchant = value.map(item=>{
                                return {"merchantname": item }
                            })

                            // {$and: [{$or : [{'a':1},{'b':2}]},{$or : [{'a':2},{'b':3}]}] }
                            let condtionMerchant = { $or:[...filterDataMerchant ] }

                            if(filter.$or) {
                                filter =  { $and:  [{ ...condtionMerchant }, {...filter}] }

                            } else if(filter.$and){
                                let andCond = filter.$and
                                filter =  { $and: [ {...andCond}, {...condtionMerchant} ], ...filter }
                            } else
                                filter =  { $or: [...filterDataMerchant ], ...filter }

                            break;

                        case 'discountvalue':
                            if(value.length){
                                let cond = {}
                                let query = value.map(item=>{

                                    if(item == 2){
                                        cond = { discountvalue: { $gte: 50 } }

                                    } else if(item == 3){
                                        cond = { discountvalue: { $lte :50, $gte : 30} }
                                    }else if(item == 4){
                                        cond = { discountvalue: { $lte :20} }
                                    }
                                    return cond
                                })

                                if(filter.$or) {
                                    filter =  { $and:  [{ ...cond }, { ...filter }] }

                                } else if(filter.$and){
                                    let andCond = filter.$and
                                    filter =  { $and: [ { ...andCond }, { ...cond } ], ...filter }

                                } else
                                    filter =  { $or: [{ ...cond }], ...filter }

                                // filter = {...cond, ...filter}
                            }
                            break;
                    }
                }

            }
        }
        return filter
    }


    static filters = async(filterData) => {
        let filter = {}
        for (var key in filterData) {
            var value = filterData[key];
            console.log("value", value)
            if(value) {
                switch (key) {
                    // case 'crop_code' :
                    //     filter = { crop_code: value, ...filter }
                    //     break;
                    case 'year_of_indent' :
                        filter = { year: value, ...filter }
                        break;
		case  'year' :
                        filter = { year: value, ...filter }
                        break;
                    case 'season' :
                        filter = { season: value, ...filter }
                        break;
                    case 'crop_type' : 
                        filter =
                        {
                            crop_type: {
                                [Op.like]: `${value}%`
                            },
                            ...filter 
                        }
                        break;
                        case 'userid':
                        filter = { user_id: value, ...filter }
                        break;

                    case 'crop_code'   :
                        console.log("value.length", value, value.length)
                        if(value && value.length && value != 'NULL' && value != undefined){
                            filter =
                                {
                                    crop_code: {
                                        [Op.in]: value
                                    },
                                    ...filter                             
                            }       
                        }            
                        break;

                    case 'variety_code' : 
                    if(value && value.length && value != 'NULL' && value != undefined){
                        filter =
                            {
                                variety_code: {
                                    [Op.in]: value
                                },
                                ...filter                             
                        } 
                    }                  
                        break;
                    case 'variety_id' : 
                    if(value && value.length && value != 'NULL' && value != undefined){
                        filter =
                            {
                                variety_id: {
                                    [Op.in]: value
                                },
                                ...filter                             
                        } 
                    }                  
                        break;
                    case 'spa_name' : 
                    if(value && value.length && value != 'NULL' && value != undefined){
                        filter =
                            {
                                id: {
                                    [Op.in]: value
                                },
                                ...filter                             
                        } 
                    }                  
                        break;
                  
                    case 'state_code':
                        filter = { state_code: value, ...filter }
                        break;

                    case 'state_id':
                        filter = { state_id: value, ...filter }
                        break;

                    case 'district_id':
                        filter = { district_id: value, ...filter }
                        break;
                    case 'sub_district_id':
                        filter = {sub_district_id: value, ...filter}
                        break;
                    case 'block_id':
                        filter = {block_id: value, ...filter}
                        break;
                    case 'village_id':
                            filter = {village_id: value, ...filter}
                            break;
                    case 'state_name':
                        filter = {state_name: value, ...filter}
                        break;
                    case 'district_name':
                        filter = {district_name: value, ...filter}
                        break;
                    case 'subdistrict_name':
                            filter = {subdistrict_name: value, ...filter}
                            break;
                    case 'block_name':
                                filter = {block_name: value, ...filter}
                                break;
                    case 'village_name':
                                    filter = {village_name: value, ...filter}
                                    break;
                    // case 'fromDate':
                    //     filter = { ...filter,
                    //         [Op.or]: [{ meeting_datetime: {
                    //         [Op.between]: [value, filterData['toDate']]
                    //             }
                    //         }
                    //         ]
                    //     }    
                    // default:
                    //     filter = { key: value, ...filter }
                    //     break;
                }
            }
        }
        return filter
    }

    /**
     * @param {Request} req - request object
     * @param {String} columnName - filter based on this 'columnName'
     * @param {String|String[]} keyNames - all key(s) whose value(s) need to be searched. 
     * in case of multiple and isDate == true, all will be merged under [Op.and]
     * @param {Object} Condition - condition object
     */
    static generatedTableFilters = (req, columnName, keyNames, condition, isDate = false, compareType = Op.eq) => {

        let isRange = Array.isArray(keyNames) && keyNames?.length > 1;

        if (req.body.search) {
            if ((isRange && this.doKeysExist(req.body.search, keyNames))
                || (!isRange && req.body.search[keyNames] !== undefined && req.body.search[keyNames] !== null)) {
                if (!condition) {
                    condition = {};
                }
                if (!condition.where) {
                    condition.where = {};
                }


                if (keyNames.length == 2 && isDate) {
                    condition.where[columnName] = {
                        [Op.and]: {
                            [Op.gte]: new Date(req.body.search[keyNames[0]]),
                            [Op.lte]: new Date(req.body.search[keyNames[1]])
                        }
                    }
                }
                else if (compareType) {
                    if (keyNames.length == 2) {
                        if (req.body.search[keyNames[0]] && req.body.search[keyNames[1]]) {
                            condition.where[columnName] = {
                                [compareType]: {
                                    [Op.gte]: req.body.search[keyNames[0]],
                                    [Op.lte]: req.body.search[keyNames[1]]
                                }
                            }
                            return;
                        }
                    }
                    else {
                        if (req.body.search[keyNames[0]]) {
                            keyNames = keyNames[0];
                        }
                        else if (req.body.search[keyNames[1]]) {
                            keyNames = keyNames[1];
                        }
                    }

                    if (req.body.search[keyNames]) {
                        let value = req.body.search[keyNames];
                        if (isDate) {
                            value = new Date(value);
                        }
                        if (compareType == Op.like) {
                            let isSubStringSearch = Array.isArray(value) && value?.length > 1;

                            if (isSubStringSearch) {
                                let orCondition = [];
                                for (let eachSubStringValue of value) {
                                    orCondition.push({
                                        [columnName]: {
                                            [Op.like]: `%${eachSubStringValue}%`
                                        }
                                    });
                                }
                                condition.where[Op.or] = orCondition;
                            }
                            else {
                                condition.where[columnName] = {
                                    [Op.like]: `%${value}%`
                                };
                            }
                        }
                        else {
                            condition.where[columnName] = {
                                [compareType]: value
                            };
                        }
                    }
                }
                else {
                    condition.where[columnName] = req.body.search[keyNames];
                }
            }
        }
    }

}

module.exports = ConditionCreator
