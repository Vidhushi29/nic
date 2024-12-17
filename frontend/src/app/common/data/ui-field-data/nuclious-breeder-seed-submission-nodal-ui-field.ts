import { Injectable } from "@angular/core";
import { Validators } from "@angular/forms";
import { max } from "rxjs-compat/operator/max";
import { MasterService } from "src/app/services/master/master.service";
import { ProductioncenterService } from "src/app/services/productionCenter/productioncenter.service";
import { SeedDivisionService } from "src/app/services/seed-division/seed-division.service";
import { random } from "src/app/_helpers/utility";
import { SectionFieldType } from "../../types/sectionFieldType";

const todayDate = new Date();
let yearOfIndent: any = [
    // { name: "2020-21", "value": "2020" },
    // { name: "2021-22", "value": "2021" },
    { name: "2022-23", "value": "2022" },
    { name: "2023-24", "value": "2023" },
    { name: "2024-25", "value": "2024" },
    // { name: "2025-26", "value": "2025" }
];
let ifNotBeingProduced: any = [
    { name: "Yes", "value": true },
    { name: "No", "value": false },
]
let cropName: any = [];
let breederName: any = [];
let cropNameData: any = [];
let memberReport: any = [
    { name: "Satisfactory", value: 1 },
    { name: "Re-monitoring after 15 days", value: 2 },
    { name: "Unsatisfactory", value: 3 }
];
let seasonData: any = [];
let regionData:any=[
    {
        value :1,
        name:'region 1'
      },
      {
        value :2,
        name:'region 2'
      },
      {
        value :3,
        name:'region 3'
      },
];
let groupName: any = [];
let production_centre_name: any = 'production_centre_name';
let nodal_officer_detail: any = 'Name of Nodal Officer and Address and Designation';
let being_produced: any = [
    { name: "Yes", value: "true" },
    { name: "No", value: "false" }
]

function createYearRange(start: number, end: number): void {
    if (start <= end) {
        yearOfIndent.push({ name: start + "", value: start });
        createYearRange(start + 1, end);
    }
}

function addSelectData(array: any[], prefix: string, totalCount: number): void {
    if (totalCount === undefined) totalCount = 5;

    for (let index = 1; index <= totalCount; index++) {
        array.push({
            name: prefix + " " + (index < 10 ? '0' + index : index),
            value: index
        });
        if (prefix == "Crop") {
            array[array.length - 1]["cropType"] = "Crop Type - " + '0' + index;

            let variety: any[] = [];
            addSelectData(variety, "Variety", random(6, 20));
            array[array.length - 1]["variety"] = variety;
        }

        if (prefix == "Variety") {
            createCropVarietyData(array[array.length - 1], true);
        }
    }
}


export function createCropVarietyData(varietyNameValue: any, areFields: boolean = false) {
    const breederDataId = random(1, 10);
    varietyNameValue.indentingAgency = "Indenting Agency-" + random(1, 10);
    varietyNameValue.indentingQuantity = random(1, 10);

    if (!areFields) {
        varietyNameValue.availableNucleusSeed = random(1, 10);
        varietyNameValue.breederData = { name: "Breeder-" + breederDataId, value: breederDataId };
        varietyNameValue.allocateNucleusSeed = random(1, 10);
    }
}

// addSelectData(cropName, "Crop", 4);
addSelectData(breederName, "Breeder", 4);
// addSelectData(memberReport,git"Report", 4);

