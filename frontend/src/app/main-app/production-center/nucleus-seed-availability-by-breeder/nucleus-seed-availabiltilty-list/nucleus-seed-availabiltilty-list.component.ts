import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { NucleusSeedAvailabilityByBreederSearchComponent } from 'src/app/common/nucleus-seed-availability-by-breeder-search/nucleus-seed-availability-by-breeder-search.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MasterService } from 'src/app/services/master/master.service';

@Component({
  selector: 'app-nucleus-seed-availabiltilty-list',
  templateUrl: './nucleus-seed-availabiltilty-list.component.html',
  styleUrls: ['./nucleus-seed-availabiltilty-list.component.css']
})
export class NucleusSeedAvailabiltiltyListComponent implements OnInit {
  @ViewChild(NucleusSeedAvailabilityByBreederSearchComponent) nucleusSeedAvailabilityByBreederSearchComponent: NucleusSeedAvailabilityByBreederSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  nucleusData: any;
  yearOfIndent: any = [];
  varietyName: any = [];
  cropName: any = [];
  todayDate = new Date();
  ngForm!: FormGroup;
  submitted: boolean = false;
  noData: boolean;
  currentUser: any = { id: 10, name: "Hello User" };

  constructor(
    private restService: RestService,
    private breederService: BreederService,
    private _service: ProductioncenterService,
    private fb: FormBuilder,
    private masterService: MasterService,) {
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_code: new FormControl(''),
      year: new FormControl(''),
      variety_code: new FormControl(''),
      id: new FormControl('')
    });
  }

  ngOnInit(): void {
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.currentUser.id = userData.id
    this.currentUser.name = userData.name
    this.ngForm.controls['id'].setValue(this.currentUser.id);
    // localStorage.setItem('logined_user', "productionCenter");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    this.filterPaginateSearch.itemListPageSize = 50;
    this.getPageData();

  }

  getPageData(loadPageNumberData: number = 1, search: any = undefined) {
    let route = "get-nucleus-seed-availabity-data";
    const param = {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      search,
      id: this.currentUser.id,
    }
    this._service.postRequestCreator(route, param).subscribe(apiResponse => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.filterPaginateSearch.itemListPageSize = 50;
        let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows;
        if (allData === undefined) {
          allData = [];
        }
        if (allData.count == 0) {
          this.noData = true;
        }
        this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        this.initSearchAndPagination();
      }
    });
  }

  initSearchAndPagination() {
    if (this.nucleusSeedAvailabilityByBreederSearchComponent === undefined || this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }

    this.nucleusSeedAvailabilityByBreederSearchComponent.Init(this.filterPaginateSearch);
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }
  // + "'"
  delete(id: number) {
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure To Delete?",
      position: "center",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        title: 'list-action-confirmation-title',
        actions: 'list-confirmation-action'
      }
    }).then(result => {
      if (result.isConfirmed) {
        this._service
          .postRequestCreator("delete-nucleus-seed-availabity-data-submission/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });

        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })



      }
    })
  }
  search() { }
  clear() {
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.initSearchAndPagination()
  }
  getShortName(cropCode) {
    return cropCode.split(' ').map(n => n[0]).join('');
  }
}
