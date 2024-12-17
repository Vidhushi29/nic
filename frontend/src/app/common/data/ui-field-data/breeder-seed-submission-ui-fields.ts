import { Injectable } from "@angular/core";
import { Validators } from "@angular/forms";
import { IndenterService } from "src/app/services/indenter/indenter.service";
import { MasterService } from "src/app/services/master/master.service";
import { RestService } from "src/app/services/rest.service";
import { SeedDivisionService } from "src/app/services/seed-division/seed-division.service";
import { SectionFieldType } from "../../types/sectionFieldType";

const todayDate = new Date();
let yearOfIndent: any = [
    { name: "2024-25", "value": "2024" },
    { name: "2023-24", "value": "2023" },
    { name: "2022-23", "value": "2022" },
    { name: "2021-22", "value": "2021" },
    { name: "2020-21", "value": "2020" },
    { name: "2019-20", "value": "2019" },
    { name: "2018-19", "value": "2018" },
    // { name: "2020 - 2021", "value": "2020" },
    // { name: "2021 - 2022", "value": "2021" },
    // { name: "2022 - 2023", "value": "2022" },
    // { name: "2023 - 2024", "value": "2023" },
    // { name: "2024 - 2025", "value": "2024" },
    // { name: "2025 - 2026", "value": "2025" }
];
let Season: any = [];
let varietyName: any = [];
let cropName: any = [];
let season: any = [];
let cropGroup: any = [];
let cropGroupList: any = [];
let cropNameListtwo:any=[];
let newData;
let result=[];
// cropGroupList.push(thiis.)
let cropNameList :any=[];
let cropTypeValue: any = [
    { name: "Agriculture", value: "agriculture" },
    { name: "Horticulture", value: "horticulture" }
];
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
addSelectData(varietyName, "Variety", 4);

// createYearRange(1990, todayDate.getFullYear());

