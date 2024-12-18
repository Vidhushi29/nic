const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.allocationToIndentor = require("./allocation_to_indentor.model")(sequelize, Sequelize);
db.allocationToIndentorSeed = require("./allocation_to_indentor_for_lifting_seeds.model")(sequelize, Sequelize);
db.allocationToSPASeed = require("./allocation_to_spa_for_lifting_seeds.model")(sequelize, Sequelize);
db.allocationToSPAProductionCenterSeed = require("./allocation_to_spa_for_lifting_seed_production_cnter.model")(sequelize, Sequelize);
db.allocationToIndentorProductionCenterSeed = require("./allocation_to_indentor_for_lifting_seed_production_cnter.model")(sequelize, Sequelize);
db.allocationToIndentorProductionCenter = require("./allocation_to_indentor_production_center.model")(sequelize, Sequelize);
db.agencyDetailModel = require("./agency_detail.model")(sequelize, Sequelize);
db.breederCropModel = require("./breeder_crop.model")(sequelize, Sequelize);
db.breederCertificate = require("./breeder_certificate.model")(sequelize, Sequelize);
db.bsp1Model = require("./bsp1.model")(sequelize, Sequelize);
db.bsp1ProductionCenterModel = require("./bsp1_production_center.model")(sequelize, Sequelize);
db.bsp2Model = require("./bsp2.model")(sequelize, Sequelize);
db.bsp3Model = require("./bsp3.model")(sequelize, Sequelize);
db.bsp4Model = require("./bsp4.model")(sequelize, Sequelize);
db.bsp5aModel = require("./bsp5a.model")(sequelize, Sequelize);
db.bsp5bModel = require("./bsp5b.model")(sequelize, Sequelize);
db.bsp6Model = require("./bsp6.model")(sequelize, Sequelize);
db.cropGroupModel = require("./crop_group.model")(sequelize, Sequelize);
db.cropModel = require("./crop.model")(sequelize, Sequelize);
db.designationModel = require("./designation.model")(sequelize, Sequelize);
db.generatedLabelNumberModel = require("./generated_label_number.model")(sequelize, Sequelize);
db.generateBills = require("./generate_bill.model")(sequelize, Sequelize);
db.indenterModel = require("./indent_of_breederseed.model")(sequelize, Sequelize);
db.indenterSPAModel = require("./indent_of_spa.model")(sequelize, Sequelize);
db.indentorBreederSeedModel = require("./indentor_breeder_seed.model")(sequelize, Sequelize);
db.insitutionModel = require("./responsible_insitution.model")(sequelize, Sequelize);
db.labelNumberForBreederseed = require("./label_number_for_breederseed.model")(sequelize, Sequelize);
db.lotNumberModel = require("./lot_number.model")(sequelize, Sequelize);
db.monitoringTeamModel = require("./monitoring_team.model")(sequelize, Sequelize);
db.nucleusSeedAvailabityModel = require("./nucleus_seed_availabity.model")(sequelize, Sequelize);
db.seedTestingReportsModel = require("./seed_testing_reports.model")(sequelize, Sequelize);
db.stateModel = require("./state.model")(sequelize, Sequelize);
db.tokens = require("../models/token.model.js")(sequelize, Sequelize);
db.userModel = require("./user.model")(sequelize, Sequelize);
db.varietyModel = require("./variety.model")(sequelize, Sequelize);
db.districtModel = require("./district.model")(sequelize, Sequelize);
db.generatedLabelNumber = require("./generated_label_number.model")(sequelize, Sequelize);
db.seasonModel = require("./season.model")(sequelize, Sequelize);
db.breederCropsVerietiesModel = require("./breeder_crops_verieties.model")(sequelize, Sequelize);
db.tokens = require("../models/token.model.js")(sequelize, Sequelize);
db.cropVerietyModel = require("./crop_veriety.model")(sequelize, Sequelize);
db.bspcToPlants = require("./bspc_to_plants.model")(sequelize, Sequelize);
db.plantDetails = require('./plant_detail.model.js')(sequelize, Sequelize);
db.bsp4ToPlant = require('./bsp4_to_plant.model')(sequelize, Sequelize);
db.agencyDetailModelSecond = require('./agency_details_second.model.js')(sequelize, Sequelize);
db.dashboardData = require('./dashboard_data.model.js')(sequelize, Sequelize);
db.maxLotSizeModel = require("./m_max_lot_size.model")(sequelize, Sequelize);
db.categoryModel = require("./category.model")(sequelize, Sequelize);

