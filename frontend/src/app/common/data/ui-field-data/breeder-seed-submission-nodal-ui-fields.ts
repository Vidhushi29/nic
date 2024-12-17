import { Injectable } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { LoggedInUserInfoService } from "src/app/services/logged-in-user-info.service";
import { MasterService } from "src/app/services/master/master.service";
import { random } from "src/app/_helpers/utility";
import { SectionFieldType } from "../../types/sectionFieldType";

const todayDate = new Date();
let yearOfIndent: any = [
    { name: "2020-21", "value": "2020" },
    { name: "2021-22", "value": "2021" },
    { name: "2022-23", "value": "2022" },
    { name: "2023-24", "value": "2023" },
    { name: "2024-25", "value": "2024" },
    // { name: "2025-26", "value": "2025" }
];
let cropName: any = [];
let breederName: any = []
let YearData: any = []
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

// addSelectData(breederName, "Breeder", 4);

// createYearRange(1990, todayDate.getFullYear());

@Injectable({
    providedIn: 'root'
})
export class BreederSeedSubmissionNodalUIFields {
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

        masterService.postRequestCreator("get-user-filtered-list", null, {
            "search": {
                "is_active": 1,
                "user_type": "BR"
            }
        }).subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    const breederData = { ...x };
                    breederName.push(breederData);
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
                fieldDataList: yearOfIndent.sort((a, b) => b.value - a.value),
                validations: [Validators.required]
            },
            {
                formControlName: "cropName",
                fieldName: "Crop Name",
                fieldType: 'select',
                fieldDataList: cropName,
                validations: [Validators.required]
            }
        ];
    }
}

export const selectBreederNameNodalUIFields: Array<SectionFieldType> = [
    {
        formControlName: "indentingAgency",
        fieldName: "Indenting Agency",
        fieldType: 'input',
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "indentingQuantity",
        fieldName: "Indenting Quantity",
        fieldType: 'input',
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "selectBreederName",
        fieldName: "Name of Cordinating Institute",
        fieldType: 'select',
        fieldDataList: breederName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "nodalAddressDesignation",
        fieldName: "Nodal Officer and Designation",
        fieldType: 'input',
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "address",
        fieldName: "Address",
        fieldType: 'input',
        gridColClass: "col-12 col-xl-4 py-2",
    },
    {
        formControlName: "availableNucleusSeed",
        fieldName: "Available Nucleus Seed(Kg)",
        fieldType: 'number',
        gridColClass: "col-12 col-xl-4 py-2",
        validations: [Validators.required]
    },
    {
        formControlName: "allocateNucleusSeed",
        fieldName: "Allocate Breeder Seed for Production",
        fieldType: 'number',
        gridColClass: "col-12 col-xl-4 py-2",
        validations: [Validators.required]
    }
    
];

export type accordionFormGroupAndFieldList = {
    formGroup: FormGroup,
    dynamicControllerId: number,
    agencyId: number,
    arrayfieldsIIndPartList: Array<SectionFieldType>
}

export type accordionUIDataType = {
    name: string,
    varietyId: number,
    formGroupAndFieldList: Array<accordionFormGroupAndFieldList>
}

export type bspAccordionFormGroupAndFieldList = {
    formGroup: FormGroup,
    dynamicControllerId: number,
    indentOfBreederseedId: number,
    arrayfieldsIIndPartList: Array<SectionFieldType>
}

export type accordionUIDataTypeBSP = {
    name: string,
    varietyId: number,
    bsp_5_a_id: number,
    formGroupAndFieldList: Array<bspAccordionFormGroupAndFieldList>
}


export type bspIAccordionFormGroupAndFieldList = {
    formGroup: FormGroup,
    dynamicControllerId: number,
    indentOfBreederseedId: number,
    agencyDetailId: number,
    productionCenters: Array<bspIAccordionFormGroupAndFieldListProduction>,
    arrayfieldsIIndPartList: Array<SectionFieldType>
}

export type bspIAccordionFormGroupAndFieldListProduction = {
    formGroup: FormGroup,
    dynamicControllerId: number,
    indentOfBreederseedId: number,
    agencyDetailId: number,
    arrayfieldsIIndPartList: Array<SectionFieldType>
}

export type accordionUIDataTypeBSPI = {
    name: string,
    varietyId: number,
    formGroupAndFieldList: Array<bspIAccordionFormGroupAndFieldList>
}