@Injectable({
    providedIn: 'root'
})
export class BreederSeedSubmissionUIFields {
    // indetor-crop-group
    constructor(masterService: MasterService, _service: SeedDivisionService,private indentorService:IndenterService) {
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
        indentorService.getRequestCreatorNew("indetor-crop-group").subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    // console.log('x===============>',x);
                    
                    x["name"] = x.group_name;
                    x["value"] = x.group_code;
                    x["cropType"] = "Crop Type - " + '0' + index;
                    // cropName.push(x);
                    cropGroupList.push(x)
                });
            }
        });
        const data=indentorService.getData();
        // console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaa',data);
        
        data.subscribe({
            next:(data:any)=>{
                const param={
                    search:{
                        group_code:data.group_code
                    }
                }
                cropNameListtwo.length=0
               
                
                
                let arr=[];
                arr.push(data)
                cropNameList.push(arr);
                data=''
                // console.log('cropNameList===========>',
                // cropNameList[cropNameList.length - 1].flat());
                // console.log('cropNameList');
                let res= cropNameList[cropNameList.length - 1].flat();
            //   console.log('res',res);
            //   res.length
            // cropNameListtwo =[];
            // cropNameListtwo.length=0;
            res.forEach((x:any,index:number)=>{
                    // cropNameListtwo.splice(0,cropNameListtwo.length)
                    let obj = {};
                    obj['name']=x.crop_name,
                    obj['value']=x.crop_code

                    // let result = res.filter(item=>x.crop_name== item.crop_name
                       
                    //     )
                    
                        
                        cropNameListtwo.push(obj)
                        
                        // if(cropNameListtwo && cropNameListtwo.length )
                        
                        
                        // newData=cropNameListtwo.flat().filter(item=>item.name===x.crop_name)
                    })
                        
                    
                
                

            },error:(err:any)=>{
                console.log(err);  
                
            }
        })
        // console.log('newData==================>',newData);
        
      
        // cropNameList.push();
        // console.log('cropNameList============>',this.indentorService.myData);
        

        _service.postRequestCreator("get-season-details").subscribe((data: any) => {
            console.log('season', data);
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {

                    x["name"] = x.season;
                    x["value"] = x.season_code;
                    x["cropType"] = "Crop Type - " + '0' + index;
                    season.push(x);
                });


            }
        });

        masterService.getRequestCreatorNew("get-crop-list").subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                data.EncryptedResponse.data.forEach((x: any, index: number) => {
                    x["name"] = x.crop_name;
                    x["value"] = x.crop_code;
                    x["cropType"] = "Crop Type - " + '0' + index;
                    cropGroup.push(x);
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
                validations: [Validators.required],
                gridColClass: "col-12 col-xl-7 py-2",
                gridlabelClass:'labelClass',
                gridlabelId:'grid_label_id',
                griddropDownClass:'yearOfIndentdropdownClass'
            },
            {
                formControlName: "season",
                fieldName: "Season",
                fieldType: 'select',
                id: "season",
                fieldDataList: season,
                validations: [Validators.required],
                gridColClass: "col-12 col-xl-6 py-2 ",
                gridlabelClass:'labelSeasonClass',
                gridlabelId:'grid_label_season_id',
                griddropDownClass:'seasondropdownClass'
                                           
            },
            {
                formControlName: "cropGroup",
                fieldName: "Crop Group",
                fieldType: 'select',
                id: "cropGroup",
                fieldDataList: cropGroupList,
                validations: [Validators.required],
                gridColClass: "col-12 col-xl-7 py-2",
                gridlabelClass:'labelClass',
                gridlabelId:'grid_label_id',
                griddropDownClass:'cropdropdownClass'
            },
            {
                formControlName: "cropName",
                fieldName: "Crop Name",
                fieldType: 'select',
                id: "cropName",
                fieldDataList: cropNameListtwo,
                validations: [Validators.required],
                gridColClass: "col-12 col-xl-6 py-2 ",
                gridlabelClass:'labelSeasonClass',
                gridlabelId:'grid_label_crop_name',
                griddropDownClass:'cropNamedropdownClass'
            },
            {
                formControlName: "cropType",
                fieldName: "Crop Type",
                fieldType: 'select',
                id: "cropType",
                fieldDataList: cropTypeValue,
                htmlControlSuffixText: "Agriculture Crops in Quintals & Horticulture Crops In Kilograms",
                gridColClass: "col-12 col-xl-7 py-2",
                gridlabelClass:'labelClass',
                gridlabelId:'grid_label_id',
                griddropDownClass:'cropTypedropdownClass'
                
            },
            {
                formControlName: "varietyName",
                fieldName: "Variety Name",
                fieldType: 'select',
                id: "varietyName",
                // fieldDataList: varietyName,
                validations: [Validators.required],
                gridColClass: "col-12 col-xl-6 py-2",
                gridlabelClass:'labelSeasonClass',
                gridlabelId:'grid_label_crop_name',
                griddropDownClass:'cropVareitydropdownClass'
            },
            {
                formControlName: "varietyNotificationYear",
                fieldName: `Variety Notification  
                Year`,
                fieldType: 'input',
                id: "varietyNotificationYear",
                validations: [Validators.required],
                gridColClass: "col-12 col-xl-7 py-2",
                gridlabelClass:'labelClass',
                gridlabelId:'grid_label_year_id',
                griddropDownClass:'variety_notification_year'
                
            },
            {
                formControlName: "indentQuantity",
                fieldName: "Indent Quantity",
                fieldType: 'number',
                id: "indentQuantity",
                validations: [Validators.required],
                maxLength: 8,
                gridColClass: "col-12 col-xl-6 py-2 pl-0",
                gridlabelClass:'labelSeasonClass',
                gridlabelId:'grid_label_indentity_name',
                griddropDownClass:'grid_indent_qty'
            },
            {
                formControlName: "unitKgQ",
                fieldName: "Unit (Kg/Qt)",
                fieldType: 'radio',
                id: "unitKgQ",
                fieldDataList: unitKgQ,
                status: 'DISABLED',
                griddropDownClass:'unitKgQ',
                gridlabelClass:'labelSeasonClass',
                gridColClass: "col-12 col-xl-7 py-2",
                
                
            },
            // {
            //     formControlName: "cropGroup",
            //     fieldName: "Crop Group",
            //     fieldType: 'select',
            //     fieldDataList: cropGroup,
            //     id: "cropGroup",
            //     // fieldDataList: unitKgQ
            // },
        ];
    }
}
