import { Validators } from "@angular/forms";
import { random } from "src/app/_helpers/utility";
import { SectionFieldType } from "../../types/sectionFieldType";

const todayDate = new Date();
let yearOfIndent:any = [];
let Season:any = [];
let cropName:any = [];
let cropGroup:any=[];
let varietyName:any = [];
let unitKgQ:any = [
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

addSelectData(Season, "Season", 4);
addSelectData(cropName, "Crop", 4);
addSelectData(cropGroup, "cropGroup", 4);
console.log(addSelectData(cropName, "Crop", 4),'addSelectData(cropGroup, "cropGroup", 4);');


export const breederSeedSubmissionNodalUIFields: Array<SectionFieldType> = [
    {
        formControlName: "yearofIndent",
        fieldName: "Year of Indent",
        fieldType: 'select',
        id: "yearofIndent",
        fieldDataList: yearOfIndent,
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

export const AddCropUIFields: Array<SectionFieldType> = [
    {
        formControlName: "addCrop",
        fieldName: "Add Crop",
        fieldType: 'select',
        id: "yearofIndent",
        fieldDataList: yearOfIndent,
        validations: [Validators.required]
    },
    {
        formControlName: "Season",
        fieldName: "Season",
        fieldType: 'select',
        id: "season",
        fieldDataList: Season,
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
        formControlName: "croupGroup",
        fieldName: "Crop Group",
        fieldType: 'select',
        id: "cropGroup",
        fieldDataList: cropGroup,
        
    },
    {
        formControlName: "varietyName",
        fieldName: "Variety Name",
        fieldType: 'select',
        id: "varietyName",
        fieldDataList: varietyName,
        validations: [Validators.required]
    },
    {
        formControlName: "varietyNotificationYear",
        fieldName: "Variety Notification Year",
        fieldType: 'input',
        id: "varietyNotificationYear",
        validations: [Validators.required]
    },
    {
        formControlName: "indentQuantity",
        fieldName: "Indent Quantity",
        fieldType: 'input',
        id: "indentQuantity",
        validations: [Validators.required]
    },
    {
        formControlName: "unitKgQ",
        fieldName: "Unit (Kg/q)",
        fieldType: 'radio',
        id: "unitKgQ",
        fieldDataList: unitKgQ
    }
];