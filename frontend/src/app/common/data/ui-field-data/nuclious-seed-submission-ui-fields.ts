import { Injectable } from "@angular/core";
import { Validators } from "@angular/forms";
import { MasterService } from "src/app/services/master/master.service";
// import { MasterService } from "src/app/services/master/master.service";
import { ProductioncenterService } from "src/app/services/productionCenter/productioncenter.service";
import { SeedServiceService } from "src/app/services/seed-service.service";
import { SectionFieldType } from "../../types/sectionFieldType";

const todayDate = new Date();
let yearOfIndent: any = [];
let Season: any = [];
let cropName: any = [];
let cropNameList: any = [];
let seasonList :any = [] ;
let varietyName: any = [];
const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));    
let unitKgQ: any = [
    { name: "Kilogram", value: "kilogram" },
    { name: "Quintal", value: "quintal" }
]

// function createYearRange(start: number, end: number): void {
//     if (start <= end) {
//         yearOfIndent.push({ name: start + "", value: start });
//         createYearRange(start + 1, end);
//     }
// }
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
// addSelectData(cropName, "Crop", 4);
// addSelectData(varietyName, "Variety", 4);

// createYearRange(1990, todayDate.getFullYear());
@Injectable({
    providedIn: 'root'
})
export class NucliousbreederSeedSubmissionUIFields {
    
    constructor(productService: ProductioncenterService, seedService: SeedServiceService) {
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
        // productService.postRequestCreator("get-nucleus-seed-availabity-year-data").subscribe((data: any) => {
        //     if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        //         data.EncryptedResponse.data.forEach((x: any, index: number) => {
        //             console.log('x', x);

        //             x["name"] = (x.year) + '-' + (parseInt(x.year) + 1 - 2000);
        //             x["value"] = x.year;
        //             // x["cropType"] = "Crop Type - " + '0' + index;
        //             yearOfIndent.push(x);
        //         });
        //     }
        // });

        // seedService.postRequestCreator("get-season-details").subscribe((data: any) => {
        //     console.log('seasonList',seasonList);
        //     if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        //         data.EncryptedResponse.data.forEach((x: any, index: number) => {
        //             x["name"] = x.season;
        //             x["value"] = x.season_code;
        //             seasonList.push(x);
        //             console.log('seasonList',seasonList);
        //         });
        //     }
        // });
        // cropNameList.length=0;
        // const data = productService.getData();
        // // console.log('cropName nucleus module ===================',data);
        // if (data) {

        //     data.forEach((x: any,) => {
        //         if (x) {
        //             let arr = []
        //             for(let i =0;i<x.length;i++){
        //                 x["name"]= x[i].crop_name;
        //                 x["value"]= x[i].crop_code;
        //                 // arr.push(x)

                        
        //                 // cropNameList.push(x)
                        
        //             //   console.log(clean);
        //             cropNameList.push(x)
        //             // console.log('cropName List data =======',cropNameList)
                        
        //             }
        //             // console.log(x[io].m_crop);
                    
        //         }



        //     })
        // }
       
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
                formControlName: "season",
                fieldName: "Season",
                fieldType: 'select',
                id: "season",
                fieldDataList: seasonList,
                validations: undefined
            },
            {
                formControlName: "cropName",
                fieldName: "Crop Name",
                fieldType: 'select',
                id: "cropName",
                fieldDataList: cropNameList,
                validations: [Validators.required]
            },
            // {
            //     formControlName: "cropType",
            //     fieldName: "Crop Type",
            //     fieldType: 'input',
            //     id: "cropType",
            //     htmlControlSuffixText: "Agriculture Crops in Quintals & Horticulture Crops In Kilograms"
            // },
            {
                formControlName: "varietyName",
                fieldName: "Variety Name",
                fieldType: 'select',
                id: "varietyName",
                fieldDataList: varietyName,
                validations: [Validators.required]
            },
        ];
    }
} 