// createYearRange(1990, todayDate.getFullYear());
@Injectable({
    providedIn: 'root'
})
export class nucliousbreederSeedSubmissionNodalUIFields {
    constructor(productService: ProductioncenterService, masterService: MasterService, _serviceSeed: SeedDivisionService) {
        let user = localStorage.getItem('BHTCurrentUser')
        console.log('userDatat',);
        let userId = JSON.parse(user)
        let data = {
            search: {
                'user_id': userId && userId.id ? userId.id : ''
            }
        }
        productService.postRequestCreator("get-crop-name-production-data", data).subscribe((data: any) => {
            console.log('cropdata', data);
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    x["name"] = x['m_crop.crop_name'] ? x['m_crop.crop_name'] : '';
                    x["value"] = x['crop_code'] ? x['crop_code'] : '';
                    x["cropType"] = "Crop Type - " + '0' + index;
                    cropName.push(x);
                    console.log('cropName', x["name"]);
                });
            }
        });
    }
    get get(): Array<SectionFieldType> {
        return [
            // {
            //     formControlName: "breader_production_name",
            //     fieldName: "Breeder Production Centre Name",
            //     fieldType: 'input',
            //     id: "breader_production_name",
            //     fieldDataList: undefined,
            //     validations: [Validators.required]
            // },
            // {
            //     formControlName: "Contact_Officer_Address_and_Designation",
            //     fieldName: "Contact Officer's Details",
            //     fieldType: 'input',
            //     id: "contact_officer",
            //     fieldDataList: undefined,
            //     validations: [Validators.required]
            // },
            {
                formControlName: "yearofIndent",
                fieldName: "Year of Indent",
                fieldType: 'select',
                id: "yearofIndent",
                fieldDataList: yearOfIndent,
                validations: [Validators.required]
            },
            {
                formControlName: "season",
                fieldName: "Season",
                fieldType: 'select',
                id: "season",
                fieldDataList: seasonData,
                validations: [Validators.required]
            },
            {
                formControlName: "cropName",
                fieldName: "Crop Name",
                fieldType: 'select',
                id: "cropName",
                fieldDataList: cropNameData,
                validations: [Validators.required]
            }
        ];
    }
}

@Injectable({
    providedIn: 'root'
})
export class nucliousbreederSeedSubmissionNodalUIFieldss {
    constructor(productService: ProductioncenterService, _serviceSeed: SeedDivisionService) {
        // _serviceSeed.postRequestCreator("crop-group").subscribe((data: any) => {
        //     if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        //         data.EncryptedResponse.data.forEach((x: any, index: number) => {
        //             x["name"] = x.group_name;
        //             x["value"] = x.group_code;
        //             x["cropType"] = "Crop Type - " + '0' + index;
        //             groupName.push(x);
        //         });
        //     }
        // });

    }
    get get(): Array<SectionFieldType> {
        return [
            {
                formControlName: "groupName",
                fieldName: "Crop Group",
                fieldType: 'select',
                id: "groupName",
                // inputSearch: 'crop_group_smr_text',
                fieldDataList: groupName,
                validations: [Validators.required]
            }
        ];
    }
}

