import { ValidatorFn } from "@angular/forms";
import { IDropdownSettings, } from 'ng-multiselect-dropdown';

export class SectionFieldType {
    formControlName: string = "";
    fieldName: string = "";
    fieldType: 'select' | 'input' | 'button' | 'heading' | 'tab' | 'captcha'| 'select-dropdown' |'multiselect' | 'number' | 'decimal' | 'date' | 'file' | 'textarea' | 'radio' = 'input';

    /**
     * @deprecated The id property should not be used
     */
    id?: string = "";
    fieldDataList?: any[] = undefined;
    gridColClass?: string | undefined = undefined;
    gridlabelClass?: string | undefined = undefined;
    gridlabelId?: string | undefined = undefined;
    gridInputForm?: string | undefined = undefined;
    cssClassFunction?: Function = undefined;
    validations?: ValidatorFn[] = [];
    griddropDownClass?: string | undefined = undefined;
    event?: string | undefined = undefined;
    // uploaderInstance?: FileUploader = null;
    maxLength?: number = undefined;
    htmlControlSuffixText?: string = undefined;
    multiple?: boolean = false;
    status?:string;
    inputSearch?:string
    dropdownSettings?: IDropdownSettings = {};
}

export class uiFieldsDetails {
    sectionName: string = "";
    sectionFields: Array<SectionFieldType> = []
}