import { Injectable } from "@angular/core";
import { Validators } from "@angular/forms";
import { MasterService } from "src/app/services/master/master.service";
import { SeedDivisionService } from "src/app/services/seed-division/seed-division.service";
import { SectionFieldType } from "../../types/sectionFieldType";

const todayDate = new Date();
let yearOfIndent: any = [];
let Season: any = [];
let cropName: any = [];
let varietyName: any = [];
let groupName: any = [];
let unitKgQ: any = [
    { name: "Kilogram", value: "kilogram" },
    { name: "Quintal", value: "quintal" }
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
        }
    }
}

// addSelectData(Season, "Season", 4);
// addSelectData(cropName, "Crop", 4);
// addSelectData(varietyName, "Variety", 4);

createYearRange(1990, todayDate.getFullYear());

@Injectable({
    providedIn: 'root'
})

export class SeedDivisionSerarchUI {
    constructor(masterService: MasterService,
        _service: SeedDivisionService) {
        masterService.getRequestCreatorNew("get-crop-list").subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    x["name"] = x.crop_name;
                    x["value"] = x.crop_code;
                    x["cropType"] = "Crop Type - " + '0' + index;
                    cropName.push(x);
                });
            }
        });
        masterService.postRequestCreator("get-crop-variety-list").subscribe((data: any) => {
            // console.log('get-crop-variety-list',data)
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    x["name"] = x.variety_name;
                    x["value"] = x.variety_code;
                    varietyName.push(x);
                });
            }
        });
        _service.postRequestCreator("get-crop-group").subscribe((data: any) => {
            console.log('data===groupData', data);
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    x["name"] = x.group_name;
                    x["value"] = x.group_code;
                    // x["cropType"] = "Crop Type - " + '0' + index;
                    groupName.push(x);
                });
            }
        });
    };

    get get(): Array<SectionFieldType> {
        return [
            {
                formControlName: "cropGroup",
                fieldName: "Crop Group",
                fieldType: 'select',
                id: "cropGroup",
                fieldDataList: groupName,
                validations: undefined
            },
            {
                formControlName: "cropName",
                fieldName: "Crop Name",
                fieldType: 'select',
                id: "cropName",
                fieldDataList: cropName,
                validations: undefined
            },
            {
                formControlName: "varietyName",
                fieldName: "Variety Name",
                fieldType: 'select',
                id: "varietyName",
                fieldDataList: varietyName,
                validations: undefined
            },
        ];
    }
}

export const AllocationBreederSeedIndentorLiftingFields: Array<SectionFieldType> = [
    {
        formControlName: "yearofIndent",
        fieldName: "Year of Indent",
        fieldType: 'select',
        id: "yearofIndent",
        fieldDataList: yearOfIndent,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4"
    },
    {
        formControlName: "season",
        fieldName: "Season",
        fieldType: 'select',
        id: "season",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4"
    },
    {
        formControlName: "cropName",
        fieldName: "Crop Name",
        fieldType: 'select',
        id: "cropName",
        fieldDataList: cropName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4"
    },
    // {
    //     formControlName: "indentorName",
    //     fieldName: "Indentor",
    //     fieldType: 'select',
    //     id: "indentorName",
    //     // fieldDataList: yearOfIndent,
    //     validations: [Validators.required]
    // }
];

export const VerietyAllocationBreederSeedIndentorLiftingFields: Array<SectionFieldType> = [
    
    {
        formControlName: "variety",
        fieldName: "Variety",
        fieldType: 'select',
        id: "variety",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4"
    }
]

export const AllocationBreederSeedIndentorUIFields: Array<SectionFieldType> = [
    {
        formControlName: "indentingQuantity",
        fieldName: "Indenting Quantity",
        fieldType: 'number',
        id: "indentingQuantity",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
     {
        formControlName: "add_production_center",
        fieldName: "Add Production Center",
        fieldType: 'button',
        id: "add_production_center",
        // fieldDataList: breederName,
        gridColClass: "col-12 col-xl-8 py-2"
    },
];


export const AllocationBreederSeedIndentorUIFieldsMultipleProduction: Array<SectionFieldType> = [
    {
        formControlName: "productionCenter",
        fieldName: "Production Center Name",
        fieldType: 'select',
        id: "productionCenter",
        // fieldDataList: cropName,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "nodelOfficerDetail",
        fieldName: "Name of Nodel Officer And Designation",
        fieldType: 'input',
        id: "nodelOfficerDetail",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "nodelOfficerAddress",
        fieldName: "Nodel Officer Address",
        fieldType: 'input',
        id: "nodelOfficerAddress",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "actualProduction",
        fieldName: "Actual Production on As Per BSP-4",
        fieldType: 'number',
        id: "actualProduction",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "quantityOfBreederSeedAllocated",
        fieldName: "Quantity Of Breeder Seed Allocated",
        fieldType: 'number',
        id: "quantityOfBreederSeedAllocated",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "addQuantityOfBreederSeedletf",
        fieldName: "Quantity Of Breeder Seed Left",
        fieldType: 'input',
        id: "addQuantityOfBreederSeedletf",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required],
        gridColClass: "col-12 col-xl-4 py-2"
    },
    {
        formControlName: "remove_production_center",
        fieldName: "Remove Production Center",
        fieldType: 'button',
        id: "remove_production_center",
        // fieldDataList: breederName,
        gridColClass: "col-12 col-xl-12 py-2"
    },
];