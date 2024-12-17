import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { random, randomMaturity } from '../_helpers/utility';
import { createCropVarietyData } from '../common/data/ui-field-data/breeder-seed-submission-nodal-ui-fields';
import { SeedServiceService } from './seed-service.service';


@Injectable({
  providedIn: 'root'
})
export class RestService {
  ms_nb_01_master: any = environment.ms_nb_01_master;
  ms_nb_04_indenter: any = environment.ms_nb_04_indenter;

  endpoint: string = environment.ms_nb_01_master.apiUrl;
  baseUrl: string = environment.ms_nb_01_master.baseUrl;
  apiBaseUrl: string = environment.ms_nb_01_master.apiBaseUrl;
  constructor(private service:SeedServiceService,private http: HttpClient) { }

  getIndentBreederSeedAllocationList(): BehaviorSubject<any> {
    const basicData: any[] = [
      {
        variety: {
          name: 'Variety',
          value: 1
        },
        year: 2020,
        crop: {
          name: 'Crop-1',
          value: 2
        },
        id: 1
      }
    ];
    let localDeliverObserverable = new BehaviorSubject<any>([]);
    let allbasicData: any[] = [];
    const runToGenerate = () => {
      for (let index = 0; index < 100; index++) {
        const element = { ...basicData[index] };
        element.id = index + 1;
        element.variety = {
          name: "Variety-" + random(1, 10),
          value: random(1, 10)
        }
        const year = random(1990, 2022);
        const cropType = random(1, 10);
        element.year = {
          name: year,
          value: year
        }

        const seasonId = random(1, 4);
        element.season = {
          name: "Season - " + seasonId,
          value: seasonId
        }
        element.indentQuantity = "Indent Quantity - " + random(1, 10);
        const cropId = random(1, 4);
        element.crop = {
          name: "Crop-" + cropId,
          value: cropId,
          cropType: "Crop Type - " + '0' + cropType
        }
        const unit = random(1, 2);
        element.unit = {
          name: unit == 1 ? "Kilogram" : "Quintal",
          value: unit == 1 ? "kilogram" : "quintal"
        }
        allbasicData.push(element);
      }
    };
    const runTimeoutToGenerate = () => {
      setTimeout(() => {
        runToGenerate();
        localDeliverObserverable.next(allbasicData);
      }, 500);
    };

    runTimeoutToGenerate();

    return localDeliverObserverable;
  }
  // const words= ['Early','Medium','Late']
  //  getRandomWord()  {
  //   return words[Math.floor(Math.random() * words.length)];
  // };

  getNodalBreederSeedAllocationList(): BehaviorSubject<any> {
    const basicData: any[] = [
      {
        variety: {
          name: 'Variety',
          value: 1
        },
        year: 2020,
        crop: {
          name: 'Crop-1',
          value: 2
        },
        id: 1
      }
    ];
    let localDeliverObserverable = new BehaviorSubject<any>([]);
    let allbasicData: any[] = [];
    const runToGenerate = () => {
      for (let index = 0; index < 100; index++) {
        const element = { ...basicData[index] };
        element.id = index + 1;
        element.variety = {
          name: "Variety-" + random(1, 10),
          value: random(1, 10)
        }

        createCropVarietyData(element.variety);
        const year = random(1990, 2022);
        const cropType = random(1, 10);
        element.year = {
          name: year,
          value: year
        }

        const seasonId = random(1, 4);
        element.season = {
          name: "Season - " + seasonId,
          value: seasonId
        }
        element.indentQuantity = "Indent Quantity - " + random(1, 10);
        const cropId = random(1, 4);
        element.crop = {
          name: "Crop-" + cropId,
          value: cropId,
          cropType: "Crop Type - " + '0' + cropType
        }
        const unit = random(1, 2);
        element.unit = {
          name: unit == 1 ? "Kilogram" : "Quintal",
          value: unit == 1 ? "kilogram" : "quintal"
        }
        allbasicData.push(element);
      }
    };
    const runTimeoutToGenerate = () => {
      setTimeout(() => {
        runToGenerate();
        localDeliverObserverable.next(allbasicData);
      }, 500);
    };

    runTimeoutToGenerate();

    return localDeliverObserverable;
  }

