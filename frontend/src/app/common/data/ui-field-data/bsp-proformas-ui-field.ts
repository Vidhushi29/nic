import { Validators } from "@angular/forms";
import { random } from "src/app/_helpers/utility";
import { SectionFieldType } from "../../types/sectionFieldType";
import { MasterService } from "src/app/services/master/master.service";
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { SeedServiceService } from "src/app/services/seed-service.service";


const todayDate = new Date();
let yearOfIndent: any = [];
let cropName: any = [];
let breederName: any = [];
let veriety: any = [];
let production_centre_name: any = 'production_centre_name';
let nodal_officer_detail: any = 'Name of Nodal Officer and Address and Designation';
let being_produced: any = [
    { name: "Yes", value: "true" },
    { name: "No", value: "false" }
];
let monitoringTeam: any = [
    { name: "Satisfactory", value: "satisfactory" },
    { name: "Re-monitoring after 15 days", value: "re-monitoring_after_15_days" },
    { name: "Unsatisfactory", value: "unsatisfactory" },
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
    varietyNameValue.nodalAddressDesignation = "Nodal Address-" + random(1, 10) + " and Designation-" + random(1, 10);
    varietyNameValue.availableNucleusSeed = "Available Nucleus Seed-" + random(1, 10);
    if (!areFields) {
        varietyNameValue.breederData = { name: "Breeder-" + breederDataId, value: breederDataId };
        varietyNameValue.availableNucleusSeed2 = "Available Nucleus Seed-" + random(1, 10);
    }
}

addSelectData(cropName, "Crop", 4);
addSelectData(breederName, "Breeder", 4);

createYearRange(1990, todayDate.getFullYear());

// BSP Proforma 1 form fieldset

export class BspSubmissionNodalUIFields {
    constructor(masterService: MasterService) {
        masterService.getRequestCreatorNew("get-crop-list").subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    x["name"] = x.crop_name;
                    x["value"] = x.crop_code;
                    // x["cropType"] = "Crop Type - " + '0' + index;
                    cropName.push(x);
                });

            }
        });
    }
    get get(): Array<SectionFieldType> {
        return [
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
    }
}


