import { Injectable } from "@angular/core";
import { Validators } from "@angular/forms";
import { LoggedInUserInfoService } from "src/app/services/logged-in-user-info.service";
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { random } from "src/app/_helpers/utility";
import { SectionFieldType } from "../../types/sectionFieldType";
import { SeedServiceService } from "src/app/services/seed-service.service";

const todayDate = new Date();
let yearOfIndent: any = [];
let seasonListData: any = [];

let cropName: any = [];
let breederName: any = []
let verieties: any = [];
let seasonList: any = [];
let cropGroup: any = [];

function createYearRange(start: number, end: number): void {
    yearOfIndent = [
        { name: "2020-21", "value": "2020" },
        { name: "2021-22", "value": "2021" },
        { name: "2022-23", "value": "2022" },
        { name: "2023-24", "value": "2023" },
        { name: "2024-25", "value": "2024" },
        // { name: "2025-26", "value": "2025" }
    ]
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

addSelectData(breederName, "Breeder", 4);

createYearRange(1990, todayDate.getFullYear());

@Injectable({
    providedIn: 'root'
})
export class BspProformasSearchUIFields {
    constructor(breederService: BreederService, seedService: SeedServiceService) {
        breederService.getRequestCreatorNew("get-breeder-crop-list").subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    let crop = x
                    if (crop != null) {
                        x["name"] = crop['m_crop.crop_name'];
                        x["value"] = crop['crop_code'];
                        cropName.push(x);
                    }

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

        // breederService.getRequestCreatorNew("getCropGroup").subscribe((data: any) => {
        //     if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        //         data.EncryptedResponse.data.forEach((x: any, index: number) => {
        //             var temp = {}
        //             temp["name"] = x.group_name;
        //             temp["value"] = x.group_code;
        //             cropGroup.push(temp);

        //         });
        //     }
        // });
    }
    get get(): Array<SectionFieldType> {
        return [
            {
                formControlName: "yearofIndent",
                fieldName: "Year of Indent",
                fieldType: 'select',
                id: "yearofIndent",
                fieldDataList: [],
                validations: undefined
            },
            {
                formControlName: "season",
                fieldName: "Season",
                fieldType: 'select',
                id: "season",
                fieldDataList: [],
                validations: undefined
            },
            {
                formControlName: "cropGroup",
                fieldName: "Crop Group",
                fieldType: 'select',
                id: "cropGroup",
                fieldDataList: [],
                validations: [Validators.required]
            },
            {
                formControlName: "cropName",
                fieldName: "Crop Name",
                fieldType: 'select',
                id: "cropName",
                fieldDataList: [],
                validations: undefined
            },

            {
                formControlName: "veriety",
                fieldName: "Variety Name",
                fieldType: 'select',
                id: "veriety",
                fieldDataList: [],
                validations: undefined
            },
            {
                formControlName: "reportStatus",
                fieldName: "Report Status",
                fieldType: 'select',
                id: "reportStatus",
                fieldDataList: [],
                validations: undefined
            }
        ];
    }

    get seedDivisionAllocation(): Array<SectionFieldType> {
        return [
            {
                formControlName: "yearofIndent",
                fieldName: "Year of Indent",
                fieldType: 'select',
                id: "yearofIndent",
                fieldDataList: [],
                validations: undefined
            },
            {
                formControlName: "season",
                fieldName: "Season",
                fieldType: 'select',
                id: "season",
                fieldDataList: [],
                validations: undefined
            },
            {
                formControlName: "cropName",
                fieldName: "Crop Name",
                fieldType: 'select',
                id: "cropName",
                fieldDataList: [],
                validations: undefined
            },

            {
                formControlName: "veriety",
                fieldName: "Variety Name",
                fieldType: 'select',
                id: "veriety",
                fieldDataList: [],
                validations: undefined
            }
        ];
    }
    get getforLabelNumber(): Array<SectionFieldType> {
        return [
            {
                formControlName: "yearofIndent",
                fieldName: "Year of Indent",
                fieldType: 'select',
                id: "yearofIndent",
                fieldDataList: [],
                validations: undefined
            },
            {
                formControlName: "season",
                fieldName: "Season",
                fieldType: 'select',
                id: "season",
                fieldDataList: [],
                validations: undefined
            },
            {
                formControlName: "cropName",
                fieldName: "Crop Name",
                fieldType: 'select',
                id: "cropName",
                fieldDataList: null,
                validations: [Validators.required]
            },
            {
                formControlName: "veriety",
                fieldName: "Variety Name",
                fieldType: 'select',
                id: "veriety",
                fieldDataList: verieties,
                validations: [Validators.required]
            }
        ];
    }
}

