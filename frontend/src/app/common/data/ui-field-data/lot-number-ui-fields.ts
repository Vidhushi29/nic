import { Injectable } from "@angular/core";
import { Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MasterService } from "src/app/services/master/master.service";
import { ProductioncenterService } from "src/app/services/productionCenter/productioncenter.service";
import { SeedServiceService } from "src/app/services/seed-service.service";
import { random } from "src/app/_helpers/utility";
import { SectionFieldType } from "../../types/sectionFieldType";

const todayDate = new Date();
let yearOfIndent: any = [
    // { name: "2025-26", "value": "2025" },
    // { name: "2024-25", "value": "2024" },
    // { name: "2023-24", "value": "2023" },
    // { name: "2022-23", "value": "2022" },
    // { name: "2021-22", "value": "2021" },
    // { name: "2020-21", "value": "2020" },
];
let yearOfIndentDynamic: any = [];
let cropName: any = [];
let breederName: any = []
let production_centre_name: any = 'production_centre_name';
let nodal_officer_detail: any = 'Name of Nodal Officer and Address and Designation';
let being_produced: any = [
    { name: "Yes", value: "true" },
    { name: "No", value: "false" }
]

let seasonList: any = [];

function createYearRange(start: number, end: number): void {
    if (start <= end) {
        // yearOfIndent.push({ name: start + "", value: start });
        // yearOfIndent.sort((a, b) => b.value - a.value);
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

// createYearRange(1990, todayDate.getFullYear());
@Injectable({
    providedIn: 'root'
})
export class lotNumberUIFields {
    isView: boolean;
    constructor(private router: Router,productService: ProductioncenterService, masterService: MasterService, seedService: SeedServiceService) {

        this.isView = router.url.indexOf("view") > 0
        productService.postRequestCreator("get-crop-name").subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    x["name"] = x.crop_name;
                    x["value"] = x.crop_code;
                    x["cropType"] = "Crop Type - " + '0' + index;
                    cropName.push(x);
                });
            }
        });

        seedService.postRequestCreator("get-season-details").subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    x["name"] = x.season;
                    x["value"] = x.Season_code;
                    seasonList.push(x);
                });
            }
        });
        productService.postRequestCreator("get-year-for-lotNumber").subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    x["name"] = x.year + '-' + (x.year + 1 - 2000);
                    x["value"] = x.year;

                    yearOfIndent.push(x);
                    yearOfIndent.sort((a, b) => b.value - a.value);
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
                fieldDataList: yearOfIndent,
                validations: [Validators.required]
            },
            {
                formControlName: "season",
                fieldName: "Season",
                fieldType: 'select',
                id: "season",
                fieldDataList: seasonList,
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
                formControlName: "spp_id",
                fieldName: "SPP",
                fieldType: 'select',
                id: "spp_id",
                fieldDataList: [],
                validations: [Validators.required]
            },

        ];
    }
}


export const selectLotNumberUIFieldsUIFields: Array<SectionFieldType> = [
    {
        formControlName: "max_lot_size",
        fieldName: "Max LOT Size",
        fieldType: 'input',
        id: "max_lot_size_id",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "breeder_seed_production_id",
        fieldName: "Actual Quantity of Breeder Seed Produced",
        fieldType: 'input',
        id: "breeder_seed_production_id",
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "lot_number",
        fieldName: " ",
        fieldType: 'input',
        id: "lot_number",
        validations: undefined,
        gridColClass: "col-12 col-xl-4 py-2"
    },

];