db.assignCropNewFlow = require('./assign_crop_new_flow.model')(sequelize, Sequelize);
db.assignBspcCropNewFlow = require('./assign_crop_bspc_new_flow.model')(sequelize, Sequelize);
db.seedForProductionModel = require('./seed_for_production.model')(sequelize, Sequelize);
db.seedInventory = require('./seed_inventory.model.js')(sequelize, Sequelize);
db.directIndent = require('./direct_indent.model.js')(sequelize, Sequelize);
db.bspProformaOneBspc = require('./bsp_proforma_one_bspc.model.js')(sequelize, Sequelize);
db.bspProformaOne = require('./bsp_proforma_one.model.js')(sequelize, Sequelize);
db.monitoringTeamOfPdpcsModel = require('./monitoring_team_of_pdpcs.model.js')(sequelize, Sequelize);
db.monitoringTeamAssignedToBspcsModel = require('./monitoring_team_assigned_to_bspcs.model.js')(sequelize, Sequelize);
db.monitoringTeamPdpcDetails = require('./monitoring_team_pdpc_details.model.js')(sequelize, Sequelize);
db.agencytypeModel = require('./agency_type.model.js')(sequelize, Sequelize);
db.mVarietyLines = require('./m_variety_lines.model.js')(sequelize, Sequelize);
db.VarietyLines = require('./variety_line.model.js')(sequelize, Sequelize);
db.indentOfBrseedLines = require('./indent_of_brseed_lines.model.js')(sequelize, Sequelize);
db.reportStatus = require('./report_status.model.js')(sequelize, Sequelize);
db.lineVariety = require('./variety_line.model.js')(sequelize, Sequelize);
db.availabilityOfBreederSeedModel = require('./availability_of_breeder_seed.model.js')(sequelize, Sequelize);
db.bspPerformaBspOne = require('./bsp_proforma_1s.model.js')(sequelize, Sequelize);
db.bspProformaOneBspc = require('./bsp_proforma_one_bspc.model')(sequelize, Sequelize);
db.agencyDetailModel2 = require("./agency_detail.model")(sequelize, Sequelize);
// db. =
db.indentOfSpaLinesModel = require('./indent_of_spa_lines.model.js')(sequelize, Sequelize);
db.liftingSeedDetailsModel = require('./lifting_seed_details.model.js')(sequelize, Sequelize);
// Associations
db.bsp4ToPlant.belongsTo(db.plantDetails, {
    foreignKey: 'plant_id',
    targetKey: 'id'
});
db.bsp4ToPlant.belongsTo(db.bsp4Model, {
    foreignKey: 'bsp4_id',
    targetKey: 'id'
});

//reletion modified 27/05/2023
db.plantDetails.hasMany(db.bspcToPlants, {
    foreignKey: 'plant_id',

    targetKey: 'plant_id'
});
db.bspcToPlants.belongsTo(db.plantDetails, {
    foreignKey: 'plant_id',
});


db.agencyDetailModel.hasMany(db.bspcToPlants, {
    foreignKey: 'agency_id',
    targetKey: 'agency_id'
});
db.bspcToPlants.belongsTo(db.agencyDetailModel, {
    foreignKey: 'agency_id',
});
//reletion modified 27/05/2023


db.agencyDetailModel.hasMany(db.userModel, {
    foreignKey: 'agency_id',
    targetKey: 'agency_id'
});
db.userModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'agency_id'
});

db.agencyDetailModel.belongsTo(db.designationModel, {
    foreignKey: 'contact_person_designation_id'
});
db.designationModel.hasMany(db.agencyDetailModel, {
    foreignKey: 'contact_person_designation_id'
});

db.indentorBreederSeedModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

// db.indentorBreederSeedModel.hasOne(db.agencyDetailModel, {
//     foreignKey: 'user_id'
// });
// db.agencyDetailModel.belongsTo(db.indentorBreederSeedModel, {
//     foreignKey: 'user_id'
// });



// db.agencyDetailModel.hasMany(db.userModel, {
//     foreignKey: 'id'
// });
// db.userModel.belongsTo(db.agencyDetailModel, {
//     foreignKey: 'id'
// });
db.agencyDetailModel.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'

});
db.indentorBreederSeedModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'

});
// db.stateModel.belongsTo(db.agencyDetailModel, {
//     foreignKey: 'state_id',

