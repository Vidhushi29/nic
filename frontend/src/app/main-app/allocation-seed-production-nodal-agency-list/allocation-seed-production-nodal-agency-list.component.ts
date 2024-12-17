import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { IcarService } from 'src/app/services/icar/icar.service';
import { RestService } from 'src/app/services/rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-allocation-seed-production-nodal-agency-list',
  templateUrl: './allocation-seed-production-nodal-agency-list.component.html',
  styleUrls: ['./allocation-seed-production-nodal-agency-list.component.css']
})
export class AllocationSeedProductionNodalAgencyListComponent implements OnInit {
  @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cntData: any;
  ngForm!: FormGroup;
  yearOfIndent: any = [
    // { name: "2025-26", "value": "2025" },
    { name: "2024-25", "value": "2024" },
    { name: "2023-24", "value": "2023" },
    { name: "2022-23", "value": "2022" },
    { name: "2021-22", "value": "2021" },
    { name: "2020-21", "value": "2020" },
    // { name: "2021 - 2022", "value": "2021" },
    // { name: "2022 - 2023", "value": "2022" },
    // { name: "2023 - 2024", "value": "2023" },
    // { name: "2024 - 2025", "value": "2024" },
    // { name: "2025 - 2026", "value": "2025" }
  ];
  cropNameData: any;
  constructor(private restService: RestService, private icarService: IcarService, private fb: FormBuilder) {
    this.createEnrollForm();
  }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      year_of_indent: new FormControl(''),
      crop_name: new FormControl('',),


    });
    this.ngForm.controls["year_of_indent"].valueChanges.subscribe(data => {
      if (data) {
        this.getCropName(data);
        this.ngForm.controls["crop_name"].enable()
      }
    })
  }
  ngOnInit(): void {
    // localStorage.setItem('logined_user', "ICAR_NODAL");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    this.ngForm.controls['crop_name'].disable()
    this.getPageData();
  }

  async getPageData(loadPageNumberData: number = 1, search: any = undefined) {
    this.icarService.postRequestCreator("allocation-seed-production-breeder-list-grouped", null, {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      search: {
        year: this.ngForm.controls['year_of_indent'].value,
        crop_name: this.ngForm.controls['crop_name'].value,

      }
    }).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.filterPaginateSearch.itemListPageSize = 10;
        this.cntData = data.EncryptedResponse.data.count;
        let allData = data.EncryptedResponse.data.rows;
        this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, data.EncryptedResponse.data.rows.length, true);
        this.initSearchAndPagination();
        // this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, data.EncryptedResponse.data.count, true);
        // this.initSearchAndPagination();
      }
    });
  }

  initSearchAndPagination() {
    this.paginationUiComponent.Init(this.filterPaginateSearch);
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }

    // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
  }

  // delete(id: number) {
  //   this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemListInitial.filter(x => x.id != id);
  //   this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemList.filter(x => x.id != id);
  //   this.filterPaginateSearch.itemListFilter = this.filterPaginateSearch.itemListFilter.filter(x => x.id != id);
  //   if (this.filterPaginateSearch.lastFormSearchValue !== undefined)
  //     this.filterPaginateSearch.search(this.filterPaginateSearch.lastFormSearchValue);
  //   else
  //     this.filterPaginateSearch.filterItemsList();
  // }
  delete(id: number, cropCode: string) {
    console.log('cropcode=====', id);
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
        this.icarService
          .postRequestCreator("delete-allocation-seed-production-breeder/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });
      }
    })
  }
  search() {
    if ((!this.ngForm.controls["year_of_indent"].value && !this.ngForm.controls["crop_name"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'success',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    else {

       this.getPageData();
    }
  }

  clear() {
    if (this.ngForm.controls["year_of_indent"].value)
      this.ngForm.controls["year_of_indent"].setValue("");
    this.ngForm.controls["crop_name"].setValue("");
    this.getPageData();
    this.ngForm.controls['crop_name'].disable();
    
 this.filterPaginateSearch.itemListCurrentPage = 1;
 this.initSearchAndPagination()

    // this.getCropNameList('we34');
    // this.getCropVarietyData('ew324');
  }
  getCropName(val) {
    const param = {
      search: {
        year: val
      }
    }
    this.icarService.postRequestCreator('get-crop-name-data', null, param).subscribe(data => {
      console.log('data==.', data);
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        if (data.EncryptedResponse.data.rows.length > 0) {
          this.cropNameData = data.EncryptedResponse.data.rows;
          console.log(this.cropNameData);

          // const v_year = new Date(data.EncryptedResponse.data[0].created_at);
          // this.ngForm.controls["cropName"].patchValue(data.m_crop.crop_name);
          // this.formGroupControls["varietyNotificationYear"].disable();
        } else {

        }

      }

    })


  }

  getShortName(cropCode) {
    return cropCode.split(' ').map(n => n[0]).join('');
  }
}
