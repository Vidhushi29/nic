import { Injectable } from "@angular/core";
import { Validators } from "@angular/forms";
import { MasterService } from "src/app/services/master/master.service";
import { RestService } from "src/app/services/rest.service";
import { SeedServiceService } from "src/app/services/seed-service.service";
import { SectionFieldType } from "../../types/sectionFieldType";

const todayDate = new Date();
let yearOfIndent: any = [];
let Season: any = [];
let croupGroup: any=[];
let varietyName: any = [];
let cropName: any = [];
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

addSelectData(Season, "Season", 4);
// addSelectData(varietyName, "Variety", 4);

createYearRange(1990, todayDate.getFullYear());

@Injectable({
    providedIn: 'root'
})
export class AddCropListUI {

    constructor(masterService: SeedServiceService) {
        masterService.postRequestCreator("filter-data").subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    x["name"] = x.crop_name;
                    x["value"] = x.crop_name;
                    x["cropType"] = "Crop Type - " + '0' + index;
                    cropName.push(x);
                });
               


            }
            
         
        });
        masterService.postRequestCreator("crop-group").subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    x["name"] = x.group_name;
                    x["value"] = x.group_name;
                    x["cropType"] = "Crop Type - " + '0' + index;
                    croupGroup.push(x);
                });
               


            }
            
         
        });

        
    }

    get get(): Array<SectionFieldType> {
        return [
            {
                formControlName: "croupGroup",
                fieldName: "Croup Group",
                fieldType: 'select',
                id: "croupGroup",
                fieldDataList: croupGroup,
               
            },
            {
                formControlName: "season",
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
               
            },
            {
                formControlName: "cropType",
                fieldName: "Crop Type",
                fieldType: 'input',
                id: "cropType",
                htmlControlSuffixText: "Agriculture Crops in Quintals & Horticulture Crops In Kilograms"
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
                fieldType: 'number',
                id: "indentQuantity",
                validations: [Validators.required],
                maxLength: 8
            },
            {
                formControlName: "unitKgQ",
                fieldName: "Unit (Kg/q)",
                fieldType: 'radio',
                id: "unitKgQ",
                fieldDataList: unitKgQ
            }
        ];
    }
}