export const bspProformasIUIFields: Array<SectionFieldType> = [
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

export const bspProformasIVarietyUIFields: Array<SectionFieldType> = [
    {
        formControlName: "year_of_release",
        fieldName: "Year of Notification",
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
        fieldType: 'input',
        id: "indent_quantity",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "add_production_center",
        fieldName: "Add Production Center",
        fieldType: 'button',
        id: "add_production_center",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-12 py-2"
    },
];

export const bspProformasIProductionCenterUIFields: Array<SectionFieldType> = [
    {
        formControlName: "production_centre_id",
        fieldName: "Production Centre Name",
        fieldType: 'select',
        id: "production_centre_id",
        fieldDataList: [],
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "contact_officer_info",
        fieldName: "Name of Contact Person And Designation",
        fieldType: 'input',
        id: "contact_officer_info",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },
    {
        formControlName: "officer_address_info",
        fieldName: "Contact Officer Address",
        fieldType: 'input',
        id: "officer_address_info",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },
    {
        formControlName: "available_nucleus_seed",
        fieldName: "Available Nucleus Seed",
        fieldType: 'input',
        id: "available_nucleus_seed",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "breeder_seed_quantity",
        fieldName: "Quantity of Breeder Seed to be Produced",
        fieldType: 'input',
        id: "breeder_seed_quantity",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "monitoring_team_memebers_count",
        fieldName: "Members of the Monitoring Team ",
        fieldType: 'input',
        id: "monitoring_team_memebers_count",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },
    {
        formControlName: "remove_production_center",
        fieldName: "Remove Production Center",
        fieldType: 'button',
        id: "remove_production_center",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-12 py-2"
    },
];

// BSP Proforma 2 form fieldset
export const bspProformasIIUIFields: Array<SectionFieldType> = [
    {
        formControlName: "production_centre_name",
        fieldName: "Production Centre Name",
        fieldType: 'input',
        id: "production_centre_name",
        fieldDataList: [],
        validations: [Validators.required]
    },
    {
        formControlName: "nodal_officer_detail",
        fieldName: "Name of Nodal Officer and Address and Designation",
        fieldType: 'input',
        id: "nodal_officer_detail",
        fieldDataList: [],
        validations: [Validators.required]
    },
    {
        formControlName: "yearofIndent",
        fieldName: "Year of Indent",
        fieldType: 'select',
        id: "yearofIndent",
        // fieldDataList: yearOfIndent.sort((a, b) => b.value - a.value),
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
        formControlName: "targeted_quantity",
        fieldName: "Quantity Targeted(q)",
        fieldType: 'input',
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
        formControlName: "sowing_date",
        fieldName: "Date of Sowing Office order, cash memo/BNSIV etc.",
        fieldType: 'date',
        id: "sowing_date",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
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
        formControlName: "availability_expected_date",
        fieldName: "Expected Date of Availability",
        fieldType: 'date',
        id: "availability_expected_date",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
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
        formControlName: "if_not_being_produced",
        fieldName: "If Not Being Produced",
        fieldType: 'radio',
        id: "if_not_being_produced",
        fieldDataList: being_produced,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },

    // Radio buttons are left with reason field

];

// BSP Proforma 3 form fieldset
export const bspProformasIIIUIFields: Array<SectionFieldType> = [
    {
        formControlName: "production_centre_name",
        fieldName: "Production Centre Name",
        fieldType: 'input',
        id: "production_centre_name",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required]
    },
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

export const bspProformasIIIVarietyUIFields: Array<SectionFieldType> = [
    {
        formControlName: "targeted_quantity",
        fieldName: "Quantity Targeted(q)",
        fieldType: 'input',
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
        formControlName: "proforma_bspI_sent_date",
        fieldName: "Date of Proforma BSP-I Sent",
        fieldType: 'date',
        id: "proforma_bspI_sent_date",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
    },
    {
        formControlName: "proforma_bspII_sent_date",
        fieldName: "Date of Proforma BSP-II Sent",
        fieldType: 'date',
        id: "proforma_bspII_sent_date",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "monitoring_team_report",
        fieldName: "Report of Monitoring Team (Based on isolation distance, seed source, purity, incidence of seed borne diseases, insects, weeds etc)",
        fieldType: 'select',
        id: "monitoring_team_report",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2",
        fieldDataList: monitoringTeam,
    },
];

// BSP Proforma 4 form fieldset
export const bspProformasIVUIFields: Array<SectionFieldType> = [
    {
        formControlName: "production_centre_name",
        fieldName: "Production Centre Name",
        fieldType: 'input',
        id: "production_centre_name",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required]
    },
    {
        formControlName: "breeder_name",
        fieldName: "Name of Breeder",
        fieldType: 'input',
        id: "breeder_name",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required]
    },
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

export const bspProformasIVVarietyUIFields: Array<SectionFieldType> = [
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
        fieldName: "Actual Allocation as per BSP-1 Target",
        fieldType: 'input',
        id: "allocation_bspI_target",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "breeder_seed_produced_actual_quantity",
        fieldName: "Actual Quantity of Breeder Seed Produced (A)",
        fieldType: 'input',
        id: "breeder_seed_produced_actual_quantity",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "carry_over_breeder_seed_year",
        fieldName: "Year of Production of Carry over Breeder Seed",
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
        fieldName: "Total Availability (C)",
        fieldType: 'input',
        id: "total_availability",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "prodution_surplus_over_BSPI_target",
        fieldName: "Prodution Surplus (+)/Deficit(-) Over BSP-1 Target",
        fieldType: 'input',
        id: "prodution_surplus_over_BSPI_target",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "deficit_reason",
        fieldName: "Enter Reason for Deficit",
        fieldType: 'input',
        id: "deficit_reason",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 py-2"
    },
    {
        formControlName: "document_deficit_reason",
        fieldName: "Upload Document",
        fieldType: 'file',
        id: "document_deficit_reason",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-6 py-2"
    },
    {
        formControlName: "proformaBSPI_sent_date",
        fieldName: "Date of Proforma BSP-I sent",
        fieldType: 'date',
        id: "proformaBSPI_sent_date",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "proformaBSPII_sent_date",
        fieldName: "Date of Proforma BSP-II sent",
        fieldType: 'date',
        id: "proformaBSPII_sent_date",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "proformaBSPIII_sent_date",
        fieldName: "Date of Proforma BSP-III sent",
        fieldType: 'date',
        id: "proformaBSPIII_sent_date",
        // fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "sample_taken_for_seed_testing",
        fieldName: "No. of Samples Taken for Seed Testing/Grow Out Tests",
        fieldType: 'input',
        id: "sample_taken_for_seed_testing",
        // fieldDataList: undefined,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
];