// });
// db.stateModel.hasMany(db.agencyDetailModel, {
//     foreignKey: 'state_id'
// });
// db.userModel.belongsTo(db.indentorBreederSeedModel, {
//     foreignKey: 'user_id'
// });
// db.indentorBreederSeedModel.hasMany(db.agencyDetailModel, {
//     foreignKey: 'id'
// });

// db.userModel.belongsTo(db.agencyDetailModel, {
//     foreignKey: 'agency_id'
// });


// db.stateModel.belongsTo(db.agencyDetailModel, {
//     foreignKey: 'id'
// });
// db.agencyDetailModel.belongsTo(db.stateModel, {
//     foreignKey: 'state_id'
// });
// db.agencyDetailModel.belongsTo(db.stateModel, {
//     foreignKey: 'state_id'
// });

module.exports = db;

// Relations

db.bsp1Model.belongsTo(db.agencyDetailModel, {
    foreignKey: 'agency_detail_id'
});

db.bsp1Model.hasMany(db.bsp1ProductionCenterModel, {
    foreignKey: {
        allowNull: false,
        name: 'bsp_1_id'
    },
});

db.bsp1ProductionCenterModel.belongsTo(db.bsp1Model, {
    foreignKey: 'bsp_1_id'
});


// db.allocationToIndentorSeed.hasMany(db.allocationToIndentorProductionCenterSeed, {
//     foreignKey: {
//         allowNull: false,
//         name: 'allocation_to_indentor_for_lifting_seed_id'
//     },
// });

db.bsp1Model.belongsTo(db.indenterModel, {
    foreignKey: 'indent_of_breederseed_id'
});

db.indenterModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.cropModel.belongsTo(db.indenterModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.indenterModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.indenterModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});
db.userModel.belongsTo(db.indenterModel, {
    foreignKey: 'id',
    targetKey: 'user_id'
});


db.userModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'agency_id',
});

// db.userModel.hasMany(db.bsp1Model, {
//     foreignKey: {
//         allowNull: false,
//         name: 'production_center_id'
//     },
// });

db.userModel.hasMany(db.bsp2Model, {
    foreignKey: {
        allowNull: false,
        name: 'production_center_id'
    },
});

db.userModel.hasMany(db.bsp3Model, {
    foreignKey: {
        allowNull: false,
        name: 'production_center_id'
    },
});

db.userModel.hasMany(db.bsp4Model, {
    foreignKey: {
        allowNull: false,
        name: 'production_center_id'
    },
});

db.userModel.hasMany(db.bsp5aModel, {
    foreignKey: {
        allowNull: false,
        name: 'production_center_id'
    },
});

db.bsp5aModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.bsp4Model.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.bsp3Model.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.bsp2Model.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.bsp2Model.belongsTo(db.bsp1Model, {
    foreignKey: 'bsp_1_id'
});

db.bsp1Model.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.bsp1Model.belongsTo(db.bsp2Model, {
    foreignKey: 'id',
    targetKey: 'bsp_1_id',
});

db.bsp2Model.belongsTo(db.bsp3Model, {
    foreignKey: 'id',
    targetKey: 'bsp_2_id',
});

db.bsp3Model.belongsTo(db.bsp4Model, {
    foreignKey: 'id',
    targetKey: 'bsp_3_id',
});

db.bsp1Model.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

// db.bsp1Model.belongsTo(db.userModel, {
//     foreignKey: 'user_id',
// });

db.bsp2Model.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.bsp2Model.belongsTo(db.userModel, {
    foreignKey: 'user_id'
});

db.bsp2Model.belongsTo(db.bsp1Model, {
    foreignKey: 'bsp_1_id'
});

db.bsp3Model.belongsTo(db.bsp2Model, {
    foreignKey: 'bsp_2_id'
});

db.bsp3Model.belongsTo(db.userModel, {
    foreignKey: 'user_id',
});

db.bsp3Model.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.bsp3Model.hasMany(db.monitoringTeamModel, {
    foreignKey: "user_mapping_id",
    sourceKey: "user_mapping_id",
});

db.bsp3Model.belongsTo(db.bsp2Model, {
    foreignKey: 'bsp_2_id'
});

db.bsp4Model.belongsTo(db.userModel, {
    foreignKey: "user_id"
});

