import { Validators } from "@angular/forms";
import { SectionFieldType } from "../../types/sectionFieldType";

const todayDate = new Date();
let yearOfIndent:any = [];
let Season:any = [];
let cropName:any = [];
let varietyName:any = [];

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
addSelectData(varietyName, "Variety", 4);

createYearRange(1990, todayDate.getFullYear());

export const AddSeedTestingLaboratoryUIFields: Array<SectionFieldType> = [
    {
        formControlName: "state_id",
        fieldName: "State",
        fieldType: 'select',
        id: "state",
        // fieldDataList: yearOfIndent,
        validations: [Validators.required]
    },
    {
        formControlName: "district_id",
        fieldName: "District",
        fieldType: 'select',
        id: "district",
        // fieldDataList: cropName,
        validations: [Validators.required]
    },
    {
        formControlName: "lab_name",
        fieldName: "Lab Name",
        fieldType: 'input',
        id: "lab_name",
        // fieldDataList: varietyName,
        validations: [Validators.required]
    },    
];