export const selectNucliousBreederNameNodalUIFields: Array<SectionFieldType> = [
    {
        formControlName: "quantity_of_nucleus_seed",
        fieldName: "Quantity of Nucleus Seed",
        fieldType: 'input',
        id: "quantity_of_nucleus_seed",
        // validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "reference_no",
        fieldName: "Reference No. of MoA/Authorization in Case Variety is not the Centre Taking up BSP",
        fieldType: 'input',
        id: "reference_no",
        // validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "date_of_reference",
        fieldName: "Date of Reference No. of MoA/Authorization in Case Variety is not the Centre Taking up BSP",
        fieldType: 'date',
        id: "date_of_reference",
        fieldDataList: undefined,
        // validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "reference_no_of_office",
        fieldName: "Reference No. of Office Order, Cash Memo/BNSIV Proof of Procuring Nucleus Seed from the Source",
        fieldType: 'input',
        id: "reference_no_of_office",
        fieldDataList: undefined,
        // validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "date_of_office_order",
        fieldName: "Date of Office Order, Cash Memo/BNSIV Proof of Procuring Nucleus Seed from the Source",
        fieldType: 'date',
        id: "date_of_office_order",
        // validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },
];
export const seedMultipicationRatioUIFields: Array<SectionFieldType> = [
    {
        formControlName: "crop_name",
        fieldName: " Crop Name",
        fieldType: 'input',
        validations: undefined,
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "nucleus_breader",
        fieldName: "Nucleus to Breeder",
        fieldType: 'number',
        validations: [Validators.max(500)],
        gridColClass: "col-12 col-xl-4 py-2",
        id: 'nucleusBreeder',
        event: "checkfertilizerphosphorus"
    },
    {
        formControlName: "breader_to_foundation_1",
        fieldName: "Breeder to Foundation I",
        fieldType: 'number',
        validations: [Validators.max(500)],
        gridColClass: "col-12 col-xl-4 py-2",

    },
    {
        formControlName: "foundation_1_to_foundation_2",
        fieldName: "Foundation I to Foundation II",
        fieldType: 'number',
        validations: [Validators.max(500)],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "foundation_2_to_certified",
        fieldName: "Foundation II to Certified",
        fieldType: 'number',
        validations: [Validators.max(500)],
        gridColClass: "col-12 col-xl-4 py-2",
    },
];

// BSP Proforma 1 form fieldset
export const bspProformasIUIFields: Array<SectionFieldType> = [
    {
        formControlName: "yearofIndent",
        fieldName: "Year of Indent",
        fieldType: 'select',
        id: "yearofIndent",
        fieldDataList: yearOfIndent.sort((a, b) => b.value - a.value),
        validations: [Validators.required]
    },
    {
        formControlName: "cropName",
        fieldName: "Crop Name",
        fieldType: 'select',
        id: "cropName",
        fieldDataList: cropName,
        validations: [Validators.required]
    }
];

export const bspProformasIVarietyUIFields: Array<SectionFieldType> = [
    {
        formControlName: "year_of_release",
        fieldName: "Year of Release",
        fieldType: 'input',
        id: "year_of_release",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "indenting_agency",
        fieldName: "Indenting Agency",
        fieldType: 'input',
        id: "indenting_agency",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "indent_quantity",
        fieldName: "Indent Quantity",
        fieldType: 'number',
        id: "indent_quantity",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "production_centre_name",
        fieldName: "Production Centre Name",
        fieldType: 'select',
        id: "production_centre_name",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "contact_officer_info",
        fieldName: "Name of Contact Officer and Address and Designation",
        fieldType: 'input',
        id: "contact_officer_info",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },
    {
        formControlName: "available_nucleus_seed",
        fieldName: "Available Nucleus Seed",
        fieldType: 'number',
        id: "available_nucleus_seed",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "breeder_seed_quantity",
        fieldName: "Quantity of Breeder Seed to be Produced",
        fieldType: 'number',
        id: "breeder_seed_quantity",
        // fieldDataList: undefined,
        validations: [Validators.required, Validators.max(100), Validators.min(0)],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "monitoring_team_id",
        fieldName: "Members of the Monitoring Team",
        fieldType: 'number',
        id: "monitoring_team_id",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },
];

// BSP Proforma 2 form fieldset
export const bspProformasIIUIFields: Array<SectionFieldType> = [
    // {
    //     formControlName: "production_centre_name",
    //     fieldName: "Production Centre Name",
    //     fieldType: 'input',
    //     id: "production_centre_name",
    //     // fieldDataList: production_centre_name,
    //     validations: [Validators.required]
    // },
    // {
    //     formControlName: "nodal_officer_detail",
    //     fieldName: "Name of Nodal Officer and Address and Designation",
    //     fieldType: 'input',
    //     id: "nodal_officer_detail",
    //     // fieldDataList: nodal_officer_detail,
    //     validations: [Validators.required]
    // },
    {
        formControlName: "yearofIndent",
        fieldName: "Year of Indent",
        fieldType: 'select',
        id: "yearofIndent",
        fieldDataList: [],
        validations: [Validators.required]
    },
    {
        formControlName: "season",
        fieldName: "Season",
        fieldType: 'select',
        id: "season",
        fieldDataList: [],
        validations: [Validators.required]
    },
    {
        formControlName: "cropName",
        fieldName: "Crop Name",
        fieldType: 'select',
        id: "cropName",
        fieldDataList: [],
        validations: [Validators.required]
    }
];

export const bspProformasIIVarietyUIFields: Array<SectionFieldType> = [

    {
        formControlName: "not_being_produced",
        fieldName: "If not Being Produced",
        fieldType: 'select',
        id: "not_being_produced",
        fieldDataList: ifNotBeingProduced,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },

    {
        formControlName: "upload",
        fieldName: "If Not Being Produced, Upload Supporting Documents in PDF, JPEG, JPG, PNG Format Only, Maximum Size 2 MB.",
        fieldType: 'file',
        id: "upload",
        validations: [],
        gridColClass: "col-12 py-2",
    },

    {
        formControlName: "targeted_quantity",
        fieldName: "Quantity Targeted",
        fieldType: 'number',
        id: "targeted_quantity",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "sown_area",
        fieldName: "Area Sown(Ha)",
        fieldType: 'input',
        id: "sown_area",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "expected_production",
        fieldName: "Expected Production",
        fieldType: 'input',
        id: "expected_production",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "field_location",
        fieldName: "Field Location",
        fieldType: 'input',
        id: "field_location",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "latitude",
        fieldName: "Latitude",
        fieldType: 'input',
        id: "latitude",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "longitude",
        fieldName: "Longitude",
        fieldType: 'input',
        id: "longitude",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "expected_inspection_period_from",
        fieldName: "Expected Inspection Period - From",
        fieldType: 'date',
        id: "expected_inspection_period_from",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-6 col-xl-4 py-2"
    },
    {
        formControlName: "expected_inspection_period_to",
        fieldName: "To",
        fieldType: 'date',
        id: "expected_inspection_period_to",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-6 col-xl-4 py-2"
    },
    {
        formControlName: "sowing_date",
        fieldName: "Date of Sowing Office Order, Cash Memo/BNSIV etc.",
        fieldType: 'date',
        id: "sowing_date",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },
    {
        formControlName: "expected_harvest_from",
        fieldName: "Expected Date of Harvest - From",
        fieldType: 'date',
        id: "expected_harvest_from",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-6 col-xl-4 py-2"
    },
    {
        formControlName: "expected_harvest_to",
        fieldName: "To",
        fieldType: 'date',
        id: "expected_harvest_to",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-6 col-xl-4 py-2"
    },
    {
        formControlName: "availability_seed_loaction",
        fieldName: "Location of Availability of Seed",
        fieldType: 'input',
        id: "availability_seed_loaction",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },
    {
        formControlName: "availability_expected_date",
        fieldName: "Expected Date of Availability",
        fieldType: 'date',
        id: "availability_expected_date",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },

    // {
    //     formControlName: "if_not_being_produced",
    //     fieldName: "If not being Produced",
    //     fieldType: 'radio',
    //     id: "if_not_being_produced",
    //     fieldDataList: being_produced,
    //     validations: [Validators.required],
    //     gridColClass: "col-12 col-xl-4 py-2",
    // },

    // Radio buttons are left with reason field

];
export const bspProformasIIVarietyUIFieldsSecond: Array<SectionFieldType> = [

    {
        formControlName: "not_being_produced",
        fieldName: "If not Being Produced",
        fieldType: 'select',
        id: "not_being_produced",
        fieldDataList: ifNotBeingProduced,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },

    {
        formControlName: "upload",
        fieldName: "If Not Being Produced, Upload Supporting Documents in PDF, JPEG, JPG, PNG Format Only, Maximum Size 2 MB.",
        fieldType: 'file',
        id: "upload",
        validations: [],
        gridColClass: "col-12 py-2",
    },


    // {
    //     formControlName: "if_not_being_produced",
    //     fieldName: "If not being Produced",
    //     fieldType: 'radio',
    //     id: "if_not_being_produced",
    //     fieldDataList: being_produced,
    //     validations: [Validators.required],
    //     gridColClass: "col-12 col-xl-4 py-2",
    // },

    // Radio buttons are left with reason field

];

// BSP Proforma 3 form fieldset
export const bspProformasIIIUIFields: Array<SectionFieldType> = [
    // {
    //     formControlName: "production_centre_name",
    //     fieldName: "Production Centre Name",
    //     fieldType: 'input',
    //     id: "production_centre_name",
    //     // fieldDataList: yearOfIndent,
    //     validations: [Validators.required]
    // },
    {
        formControlName: "yearofIndent",
        fieldName: "Year of Indent",
        fieldType: 'select',
        id: "yearofIndent",
        fieldDataList: [],
        validations: [Validators.required]
    },
    {
        formControlName: "season",
        fieldName: "Season",
        fieldType: 'select',
        id: "season",
        fieldDataList: [],
        validations: [Validators.required]
    },
    {
        formControlName: "cropName",
        fieldName: "Crop Name",
        fieldType: 'select',
        id: "cropName",
        fieldDataList: [],
        validations: [Validators.required]
    }
];

export const bspProformasIIIVarietyUIFields: Array<SectionFieldType> = [
    {
        formControlName: "targeted_quantity",
        fieldName: "Quantity Targeted(q)",
        fieldType: 'number',
        id: "targeted_quantity",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "sown_area",
        fieldName: "Area Sown(Ha)",
        fieldType: 'number',
        id: "sown_area",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "expected_production",
        fieldName: "Expected Production",
        fieldType: 'number',
        id: "expected_production",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "field_location",
        fieldName: "Field Location",
        fieldType: 'input',
        id: "field_location",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "proforma_bspI_sent_date",
        fieldName: "Date of Proforma BSP-I Sent",
        fieldType: 'input',
        id: "proforma_bspI_sent_date",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },
    {
        formControlName: "proforma_bspII_sent_date",
        fieldName: "Date of Proforma BSP-II Sent",
        fieldType: 'input',
        id: "proforma_bspII_sent_date",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },

    {
        formControlName: "latitude",
        fieldName: "Latitude",
        fieldType: 'input',
        id: "latitude",
        // validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "longitude",
        fieldName: "Longitude",
        fieldType: 'input',
        id: "longitude",
        // validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "date_of_inspection",
        fieldName: "Date of Inspection",
        fieldType: 'date',
        id: "date_of_inspection",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "monitoring_team_report",
        fieldName: "Report of Monitoring Team",
        fieldType: 'select',
        id: "monitoring_team_report",
        fieldDataList: memberReport,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "team_member_ids",
        fieldName: "Select Team Members",
        fieldType: 'multiselect',
        multiple: true,
        dropdownSettings: {
            idField: 'value',
            textField: 'name',
            enableCheckAll: false,
            limitSelection: -1,
        },
        id: "team_member_ids",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-8 py-2",
    },
    // {
    //     formControlName: "upload",
    //     fieldName: "Upload Team Member's Report PDF, jpeg, jpg, png only, maximum size 2 MB.",
    //     fieldType: 'file',
    //     id: "upload",
    //     validations: [],
    //     gridColClass: "col-12 col-xl-6 py-2",
    // },
];

// BSP Proforma 4 form fieldset
export const bspProformasIVUIFields: Array<SectionFieldType> = [
    // {
    //     formControlName: "production_centre_name",
    //     fieldName: "Production Centre Name",
    //     fieldType: 'input',
    //     id: "production_centre_name",
    //     // fieldDataList: yearOfIndent,
    //     validations: [Validators.required]
    // },
    // {
    //     formControlName: "breeder_name",
    //     fieldName: "Name of Breeder",
    //     fieldType: 'input',
    //     id: "breeder_name",
    //     // fieldDataList: yearOfIndent,
    //     validations: [Validators.required]
    // },
    {
        formControlName: "yearofIndent",
        fieldName: "Year of Indent",
        fieldType: 'select',
        id: "yearofIndent",
        fieldDataList: [],
        validations: [Validators.required]
    },
    {
        formControlName: "season",
        fieldName: "Season",
        fieldType: 'select',
        id: "season",
        fieldDataList: [],
        validations: [Validators.required]
    },
    {
        formControlName: "cropName",
        fieldName: "Crop Name",
        fieldType: 'select',
        id: "cropName",
        fieldDataList: [],
        validations: [Validators.required]
    }
];

export const bspProformasIVVarietyUIFields: Array<SectionFieldType> = [
    {
        formControlName: "add_production_center",
        fieldName: "Add Plant Quantity",
        fieldType: 'button',
        id: "add_production_center",
        // fieldDataList: breederName,
        gridColClass: "col-12 py-2"
    },
    {
        formControlName: "pd_pc_letter_no",
        fieldName: "PD/PC Letter No.",
        fieldType: 'input',
        id: "pd_pc_letter_no",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "allocation_bspI_target",
        fieldName: "Actual Allocation As Per BSP-1 Target",
        fieldType: 'number',
        id: "allocation_bspI_target",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "breeder_seed_produced_actual_quantity",
        fieldName: "Actual Quantity of Breeder Seed Produced",
        fieldType: 'input',
        id: "breeder_seed_produced_actual_quantity",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "carry_over_breeder_seed_year",
        fieldName: "Year of Production of Carry Over Breeder Seed",
        fieldType: 'date',
        id: "carry_over_breeder_seed_year",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "carry_over_seed_quantity",
        fieldName: "Carry Over Seed Quantity",
        fieldType: 'input',
        id: "carry_over_seed_quantity",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },
    {
        formControlName: "carry_over_seed_previous_year_germination",
        fieldName: "Carry Over Seed Previous Year Germination%",
        fieldType: 'input',
        id: "carry_over_seed_previous_year_germination",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "carry_over_seed_current_year_germination",
        fieldName: "Carry Over Seed Current Year Germination(%)",
        fieldType: 'input',
        id: "carry_over_seed_current_year_germination",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "total_availability",
        fieldName: "Total Availability",
        fieldType: 'number',
        id: "total_availability",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "prodution_surplus_over_BSPI_target",
        fieldName: "Prodution Surplus/Deficit Over BSP-1 Target",
        fieldType: 'number',
        id: "prodution_surplus_over_BSPI_target",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "deficit_reason",
        fieldName: "Enter Reason For Deficit",
        fieldType: 'input',
        id: "deficit_reason",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-7 py-2"
    },
    {
        formControlName: "document",
        fieldName: "Supporting Document PDF, JPEG, JPG, PNG Format Only, Maximum Size 2 MB.",
        fieldType: 'file',
        id: "document",
        validations: [Validators.required],
        gridColClass: "col-5 py-2",
    },
    // {
    //     formControlName: "document_deficit_reason",
    //     fieldName: "Upload Document",
    //     fieldType: 'file',
    //     id: "document_deficit_reason",
    //     // fieldDataList: undefined,
    //     validations: [Validators.required],
    //     gridColClass: "col-6 py-2"
    // },
    {
        formControlName: "proformaBSPI_sent_date",
        fieldName: "Date of Proforma BSP-I sent",
        fieldType: 'input',
        id: "proformaBSPI_sent_date",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "proformaBSPII_sent_date",
        fieldName: "Date of Proforma BSP-II sent",
        fieldType: 'input',
        id: "proformaBSPII_sent_date",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "proformaBSPIII_sent_date",
        fieldName: "Date of Proforma BSP-III sent",
        fieldType: 'input',
        id: "proformaBSPIII_sent_date",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "harvest_date",
        fieldName: "Harvest Date",
        fieldType: 'date',
        id: "harvest_date",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "sample_taken_for_seed_testing",
        fieldName: "No. of Samples Taken for Seed Testing/Grow Out Tests",
        fieldType: 'number',
        id: "sample_taken_for_seed_testing",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },

];

// BSP Proforma 5 form fieldset
export const bspProformasVUIFields: Array<SectionFieldType> = [
    // {
    //     formControlName: "production_centre_name",
    //     fieldName: "Production Centre Name",
    //     fieldType: 'input',
    //     id: "production_centre_name",
    //     // fieldDataList: yearOfIndent,
    //     validations: [Validators.required]
    // },
    {
        formControlName: "yearofIndent",
        fieldName: "Year of Indent",
        fieldType: 'select',
        id: "yearofIndent",
        fieldDataList: [],
        validations: [Validators.required]
    },
    {
        formControlName: "season",
        fieldName: "Season",
        fieldType: 'select',
        id: "season",
        fieldDataList: [],
        validations: [Validators.required]
    },
    {
        formControlName: "cropName",
        fieldName: "Crop Name",
        fieldType: 'select',
        id: "cropName",
        fieldDataList: [],
        validations: [Validators.required]
    }
];


export const bspProformasVVarietyUIFields: Array<SectionFieldType> = [
    {
        formControlName: "area_sown",
        fieldName: "Area Sown (ha)",
        fieldType: 'number',
        id: "area_sown",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "field_location",
        fieldName: "Field Location",
        fieldType: 'input',
        id: "field_location",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "grow_date_of_bsp1",
        fieldName: "Authority Under Which Grow-Date of BSP-1",
        fieldType: 'input',
        id: "grow_date_of_bsp1",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "grow_date_of_bsp2",
        fieldName: "Authority Under Which Grow-Date of BSP-2",
        fieldType: 'input',
        id: "grow_date_of_bsp2",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "grow_date_of_bsp3",
        fieldName: "Authority Under Which Grow-Date of BSP-3",
        fieldType: 'input',
        id: "grow_date_of_bsp3",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },
    {
        formControlName: "grow_date_of_bsp4",
        fieldName: "Authority Under Which Grow-Date of BSP-4",
        fieldType: 'input',
        id: "grow_date_of_bsp4",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "no_of_sample",
        fieldName: "No. of Samples Taken For Grow Out Test",
        fieldType: 'number',
        id: "no_of_sample",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "generic_purity",
        fieldName: "Generic Purity (%) in Grow Out",
        fieldType: 'number',
        id: "generic_purity",
        // fieldDataList: undefined,
        validations: [Validators.required, Validators.min(0), Validators.max(100)],
        gridColClass: "col-12 col-xl-4 py-2"
    }
];


export const bspProformasVIVarietyUIFields: Array<SectionFieldType> = [
    {
        formControlName: "indenting_quantity",
        fieldName: "Indenting Quantity",
        fieldType: 'number',
        id: "indenting_quantity",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "indentor",
        fieldName: "Indenter to Whom Breeder Seed Supplied",
        fieldType: 'input',
        id: "indentor",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "actual_production_as_bsp_iv",
        fieldName: "Actual Production",
        // fieldName: "Actual Production on As Per BSP-4",
        fieldType: 'number',
        id: "actual_production_as_bsp_iv",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    // {
    //     formControlName: "lotted_id",
    //     fieldName: "Lot Numbers",
    //     fieldType: 'select-dropdown',
    //     id: "lotted_id",
    //     validations: [Validators.required],
    //     gridColClass: "col-12 col-xl-4 py-2",
    // },
    // {
    //     formControlName: "lable_number",
    //     fieldName: "Lable Number",
    //     fieldType: 'select-dropdown',
    //     id: "lable_number",
    //     // fieldDataList: yearOfIndent,
    //     validations: [Validators.required],
    //     gridColClass: "col-12 col-xl-8 py-2"
    // },
    {
        formControlName: "quantity_of_breeder_seed_allotted",
        fieldName: "Quantity of Breeder Seed Allotted",
        fieldType: 'number',
        id: "quantity_of_breeder_seed_allotted",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "date_of_lifting",
        fieldName: "Date Of Lifting",
        fieldType: 'input',
        id: "date_of_lifting",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "quantity_of_breeder_seed_lifted",
        fieldName: "Quantity of Breeder Seed Lifted",
        fieldType: 'input',
        id: "quantity_of_breeder_seed_lifted",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "quantity_of_breeder_seed_balance",
        fieldName: "Quantity of Breeder Seed Balance",
        fieldType: 'number',
        id: "quantity_of_breeder_seed_balance",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    // {
    //     formControlName: "unlifted_quantity",
    //     fieldName: "Quantity Un-Lifted",
    //     fieldType: 'number',
    //     id: "unlifted_quantity",
    //     // fieldDataList: breederName,
    //     validations: [Validators.required],
    //     gridColClass: "col-12 col-xl-4 py-2"
    // },
    {
        formControlName: "reason_for_short",
        fieldName: "Reason For Short/Excess Supply If Any",
        fieldType: 'input',
        id: "reason_for_short",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    }
];



// BSP Proforma 6 form fieldset
export const bspProformasVIFields: Array<SectionFieldType> = [
    {
        formControlName: "yearofIndent",
        fieldName: "Year of Indent",
        fieldType: 'select',
        id: "yearofIndent",
        fieldDataList: [],
        validations: [Validators.required]
    },
    {
        formControlName: "season",
        fieldName: "Season",
        fieldType: 'select',
        id: "season",
        fieldDataList: [],
        validations: [Validators.required]
    },
    {
        formControlName: "cropName",
        fieldName: "Crop Name",
        fieldType: 'select',
        id: "cropName",
        fieldDataList: [],
        validations: [Validators.required]
    }
];

export const bspProformasViVarietyUIFields: Array<SectionFieldType> = [
    {
        formControlName: "indentingQuantity",
        fieldName: "Indenting Quantity",
        fieldType: 'number',
        id: "indentingQuantity",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "allocationOfBreederSeedToIndentoeForLifting",
        fieldName: "Allocation of Breeder Seed to Indenter for Lifting",
        fieldType: 'number',
        id: "allocationOfBreederSeedToIndentoeForLifting",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "ActualProductionOnAsPerBSP4",
        fieldName: "Actual Production on As Per BSP-4",
        fieldType: 'number',
        id: "ActualProductionOnAsPerBSP4",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "QuantityOfBreederSeedAllotted",
        fieldName: "Quantity of Breeder Seed Allotted",
        fieldType: 'number',
        id: "QuantityOfBreederSeedAllotted",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "QuantityOfBreederSeedLifted",
        fieldName: "Quantity of Breeder Seed Lifted",
        fieldType: 'number',
        id: "QuantityOfBreederSeedLifted",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "QuantityOfBreederSeedBalance",
        fieldName: "Quantity of Breeder Seed Balance",
        fieldType: 'number',
        id: "QuantityOfBreederSeedBalance",
        // fieldDataList: breederName,
        validations: [Validators.required, Validators.maxLength(4), Validators.minLength(1)],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "TargetOfFoundationSeedProduction",
        fieldName: "Target of Foundation Seed Production",
        fieldType: 'number',
        id: "TargetOfFoundationSeedProduction",
        // fieldDataList: breederName,
        validations: [Validators.required, Validators.maxLength(4), Validators.minLength(1)],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "NameAndAddressOfFoundationSeedProducer",
        fieldName: "Name And Address of Foundation Seed Producer",
        fieldType: 'input',
        id: "NameAndAddressOfFoundationSeedProducer",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    }
];

export const NoProformasDataFound: Array<SectionFieldType> = [
    {
        formControlName: "NoDataFound",
        fieldName: "No Record Found",
        fieldType: 'heading',
        id: "NoDataFound",
        validations: [Validators.required]
    },
]



export const bspProformasBillsUIFields: Array<SectionFieldType> = [
    {
        formControlName: "yearofIndent",
        fieldName: "Year of Indent",
        fieldType: 'select',
        id: "yearofIndent",
        fieldDataList: yearOfIndent,
        validations: [Validators.required]
    },
    {
        formControlName: "season",
        fieldName: "Season",
        fieldType: 'select',
        id: "season",
        fieldDataList: seasonData,
        validations: [Validators.required]
    },
    {
        formControlName: "cropName",
        fieldName: "Crop Name",
        fieldType: 'select',
        id: "cropName",
        fieldDataList: cropName,
        validations: [Validators.required]
    },
    {
        formControlName: "cropVarieties",
        fieldName: "Variety",
        fieldType: 'select',
        id: "cropVarieties",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required]
    },
    {
        formControlName: "indentorName",
        fieldName: "Indenting Angency",
        fieldType: 'select',
        id: "indentorName",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required]
    },
    {
        formControlName: "spaName",
        fieldName: "SPA",
        fieldType: 'select',
        id: "spaName",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required]
    },
   
];