db.bsp4Model.belongsTo(db.bsp3Model, {
    foreignKey: "bsp_3_id"
});

db.bsp3Model.belongsTo(db.bsp2Model, {
    foreignKey: 'bsp_2_id'
});

db.bsp4Model.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.bsp5aModel.belongsTo(db.userModel, {
    foreignKey: "user_id"
});

db.allocationToIndentor.belongsTo(db.userModel, {
    foreignKey: "user_id"
});

db.allocationToIndentor.belongsTo(db.indenterModel, {
    foreignKey: "indent_of_breeder_id"
});

db.bsp5aModel.belongsTo(db.bsp4Model, {
    foreignKey: "bsp_4_id"
});

db.bsp5aModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.bsp5bModel.belongsTo(db.bsp5aModel, {
    foreignKey: 'bsp_5_a_id'
});

db.bsp5bModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.bsp6Model.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.breederCertificate.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.bsp5bModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.bsp6Model.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.breederCertificate.belongsTo(db.indenterModel, {
    foreignKey: 'indent_of_breederseed_id',
});

db.breederCertificate.belongsTo(db.userModel, {
    foreignKey: 'user_id',
});

db.breederCertificate.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

// Another way to join bsp table
// db.bsp1Model.belongsTo(db.bsp4Model, {
//     foreignKey: 'production_center_id',
//     targetKey: 'production_center_id'
// });

db.bsp5bModel.belongsTo(db.indenterModel, {
    foreignKey: 'indent_of_breederseed_id',
});

db.indenterModel.belongsTo(db.bsp1Model, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_id'
});

// db.bsp1Model.belongsTo(db.userModel, {
//     foreignKey: 'production_center_id',
//     targetKey: 'id'
// });

db.indenterModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
})

db.bsp1Model.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
})

db.bsp2Model.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
})
db.bsp3Model.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
})
db.bsp4Model.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
})
db.bsp5aModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
})
db.bsp5bModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
})

db.bsp6Model.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
})

db.allocationToIndentor.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.allocationToIndentor.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.allocationToIndentor.belongsTo(db.indenterModel, {
    foreignKey: 'indent_of_breeder_id'
});

// db.monitoringTeamModel.hasMany(db.bsp3Model, {
//     foreignKey: "user_mapping_id",
//     sourceKey: "user_mapping_id",
// });

db.agencyDetailModel.belongsTo(db.designationModel, {
    foreignKey: 'contact_person_designation_id'
});
// breederCropModel and cropModel reletion
db.cropModel.hasMany(db.breederCropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.lotNumberModel.belongsTo(db.seedTestingReportsModel, {
    foreignKey: 'id',
    targetKey: 'lot_number'
});

db.breederCropModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});
// finish
db.agencyDetailModel.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});
db.agencyDetailModel.belongsTo(db.districtModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code'
});

db.seedTestingReportsModel.belongsTo(db.lotNumberModel, {
    foreignKey: 'lot_number'
});

db.seedTestingReportsModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});

db.labelNumberForBreederseed.belongsTo(db.lotNumberModel, {
    foreignKey: 'lot_number_creation_id'
});

db.labelNumberForBreederseed.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});

db.seedTestingReportsModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
})

db.seedTestingReportsModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
})

db.bsp6Model.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});

// db.bsp5bModel.belongsTo(db.labelNumberForBreederseed, {
//     foreignKey: 'label_number',
//     targetKey: 'label_number'
// });

db.generatedLabelNumberModel.belongsTo(db.labelNumberForBreederseed, {
    foreignKey: 'label_number_for_breeder_seeds',
    targetKey: 'id'
});
// breederCropModel and userModel reletion
db.userModel.hasMany(db.breederCropModel, {
    foreignKey: 'production_center_id',
    // targetKey: 'crop_code'

});

db.breederCropModel.belongsTo(db.userModel, {
    foreignKey: 'production_center_id',
    // targetKey: 'agency_id'

});
// finish
// breederCropModel and cropModel reletion
db.cropModel.hasMany(db.breederCropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.breederCropModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.labelNumberForBreederseed.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.labelNumberForBreederseed.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id'

});
// start breederCrop and breederCropVeriety model reletion
db.breederCropsVerietiesModel.hasMany(db.breederCropModel, {
    foreignKey: 'id',
    // targetKey: 'id'
});
db.breederCropModel.belongsTo(db.breederCropsVerietiesModel, {
    foreignKey: 'id',
    targetKey: 'breeder_crop_id'
});
// ================== finish =============================