  getAddCropList(): BehaviorSubject<any> {
    const basicData: any[] = [
      {
        variety: {
          name: 'Variety',
          value: 1
        },
        year: 2020,
        crop: {
          name: 'Crop-1',
          value: 2
        },
        id: 1
      }
    ];
    let localDeliverObserverable = new BehaviorSubject<any>([]);
    let allbasicData: any[] = [];
    const runToGenerate = () => {
      for (let index = 0; index < 30; index++) {
        const element = { ...basicData[index] };
        element.id = index + 1;
        element.variety = {
          name: "Variety-" + random(1, 10),
          value: random(1, 10)
        }

        createCropVarietyData(element.variety);
        const year = random(1990, 2022);
        const cropType = random(1, 10);
        element.year = {
          name: year,
          value: year
        }

        const seasonId = random(1, 4);
        element.season = {
          name: "Season - " + seasonId,
          value: seasonId
        }
        element.indentQuantity = "Indent Quantity - " + random(1, 10);
        const cropId = random(1, 4);
        element.crop = {
          name: "Crop-" + cropId,
          value: cropId,
          cropType: "Crop Type - " + '0' + cropType
        }
        const cropGroupId = random(1, 4);
        element.crop_group = {
          name: "Crop group-" + cropGroupId,
          value: cropGroupId,
          cropgroup: "Cropgroup - " + '0' + cropGroupId
        }

        const seed_rate_id = random(1, 4);
        element.seed_rate = {
          name: "Seed_multiple_Ratio-" + seed_rate_id,
          value: seed_rate_id,
          seed_rate: "seed_rate - " + '0' + seed_rate_id
        }
        const developed_by = random(1, 4);
        element.developed_by = {
          name: "developed_by-" + developed_by,
          value: developed_by,
          // developed_by: "developed_by - " + '0' + developed_by
        }
        const botatincal_name_id = random(1, 5);
        element.botatincal_name = {
          name: "botatincal_name-" + botatincal_name_id,
          value: botatincal_name_id,
          seed_rate: "botatincal_name - " + '0' + botatincal_name_id
        }

        allbasicData.push(element);
      }
    };
    const runTimeoutToGenerate = () => {
      setTimeout(() => {
        runToGenerate();
        localDeliverObserverable.next(allbasicData);
      }, 500);
    };

    runTimeoutToGenerate();

    return localDeliverObserverable;
  }
  getAddIndentorList(): BehaviorSubject<any> {
    const basicData: any[] = [
      {
        variety: {
          name: 'Variety',
          value: 1
        },
        year: 2020,
        crop: {
          name: 'Crop-1',
          value: 2
        },
        id: 1
      }
    ];
    let localDeliverObserverable = new BehaviorSubject<any>([]);
    let allbasicData: any[] = [];
    const runToGenerate = () => {
      for (let index = 0; index < 30; index++) {
        const element = { ...basicData[index] };
        element.id = index + 1;
        element.variety = {
          name: "Variety-" + random(1, 10),
          value: random(1, 10)
        }

        createCropVarietyData(element.variety);
        const year = random(1990, 2022);
        const cropType = random(1, 10);
        element.year = {
          name: year,
          value: year
        }

        const seasonId = random(1, 4);
        element.season = {
          name: "Season - " + seasonId,
          value: seasonId
        }
        element.indentQuantity = "Indent Quantity - " + random(1, 10);
        const cropId = random(1, 4);
        element.crop = {
          name: "Crop-" + cropId,
          value: cropId,
          cropType: "Crop Type - " + '0' + cropType
        }
        const cropGroupId = random(1, 4);
        element.crop_group = {
          name: "Crop group-" + cropGroupId,
          value: cropGroupId,
          cropgroup: "Cropgroup - " + '0' + cropGroupId
        }
        
        const seed_rate_id = random(1, 4);
        element.seed_rate = {
          name: "Seed_multiple_Ratio-" + seed_rate_id,
          value: seed_rate_id,
          seed_rate: "seed_rate - " + '0' + seed_rate_id
        }
        
        const addressArray =['janakpuri','noida ','Delhi','Mumbai'];
        
        
        const addressArrayValue = addressArray[Math.floor(Math.random()*addressArray.length)];

        const addressId = random(1,4)
        element.address = {
          address: addressArrayValue,
          value:addressId ,
      
        }
      
      
        const nameArray =['Rahul','Nishant ','Vaibhav','Mumbai'];
        
        
        const nameArrayValue = nameArray[Math.floor(Math.random()*nameArray.length)];

        const nameId = random(1,4)
        element.contactpersonName = {
          name: nameArrayValue,
          value:nameId ,
       
        }
        
        
        const designationArr =['Manager','Employee'];
        
        
        const desingnation = designationArr[Math.floor(Math.random()*designationArr.length)];

        const desingnationId = random(1,2)
        element.desingnation = {
          name: desingnation,
          value:desingnationId ,
       
        }
        const mobileNumber= Math.floor(100000000 + Math.random() * 900000000);
        const mobileNumberId = random(1,4)
        element.mobile = {
          mobileNumber: mobileNumber,
          value:mobileNumberId ,
       
        }
       
        allbasicData.push(element);
      }
    };
    const runTimeoutToGenerate = () => {
      setTimeout(() => {
        runToGenerate();
        localDeliverObserverable.next(allbasicData);
      }, 500);
    };

    runTimeoutToGenerate();

    return localDeliverObserverable;
  }