export const bspProformasBillsDeatilsUIFields: Array<SectionFieldType> = [
    // {
    //     formControlName: "indented_quantity",
    //     fieldName: "Indented Quantity",
    //     fieldType: 'number',
    //     id: "indented_quantity",
    //     validations: [Validators.required],
    //     gridColClass: "col-12 col-xl-4 py-2"
    // },
    {
        formControlName: "allocated_quantity",
        fieldName: "Allocated Quantity",
        fieldType: 'input',
        id: "allocated_quantity",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    // {
    //     formControlName: "bill_number",
    //     fieldName: "Bill Number",
    //     fieldType: 'input',
    //     id: "bill_number",
    //     // fieldDataList: breederName,
    //     validations: [Validators.required],
    //     gridColClass: "col-12 col-xl-4 py-2"
    // },
    // {
    //     formControlName: "bill_date",
    //     fieldName: "Bill Date",
    //     fieldType: 'input',
    //     id: "bill_date",
    //     // fieldDataList: breederName,
    //     validations: [Validators.required],
    //     gridColClass: "col-12 col-xl-4 py-2"
    // },
    // {
    //     formControlName: "",
    //     fieldName: "",
    //     fieldType: null,
    //     id: "",
    //     // fieldDataList: breederName,
    //     validations: [],
    //     gridColClass: "col-12 col-xl-4 py-2"
    // },
    {
        formControlName: "amount",
        fieldName: "Amount (Rs.)",
        fieldType: 'input',
        id: "amount",
        validations: [Validators.required, Validators.pattern('^[0-9]*$')],
        gridColClass: "col-12 col-xl-4 py-2",
    },
    {
        formControlName: "lotted_id",
        fieldName: "Lot Numbers",
        fieldType: 'multiselect',
        multiple: true,
        dropdownSettings: {
            idField: 'value',
            textField: 'name',
            enableCheckAll: false,
            itemsShowLimit: 2,
            limitSelection: -1,
        },
        id: "lotted_id",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },
    {
        formControlName: "lable_number",
        fieldName: "Label Number",
        fieldType: 'multiselect',
        multiple: true,
        id: "lable_number",
        dropdownSettings: {
            idField: 'value',
            textField: 'name',
            limitSelection: -1,
            enableCheckAll: true,
            itemsShowLimit: 4,
            selectAllText: "Select All ",
            unSelectAllText: "UnSelect All",
        },
        // fieldDataList: yearOfIndent,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-8 py-2"
    },
    {
        formControlName: "total_quantity",
        fieldName: "Total Quantity",
        fieldType: 'number',
        id: "total_quantity",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "available_quantity",
        fieldName: "Available Quantity",
        fieldType: 'number',
        id: "available_quantity",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "region",
        fieldName: "Reason for Deficit Supply",
        fieldType: 'select',
        id: "region",
        fieldDataList: regionData,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
   
    // {
    //     formControlName: "region",
    //     fieldName: "region",
    //     fieldType: 'select',
    //     id: "region",
    //     fieldDataList: regionData,
    //     // fieldDataList: breederName,
    //     validations: [Validators.required],
    //     gridColClass: "col-12 col-xl-4 py-2"
    // }

];