// start breederCropsVerietiesModel and m_veriety_model  reletion
db.varietyModel.hasMany(db.breederCropsVerietiesModel, {
    foreignKey: 'variety_id',
    // targetKey: 'variety_id'
});
db.breederCropsVerietiesModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    // targetKey: 'id'
});
// ================== finish =============================

// -------------------------------------------------------

// start breederCropsVerietiesModel and m_veriety_model  reletion
db.cropGroupModel.hasMany(db.breederCropModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.breederCropModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'crop_group_code',
    targetKey: 'group_code'
});
// ================== finish =============================

// ============== crop model and season model ============
db.cropModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});
db.seasonModel.belongsTo(db.cropModel, {
    foreignKey: 'season',
    targetKey: 'season'
});

db.cropModel.belongsTo(db.indentorBreederSeedModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.indentorBreederSeedModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.cropModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.cropGroupModel.belongsTo(db.cropModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.indentorBreederSeedModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.cropGroupModel.belongsTo(db.indentorBreederSeedModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});

db.breederCropModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});
db.seasonModel.belongsTo(db.breederCropModel, {
    foreignKey: 'season',
    targetKey: 'season'
});

db.bsp1Model.belongsTo(db.cropGroupModel, {
    foreignKey: 'crop_group_code',
    targetKey: 'group_code'
});
db.bsp3Model.belongsTo(db.cropGroupModel, {
    foreignKey: 'crop_group_code',
    targetKey: 'group_code'
});
// ================== finish =============================

//========= start indent of breederseed to season ========
db.indentorBreederSeedModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});
db.seasonModel.hasMany(db.indenterModel, {
    foreignKey: 'season',
    targetKey: 'season'
});
//====== finish indent of breederseed to season ==========

db.maxLotSizeModel.hasMany(db.lotNumberModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.lotNumberModel.belongsTo(db.maxLotSizeModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
//====== finish indent of breederseed to season ==========

// ================== finish =============================
db.indenterModel.belongsTo(db.bsp5bModel, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_id'
});
db.indenterModel.belongsTo(db.bsp1Model, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_id'
});
db.indenterModel.belongsTo(db.userModel, {
    // foreignKey: 'id',
    // onDelete: 'cascade',
    foreignKey: 'user_id'
});
db.indenterModel.belongsTo(db.allocationToIndentor, {
    foreignKey: 'id',
    targetKey: 'indent_of_breeder_id'
});
db.allocationToIndentor.belongsTo(db.indenterModel, {
    foreignKey: 'indent_of_breeder_id',
    targetKey: 'id'
});
db.userModel.belongsTo(db.cropModel, {
    foreignKey: 'id',
    targetKey: 'breeder_id'
});
db.cropModel.belongsTo(db.userModel, {
    foreignKey: 'breeder_id',
    targetKey: 'id'
});

// db.generateBills.belongsTo(db.bsp4Model, {
//     foreignKey: 'bsp_4_id'
// });

// db.generateBills.belongsTo(db.bsp1Model, {
//     foreignKey: 'bsp_1_id'
// });

db.generateBills.belongsTo(db.indenterModel, {
    foreignKey: 'indent_of_breederseed_id'
});

db.generateBills.belongsTo(db.indenterSPAModel, {
    foreignKey: 'spa_code',
    targetKey: 'spa_code'
});

db.generateBills.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.generateBills.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.generateBills.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});

db.generateBills.belongsTo(db.userModel, {
    foreignKey: "spa_code",
    targetKey: 'spa_code'
});

db.userModel.hasMany(db.generateBills, {
    foreignKey: "user_id",
    targetKey: 'id'
});

db.generateBills.belongsTo(db.breederCertificate, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.monitoringTeamModel.belongsTo(db.designationModel, {
    foreignKey: 'designation',
    targetKey: 'id'
});

db.bsp1ProductionCenterModel.belongsTo(db.userModel, {
    foreignKey: 'production_center_id',
    targetKey: 'id'
});

db.allocationToIndentorProductionCenterSeed.belongsTo(db.userModel, {
    foreignKey: 'production_center_id',
    targetKey: 'id'
});
db.allocationToIndentorProductionCenterSeed.belongsTo(db.indenterModel, {
    foreignKey: 'indent_of_breeder_id',
    targetKey: 'user_id'
});

db.allocationToIndentorSeed.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.allocationToIndentorSeed.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.allocationToIndentorSeed.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});