  getAddCropCharacterSticsList(): BehaviorSubject<any> {
    const basicData: any[] = [
      {
        variety: {
          name: 'Variety',
          value: 1
        },
        year: 2020,
        crop: {
          name: 'Crop-1',
          value: 2
        },
        id: 1
      }
    ];
    let localDeliverObserverable = new BehaviorSubject<any>([]);
    let allbasicData: any[] = [];
    const runToGenerate = () => {
      for (let index = 0; index < 30; index++) {
        const element = { ...basicData[index] };
        element.id = index + 1;
        element.variety = {
          name: "Variety-" + random(1, 10),
          value: random(1, 10)
        }

        createCropVarietyData(element.variety);
        const year = random(1990, 2022);
        const cropType = random(1, 10);
        element.year = {
          name: year,
          value: year
        }

        const seasonId = random(1, 4);
        element.season = {
          name: "Season - " + seasonId,
          value: seasonId
        }
        element.indentQuantity = "Indent Quantity - " + random(1, 10);
        const cropId = random(1, 4);
        element.crop = {
          name: "Crop-" + cropId,
          value: cropId,
          cropType: "Crop Type - " + '0' + cropType
        }
        const cropGroupId = random(1, 4);
        element.crop_group = {
          name: "Crop group-" + cropGroupId,
          value: cropGroupId,
          cropgroup: "Cropgroup - " + '0' + cropGroupId
        }
        
        const seed_rate_id = random(1, 4);
        element.seed_rate = {
          name: "Seed_multiple_Ratio-" + seed_rate_id,
          value: seed_rate_id,
          seed_rate: "seed_rate - " + '0' + seed_rate_id
        }
        const myArray =['Early','Medium','Late'];
        
        
        // const type_of_maturity = randomMaturity();
        const type_of_maturityId =random(1,4);
        const type_of_maturity = myArray[Math.floor(Math.random()*myArray.length)];
        
        element.maturity = {
          name: type_of_maturity,
          value: type_of_maturityId,
        }
        const spacing_weight =random(100,1000)
        const spacing_weight_id =random(100,1000)
        element.spacing_weight = {
          name: spacing_weight,
          value: spacing_weight_id,
        }
        const average_yield =random(1,100)
        const average_yield_id =random(1,4)
        element.average_yield = {
          name: average_yield,
          value:average_yield_id,
        }
        const fertilizer_dosage =random(1,100)
        const fertilizer_dosage_id =random(1,4)
        
        element.fertilizer_dosage = {
          name: fertilizer_dosage,
          value:fertilizer_dosage_id,
        }
     
       
       
        allbasicData.push(element);
      }
    };
    const runTimeoutToGenerate = () => {
      setTimeout(() => {
        runToGenerate();
        localDeliverObserverable.next(allbasicData);
      }, 500);
    };

    runTimeoutToGenerate();

    return localDeliverObserverable;
  }
  //   endpoint: string = environment.apiUrl;
  //   baseUrl: string = environment.baseUrl;
  //   apiBaseUrl: string = environment.apiBaseUrl;
  //   constructor(private http: HttpClient, private router: Router, private ngxService: NgxUiLoaderService) { }

  getEndPath(ms_nb_04_Type: string): string {
    let ms_nb_data = this.ms_nb_01_master;
    if (ms_nb_04_Type == "ms_nb_04_indenter")
      ms_nb_data = this.ms_nb_04_indenter;

    const apiPathKeyName = environment.production ? "apiBaseUrl" : "baseUrl";
    return ms_nb_data[apiPathKeyName];
  }

  public getRequestCreator<T>(FromPath: string, token: string = '', DataRow: any, ms_nb_Type: string): Observable<any> {
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.get<T>(this.getEndPath(ms_nb_Type) + FromPath + '/' + DataRow, { headers: otherHeader }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  postRequestCreator<T>(FromPath: string, token: any = '', DataRow: any = {}, ms_nb_Type: string): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    token = currentUser? currentUser.token:'';
      
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.post<T>(this.getEndPath(ms_nb_Type) + FromPath, DataRow, { headers: otherHeader }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }
  
  runApiCommunication(fromPath: string, params: any, ms_nb_Type: string, showSwal = true): Promise<APIRunResultType> {
    const userToken = localStorage.getItem('userToken');
    if (!params)
      params = {};

    // if (!params["_auth"])
    //   params["_auth"] = userToken;

    const dataPromise = new Promise<APIRunResultType>((resolve, reject) => {
      this.postRequestCreator(fromPath, userToken, params, ms_nb_Type)
        .subscribe((resp: any) => {
          // this.ngxService.stop();

          if (resp && parseInt(resp.status) === 200) {
            resolve(resp);
          } else if (resp && parseInt(resp.status) === 208) {
            Swal.fire({
              title: 'Error',
              icon: 'error',
              text: resp.message,
              showConfirmButton: false,
              timer: 3000,
            });
          }
        },
          error => {
            // this.ngxService.stop();
            errorValidate(error);
            // if (showSwal)
            //   Swal.fire({
            //     title: 'Error',
            //     icon: 'error',
            //     text: error.message,
            //     showConfirmButton: false,
            //     timer: 1500,
            //   });
            if (!environment.production)
              reject([]);
          });
    });
    dataPromise.catch(function onReject(e) {
      errorValidate(e);

      // if (showSwal)
      //   Swal.fire({
      //     title: 'Error',
      //     icon: 'error',
      //     text: e.message,
      //   });
    });
    return dataPromise;
  }

  handleError(error: HttpErrorResponse): any {
    errorValidate(error);
  }
}
function errorValidate(error: any) {

}

function catchError(error: any): any {
  return "";
}
export interface APIRunResultType {
  status: number,
  message: string,
  result?: any
}