db.allocationToSPAProductionCenterSeed.belongsTo(db.userModel, {
    foreignKey: 'spa_code',
    targetKey: 'spa_code',
    // as:'spaData'
});
// db.allocationToSPAProductionCenterSeed.belongsTo(db.indenterModel, {
//     foreignKey: 'indent_of_breeder_id',
//     targetKey: 'id'
// });

db.allocationToSPASeed.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.allocationToSPASeed.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.allocationToSPASeed.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});

db.indentorBreederSeedModel.belongsTo(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'id',
    targetKey: 'indent_of_breeder_id'
});

db.allocationToSPASeed.belongsTo(db.userModel, {
    foreignKey: 'user_id'
});

db.indenterSPAModel.belongsTo(db.userModel, {
    foreignKey: 'user_id'
});

db.allocationToIndentorSeed.hasMany(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'allocation_to_indentor_for_lifting_seed_id',
});

db.allocationToSPASeed.hasMany(db.allocationToSPAProductionCenterSeed, {
    foreignKey: 'allocation_to_spa_for_lifting_seed_id',
    targetKey: 'id'
});

db.allocationToSPAProductionCenterSeed.hasMany(db.indenterSPAModel, {
    foreignKey: 'spa_code',
    sourceKey: 'spa_code',
});

db.indenterSPAModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
});
db.agencyDetailModel.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});

// db.indenterSPAModel.hasMany(db.agencyDetailModel, {
//     foreignKey: 'state_code',
//     targetKey: 'state_id'
// });

db.indenterSPAModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
});

db.indenterSPAModel.belongsTo(db.agencyDetailModelSecond, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
});

db.indenterModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
});
db.cropModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'breeder_id',
    targetKey: 'user_id',
});
db.userModel.belongsTo(db.cropModel, {
    foreignKey: 'id',
    targetKey: 'breeder_id',
});

db.indenterSPAModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.indenterSPAModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
});

db.indenterSPAModel.hasMany(db.generateBills, {
    foreignKey: 'spa_code',
    sourceKey: 'spa_code'
});

db.indenterSPAModel.hasMany(db.allocationToSPAProductionCenterSeed, {
    foreignKey: 'spa_code',
    sourceKey: 'spa_code'
});

db.allocationToSPAProductionCenterSeed.belongsTo(db.allocationToSPASeed, {
    foreignKey: 'allocation_to_spa_for_lifting_seed_id',
});

// db.allocationToIndentorSeed.belongsTo(db.allocationToIndentorProductionCenterSeed, {
//     foreignKey: 'id',
//     sourceKey: 'allocation_to_indentor_for_lifting_seed_id'
// });

db.allocationToIndentorProductionCenterSeed.belongsTo(db.allocationToIndentorSeed, {
    targetKey: 'id',
    foreignKey: 'allocation_to_indentor_for_lifting_seed_id'
});
db.lotNumberModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.lotNumberModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code',
});
db.lotNumberModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id',
});
db.lotNumberModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
});
db.generateBills.belongsTo(db.allocationToSPAProductionCenterSeed, {
    foreignKey: 'spa_code',
    targetKey: 'spa_code',
});
db.allocationToSPAProductionCenterSeed.hasMany(db.generateBills, {
    foreignKey: 'spa_code',
    targetKey: 'spa_code',
});


db.varietyModel.hasMany(db.breederCropModel, {
    foreignKey: 'variety_id',
    onDelete: 'cascade'
});

db.breederCropModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});
//start reletion between m_categories and agency details
db.categoryModel.hasMany(db.agencyDetailModel, {
    foreignKey: 'category',
    targetKey: 'category'
    // targetKey: 'category'
});
db.agencyDetailModel.belongsTo(db.categoryModel, {
    foreignKey: 'category',
    // targetKey: 'category'
});
// -------------------- reletion b/w alloacation and indenter breedersheed model ----------
// db.allocationToIndentorSeed.hasMany(db.indentorBreederSeedModel),{
//     targetKey: 'id',
//     foreignKey: 'allocation_to_indentor_for_lifting_seed_id'
// }
// db.indentorBreederSeedModel.hasMany(db.allocationToIndentorSeed),{
//     targetKey: 'id',
//     foreignKey: 'allocation_to_indentor_for_lifting_seed_id'
// }

// ------------------------------- new flow reletion production center (nov/2023) start----------------------
db.seasonModel.hasMany(db.assignCropNewFlow, {
    foreignKey: 'season',
    targetKey: 'season',
});

db.assignCropNewFlow.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});

db.cropModel.hasMany(db.assignCropNewFlow, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});

db.assignCropNewFlow.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.varietyModel.hasMany(db.assignCropNewFlow, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});
db.assignCropNewFlow.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});
// ------------------------------- new flow reletion production center (nov/2023) finsih---------------------

// ------------------------------- new flow reletion Breeder II (nov/2023) start----------------------
db.seasonModel.hasMany(db.seedForProductionModel, {
    foreignKey: 'season',
    targetKey: 'season',
});

db.seedForProductionModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});

db.varietyModel.hasMany(db.seedForProductionModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.seedForProductionModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.seedInventory.hasMany(db.seedForProductionModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.seedForProductionModel.belongsTo(db.seedInventory, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.directIndent.hasMany(db.seedForProductionModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.seedForProductionModel.belongsTo(db.directIndent, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.directIndent.hasMany(db.seedForProductionModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});

db.seedForProductionModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
});

db.userModel.hasMany(db.seedForProductionModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
});
db.seedForProductionModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',

});

db.cropModel.hasMany(db.seedForProductionModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});

db.seedForProductionModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.varietyModel.hasMany(db.seedForProductionModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.bspProformaOne.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.varietyModel.hasMany(db.bspProformaOne, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});
db.bspProformaOne.belongsTo(db.bspProformaOneBspc, {
    foreignKey: 'id',
    targetKey: 'bspc_proforma_1_id'
});

// db.bspProformaOneBspc.hasMany(db.bspProformaOne, {
//     foreignKey: 'bspc_proforma_1_id',
//     targetKey: 'bspc_proforma_1_id',
// });

db.bspProformaOneBspc.belongsTo(db.userModel, {
    foreignKey: 'bspc_id',
});

db.userModel.hasMany(db.bspProformaOneBspc, {
    foreignKey: 'bspc_id',
    targetKey: 'id',
});

db.seedForProductionModel.hasMany(db.bspProformaOne, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.bspProformaOne.belongsTo(db.seedForProductionModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.indentorBreederSeedModel.hasMany(db.bspProformaOne, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.bspProformaOne.belongsTo(db.indentorBreederSeedModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.assignCropNewFlow.belongsTo(db.assignBspcCropNewFlow, {
    foreignKey: 'id',
    targetKey: 'assign_crop_id',
});
db.assignBspcCropNewFlow.hasMany(db.assignCropNewFlow, {
    foreignKey: 'id',
    targetKey: 'id',
});

db.monitoringTeamOfPdpcsModel.belongsTo(db.monitoringTeamPdpcDetails, {
    foreignKey: 'id',
    targetKey: 'monitoring_team_of_pdpc_id',
});

db.monitoringTeamPdpcDetails.belongsTo(db.districtModel, {
    foreignKey: 'district_code',
    targetKey: 'district_code'

})

db.monitoringTeamPdpcDetails.belongsTo(db.agencytypeModel, {
    foreignKey: 'agency_type_id',
    targetKey: 'id'
})


db.monitoringTeamPdpcDetails.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code',

})

db.monitoringTeamPdpcDetails.belongsTo(db.designationModel, {
    foreignKey: 'desination_id',
    targetKey: 'id',
});

db.bspProformaOneBspc.belongsTo(db.monitoringTeamAssignedToBspcsModel, {
    foreignKey: 'bspc_id',
    targetKey: 'bspc_id',
})

db.monitoringTeamOfPdpcsModel.hasMany(db.monitoringTeamAssignedToBspcsModel, {
    foreignKey: 'monitoring_team_of_pdpc_id',
    targetKey: 'monitoring_team_of_pdpc_id',
});
db.monitoringTeamAssignedToBspcsModel.belongsTo(db.monitoringTeamOfPdpcsModel, {
    foreignKey: 'monitoring_team_of_pdpc_id',
    // targetKey: 'monitoring_team_of_pdpc_id',
});
db.seedForProductionModel.belongsTo(db.VarietyLines, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.varietyModel.belongsTo(db.mVarietyLines, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
// db.mVarietyLines.hasMany(db.seedForProductionModel, {
//     foreignKey: 'variety_line_code',
//     targetKey: 'line_variety_code',
// });
db.bspProformaOne.belongsTo(db.mVarietyLines, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
});

db.seedForProductionModel.belongsTo(db.mVarietyLines, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
});

db.varietyModel.belongsTo(db.VarietyLines, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});
db.indentorBreederSeedModel.belongsTo(db.indentOfBrseedLines, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_id',
});
db.indentOfBrseedLines.belongsTo(db.mVarietyLines, {
    foreignKey: 'variety_code_line',
    targetKey: 'line_variety_code',
});
db.assignBspcCropNewFlow.belongsTo(db.userModel, {
    foreignKey: 'bspc_id',
    targetKey: 'id',
});
db.userModel.hasMany(db.assignBspcCropNewFlow, {
    foreignKey: 'bspc_id',
    targetKey: 'bspc_id',
});
db.varietyModel.hasMany(db.lineVariety, {
    foreignKey: 'variety_code',
    sourceKey: 'variety_code',
    // as: 'monitoringTeams1'
});

db.lineVariety.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});
//reletion modified 11/03/2024
db.userModel.hasMany(db.bspcToPlants, {
    foreignKey: 'plant_id',
    targetKey: 'plant_id'
});
db.bspcToPlants.belongsTo(db.userModel, {
    foreignKey: 'plant_id',
});
db.bspProformaOne.hasMany(db.bspProformaOneBspc, {
    foreignKey: 'id',
    // targetKey: 'bspc_proforma_1_id',
});
db.bspProformaOneBspc.belongsTo(db.bspProformaOne, {
    foreignKey: 'bspc_proforma_1_id',
    targetKey: 'id',
})
db.availabilityOfBreederSeedModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code',
})

db.availabilityOfBreederSeedModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
})
db.availabilityOfBreederSeedModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
db.bspPerformaBspOne.belongsTo(db.bspProformaOneBspc, {
    foreignKey: 'id',
    targetKey: 'bspc_proforma_1_id',
});
db.availabilityOfBreederSeedModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
});
db.availabilityOfBreederSeedModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
});
db.allocationToIndentorProductionCenterSeed.belongsTo(db.userModel, {
    foreignKey: 'production_center_id',
    targetKey: 'id',
});
db.indenterModel.belongsTo(db.indentOfBrseedLines, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_id',
});
db.allocationToIndentorSeed.belongsTo(db.mVarietyLines, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
});
db.availabilityOfBreederSeedModel.belongsTo(db.mVarietyLines, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
}
    
)
db.allocationToSPASeed.belongsTo(db.mVarietyLines, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
}
    
)
db.allocationToSPAProductionCenterSeed.belongsTo(db.agencyDetailModel2, {
    foreignKey: 'production_center_id',
    targetKey: 'user_id',
    // as:'userData'
});
db.indenterSPAModel.belongsTo(db.indentOfSpaLinesModel, {
    foreignKey: 'id',
    targetKey: 'indent_of_spa_id',
});
db.allocationToIndentorSeed.belongsTo(db.lineVariety, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
});
// db.liftingSeedDetailsModel.belongsTo(db.agencyDetailModel, {
//     as:'agencyData',
//     foreignKey: 'user_id',
//     targetKey: 'user_id',
// });
db.liftingSeedDetailsModel.belongsTo(db.userModel, {
    as:'userData',
    foreignKey: 'user_id',
    targetKey: 'id',
});
// db.availabilityOfBreederSeedModel.hasMany(db.indenterModel, {
//     foreignKey: 'variety_code',
//     targetKey: 'variety_code',
// });
// db.availabilityOfBreederSeedModel.hasMany(db.allocationToIndentorSeed, {
//     foreignKey: 'variety_code',
//     targetKey: 'variety_code',
// });

// db.bspProformaOne.hasMany(db.monitoringTeamAssignedToBspcsModel, {
//     foreignKey: 'id',
//     // targetKey: 'bspc_proforma_1_id',
// });
// db.monitoringTeamAssignedToBspcsModel.belongsTo(db.bspProformaOne, {
//     foreignKey: 'bspc_proforma_1_id',
//     targetKey: 'id',
// })
// bspc_proforma_1_id



// ------------------------------- new flow reletion production center (nov/2023) finsih---------------------
