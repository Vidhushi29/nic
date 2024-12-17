import Swal from 'sweetalert2';
import { FormGroup } from '@angular/forms';
import { Observable } from "rxjs";

export async function errorValidate(err: any) {
  if (
    err.status === 401 ||
    err.error.message === 'Unauthenticated.'
  ) {
    localStorage.removeItem('authData');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('subscriberData');
    await Swal.fire({
      title: '<p style="font-size:25px;">Session Expired.</p>',
      icon: 'error',
      confirmButtonText:
        'OK',
      confirmButtonColor: '#E97E15'
    }).then((success) => {
      window.location.href = '/login';
    });
    return;
  } else {
    let errorText = err.error && err.error.message ? err.error.message : err.statusText;
    // if (err.status === 400) {
    //   errorText = "Please fill form correctly<br />";
    // } else
    if ([409, 400].includes(err.status)) {
      errorText = "";
      if (err.error && err.error.result) {
        errorText += "\n";
        for (let eachError in err.error.result) {
          errorText += err.error.result[eachError] + "\n";
        }
      }
    }
    Swal.fire({
      title: 'Error!',
      html: errorText,
      icon: 'error',
      showConfirmButton: false,
      timer: 3500,
    });
    return;
  }
}
// export function errorValidate(err: any) {
//   if (
//     err.code === 401 ||
//     err.error.message === 'Unauthenticated.' ||
//     err.status === 401
//   ) {
//     localStorage.removeItem('authData');
//     localStorage.removeItem('userName');
//     localStorage.removeItem('userEmail');
//     localStorage.removeItem('userToken');
//     Swal.fire({
//       title: 'Error!',
//       text: 'Session Expired',
//       icon: 'error',
//       showConfirmButton: false,
//       timer: 1500,
//     });
//     location.reload();
//     return;
//   } else {
//     Swal.fire({
//       title: 'Error!',
//       text: err.statusText,
//       icon: 'error',
//       showConfirmButton: false,
//       timer: 1500,
//     });
//     return;
//   }
// }

// export function checkNumber(event: any) {
//   const numCharacters = /[0-9]+/g;

//   if (
//     !(
//       (event.keyCode >= 48 && event.keyCode <= 57) ||
//       (event.keyCode >= 96 && event.keyCode <= 105) ||
//       event.keyCode == 8 ||
//       event.keyCode == 37 ||
//       event.keyCode == 39 ||
//       event.keyCode == 9
//     ) &&
//     numCharacters.test(event.key) === false
//   ) {
//     event.preventDefault();
//   }

//   if (
//     !(
//       (event.which >= 48 && event.which <= 57) ||
//       (event.which >= 96 && event.which <= 105) ||
//       event.which == 8 ||
//       event.which == 37 ||
//       event.which == 39 ||
//       event.which == 9
//     ) &&
//     numCharacters.test(event.key) === false
//   ) {
//     event.preventDefault();
//   }
// }

// export function checkLength(event: any, maxLength) {
//   if (event.target.value.length == maxLength) {
//     if (!(event.keyCode == 8 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 9)) {
//       event.preventDefault();
//     }
//   }
// }
// export function MustMatch(controlName: string, matchingControlName: string) {
//   return (formGroup: FormGroup) => {
//     const control = formGroup.controls[controlName];
//     const matchingControl = formGroup.controls[matchingControlName];

//     if (matchingControl.errors && !matchingControl.errors.mustMatch) {
//       return;
//     }
//     if (control.value !== matchingControl.value) {
//       matchingControl.setErrors({ mustMatch: true });
//     } else {
//       matchingControl.setErrors(null);
//     }
//   };
// }
// export function date(controlName: string) {
//   return (formGroup: FormGroup) => {
//     const control = formGroup.controls[controlName];
//     console.log('date', control);
//     const currentDate = new Date();
//     if (control.value == '' || control.value == null) {
//       control.setErrors({ mustValid: true });
//     } else {
//       control.setErrors(null);
//     }
//   };
// }

// export function passwordPolicy(controlName: string) {
//   return (formGroup: FormGroup) => {
//     const control = formGroup.controls[controlName];
//     const upperCaseCharacters = /[A-Z]+/g;
//     const lowerCaseCharacters = /[a-z]+/g;
//     const numCharacters = /[0-9]+/g;
//     const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
//     if (upperCaseCharacters.test(control.value) === false) {
//       control.setErrors({ mustUpp: true });
//     } else if (lowerCaseCharacters.test(control.value) === false) {
//       control.setErrors({ mustLow: true });
//     } else if (numCharacters.test(control.value) === false) {
//       control.setErrors({ mustNum: true });
//     } else if (specialCharacters.test(control.value) === false) {
//       control.setErrors({ mustSpc: true });
//     } else if (control.value.length < 8) {
//       control.setErrors({ mustLen: true });
//     } else {
//       control.setErrors(null);
//     }
//   };
// }

// export function email(controlName: string) {
//   return (formGroup: FormGroup) => {
//     const control = formGroup.controls[controlName];
//     const checkValue = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     if (checkValue.test(control.value) === false) {
//       control.setErrors({ mustEmail: true });
//     } else {
//       control.setErrors(null);
//     }
//   };
// }

// export function number(controlName: string, length = 5) {
//   return (formGroup: FormGroup) => {
//     const control = formGroup.controls[controlName];
//     if (control.value.toString().length >= length) {
//       control.setErrors(null);
//     } else {
//       control.setErrors({ mustMob: true });
//     }
//   };
// }

// export function diff_years(dt1: any, dt2: any) {
//   if (dt1 === '') {
//     //return;
//   }
//   let diff = (dt2.getTime() - dt1.getTime()) / 1000;
//   diff /= 60 * 60 * 24;
//   return Math.abs(Math.round(diff / 365.25));
// }

// export function formatDate(date: any) {
//   const d = new Date(date);
//   let month = '' + (d.getMonth() + 1);
//   let day = '' + d.getDate();
//   const year = d.getFullYear();

//   if (month.length < 2) {
//     month = '0' + month;
//   }
//   if (day.length < 2) {
//     day = '0' + day;
//   }
//   return [year, month, day].join('-');
// }

// export function minValue(controlName: string, matchingControlName: string) {
//   return (formGroup: FormGroup) => {
//     const control = formGroup.controls[controlName];

//     if (!control.value) {
//       control.setErrors({ required: true });
//     }

//     const matchingControl = formGroup.controls[matchingControlName];
//     if (parseFloat(control.value) > parseFloat(matchingControl.value)) {
//       control.setErrors({ minValue: true });
//     } else if (parseFloat(control.value) < parseFloat(matchingControl.value)) {
//       control.setErrors(null);
//     }
//   };
// }

// export function maxValue(controlName: string, matchingControlName: string) {
//   return (formGroup: FormGroup) => {
//     const control = formGroup.controls[controlName];
//     const matchingControl = formGroup.controls[matchingControlName];
//     if (!matchingControl.value) {
//       matchingControl.setErrors({ required: true });
//     }

//     if (parseFloat(control.value) > parseFloat(matchingControl.value)) {
//       matchingControl.setErrors({ maxValue: true });
//     } else if (parseFloat(control.value) < parseFloat(matchingControl.value)) {
//       matchingControl.setErrors(null);
//     }
//   };
// }

// export function ConfirmedValidator(
//   controlName: string,
//   matchingControlName: string
// ) {
//   return (formGroup: FormGroup) => {
//     const control = formGroup.controls[controlName];
//     const matchingControl = formGroup.controls[matchingControlName];
//     if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
//       return;
//     }
//     if (control.value !== matchingControl.value) {
//       matchingControl.setErrors({ confirmedValidator: true });
//     } else {
//       matchingControl.setErrors(null);
//     }
//   };
// }
export function checkNumber(event: any) {
  console.log('checkNumber event.keyCode', event.keyCode)
  const numCharacters = /[0-9.]+/g;
  console.log(event.which, 'event.which')
  // if(event.which != 17 && event.which != 86 )
  if (event.which != 17 && event.which != 86 && event.which != 8 && event.which != 9 && event.which != 37 && event.which != 39 && event.which != 46 && numCharacters.test(event.key) == false) {
    event.preventDefault();
  }
}

export function checkNumberswithoutDecimal(event: any) {

  const numCharacters = /[0-9]+/g;
  console.log(event.which, 'event.which')
  if (event.which == 46) {
    event.preventDefault();
  }
  // if(event.which != 17 && event.which != 86 )
  if (event.which != 17 && event.which != 86 && event.which != 8 && event.which != 9 && event.which != 37 && event.which != 39 && event.which != 46 && numCharacters.test(event.key) == false) {
    event.preventDefault();
  }
}
export function onlyNumberKey(evt) {

  // Only ASCII character in that range allowed
  var ASCIICode = (evt.which) ? evt.which : evt.keyCode
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
    return false;
  return true;
}
export function onlytwoNumberKey(evt) {

  // Only ASCII character in that range allowed
  // var character = String.fromCharCode(evt.keyCode)
  //       var newValue = this.value + character;
  //       if (isNaN(parseInt(newValue)) || hasDecimalPlace(newValue, 3)) {
  //         evt.preventDefault();
  //           return false;
  //       }

}

function hasDecimalPlace(value, x) {
  var pointIndex = value.indexOf('.');
  return pointIndex >= 0 && pointIndex < value.length - x;
}
export function random(min: number, max: number,) {
  return Math.floor(Math.random() * (max - min)) + min;
}
export function randomMaturity(maturity: Array<String>) {
  // return Math.floor(Math.random() * (max - min)) + min;
  maturity[Math.floor(Math.random() * maturity.length)];
}


export function range(a: any, b: any, step: number) {
  var A = [];
  if (typeof a == 'number') {
    A[0] = a;
    step = step || 1;
    while (a + step <= b) {
      A[A.length] = a += step;
    }
  }
  else {
    var s = 'abcdefghijklmnopqrstuvwxyz';
    if (a === a.toUpperCase()) {
      b = b.toUpperCase();
      s = s.toUpperCase();
    }
    s = s.substring(s.indexOf(a), s.indexOf(b) + 1);
    A = s.split('');
  }
  return A;
}
export function ConfirmAccountNumberValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    let control = formGroup.controls[controlName];
    let matchingControl = formGroup.controls[matchingControlName]
    if (
      matchingControl.errors &&
      !matchingControl.errors['confirmPasswordValidator']
    ) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmPasswordValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}



export function checkLength(event: any, maxLength: number) {
  if (event.target.value.length == maxLength) {
    console.log('event.keyCode', event.keyCode)
    if (!(event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 9 || event.keyCode == 45)) {

      event.preventDefault();
    }
  }
}
export function checkDecimal(event: any) {


  // console.log(event.which)

  var key = event.which || event.keyCode;
  var ctrl = event.ctrlKey ? event.ctrlKey : ((event.key === 17)
    ? true : false);

  // If key pressed is V and if ctrl is true.
  if (key == 65 && ctrl) {


    event.preventDefault();
    // print in console.
    // console.log("Ctrl+a and ctrl  is pressed.");

  }

  const numCharacters = /^[.\d]+$/g;
  ;

  if (event.which != 17 && event.which != 86 && event.which != 8 && event.which != 9 && event.which != 37 && event.which != 39 && event.which != 46 && numCharacters.test(event.key) == false) {
    event.preventDefault();
  }
}

export function validateDecimal(event: KeyboardEvent): void {
  const input = event.target as HTMLInputElement;
  const regex = /^[0-9]+(\.[0-9]{0,2})?$/;

  const newValue = input.value + event.key;
  if (!regex.test(newValue) || (event.key === '.' && input.value.includes('.'))) {
    event.preventDefault();
  }
}

export function AlphaNumeric(e) {
  var k;
  document.all ? k = e.keyCode : k = e.which;
  return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
}


export function checkAlpha(event: any) {

  var charCode = (event.which) ? event.which : event.keyCode;

  if (event.target.selectionStart == 0 && event.code == 'Space') {
    event.preventDefault();
    return false;
  }
  if ((charCode > 32)
    && (charCode < 65 || charCode > 90)
    && (charCode < 97 || charCode > 122)
  ) {
    return false;
  }

  else {
    console.log(charCode, '(keydown)="checkLength($event,50)"');
    if (charCode == 8 || charCode == 37 || charCode == 39) {
      return true;
    }
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode >= 123) && charCode != 32 || charCode == 45) {
      event.preventDefault();
      return false;
    }
    else {
      return true;
    }
    // return 
  }







}

export function checkAlphaforShortname(event: any) {

  var charCode = (event.which) ? event.which : event.keyCode;
  // console.log(charCode, '(keydown)="checkLength($event,50)"');
  console.log(charCode);
  if (charCode == 8) {
    return true;
  }
  if (parseInt(charCode) === 32 || charCode == 45 || charCode == 32 || charCode == 44 || charCode == 189) {
    event.preventDefault();
    return false;
  }
  if (charCode == 45 || (charCode == 189 && charCode != 16)) {
    return true;
  }
  if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode >= 123)) {
    event.preventDefault();
    return false;
  }
  else {
    return true;
  }
}

export function randomLotNo(event: any, code: any, currentUserCode: any, runningNumber, harvest_date: any) {
  let length = 2;
  let no = [];
  let cnt;
  let n = (Number.isInteger(event) == true) ? 1 : 0;
  if (event >= 1) {
    for (let i = n; i <= event; i++) {
      cnt = runningNumber + i;
      cnt = (cnt == 0) ? 1 : cnt;
      if (cnt <= 9) {
        cnt = '00' + (cnt).toString()
      } else if (cnt <= 99) {
        cnt = '0' + (cnt).toString()
      }
      no.push(getMonthShortName(harvest_date).toUpperCase() + "-" + new Date(harvest_date).getFullYear().toString().substr(-2) + "-" + currentUserCode + "-" + code + "-" + cnt);
    }
  } else {
    cnt = runningNumber + 1;
    if (cnt <= 9) {
      cnt = '00' + (cnt).toString()
    } else if (cnt <= 99) {
      cnt = '0' + (cnt).toString()
    }
    no.push(getMonthShortName(harvest_date).toUpperCase() + "-" + new Date(harvest_date).getFullYear().toString().substr(-2) + "-" + currentUserCode + "-" + code + "-" + cnt);
  }
  return no;
}

export function getMonthShortName(harvest_date: any) {
  const date = new Date(harvest_date);
  return date.toLocaleString('en-US', { month: 'short' });
}



// export function randomLotNo(event: any, createdByUser, currentUser, runningNumber) {
//   let length = 2;
//   let no = [];
//   let cnt;
//   let set = 0;
//   let get = 0;
//   event.forEach(function (eveValue) {
//     let n = (Number.isInteger(eveValue) == true)?1:0;
//     if(eveValue >= 1){
//       for(let i = n; i <= eveValue; i++) {
//         if(set == 0){
//           cnt = runningNumber+i;
//           cnt = (cnt == 0)?1:cnt;
//         }else{
//           cnt = set+i;
//         }
//         no.push(createdByUser+"/"+currentUser+"/"+"2022"+"/"+cnt);
//         // no.push(createdByUser+"/"+currentUser+"/"+"2022"+"/"+ Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1)));
//         get++;
//       }
//     }else{
//       get=get+1;
//       cnt = runningNumber+1;
//       no.push(createdByUser+"/"+currentUser+"/"+"2022"+"/"+cnt);
//     }
//     set=get;
//   });
//   return no;
// } 


export function checkAlphabet(event: any) {

  var charCode = (event.which) ? event.which : event.keyCode;
  // console.log(charCode,'(keydown)="checkLength($event,50)"');

  if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode >= 123) && charCode != 32) {
    event.preventDefault();
    return false;
  }
  else {
    return true;
  }





}
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
}
export function convertDatewithdot(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('.')
}
export function convertDateShowValue(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [pad(d.getMonth() + 1), pad(d.getDate()), d.getFullYear()].join('/')
}
export function convertDatetoDDMMYYYY(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
}
export function convertDatetoDDMMYYYYwithdash(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-')
}
export function convertDates(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
}
export function numbersonly(e, control) {
  //alert('numbersonly')
  var unicode = e.charCode ? e.charCode : e.keyCode
  if (unicode != 8 && unicode != 46) //if the key isn't the backspace key (which we should allow)
  {
    if (unicode < 48 || unicode > 57) //if not a number
      //  return false //disable key press
      var character = String.fromCharCode(unicode);
    var val = control.value + character

    if (parseInt(val) > 100) {
      //  return false ;
    }

    if (String(val).indexOf(".") != -1) {
      if (String(val).indexOf(".") < String(val).length - 3) {
        //  return false ;
      }
    }
  }
}

export function subtractFromDate(fromDate: Date, year, month): {
  year: number, month: number, day: number
} {
  let disableObject = {
    year: fromDate.getFullYear() - year,
    month: (fromDate.getMonth() + 1),
    day: fromDate.getDate() + 1
  }

  if (month > 0) {
    if (disableObject.month > month) {
      disableObject.month -= month;
    }
    else {
      disableObject.year -= 1;
      disableObject.month = month - disableObject.month + 1;
    }
  }

  return disableObject;
}


export function customPaginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}
export function PasteAlpha(controlName: string, event: ClipboardEvent) {



  return (formGroup: FormGroup) => {
    var alphaExp = /^[a-zA-Z]+$/;
    let clipboardData = event.clipboardData
    let pastedText = clipboardData.getData('text');
    const value = (formGroup.controls[controlName].value);
    if (value.length > 50) {

      formGroup.controls[controlName].setValue(value.substring(0, 50))
    }
    if (value.match(alphaExp)) {

      return true
    }
    else {
      event.preventDefault();

      // let fieldName = pastedText.replace(/[^a-zA-Z ]/g,"").replace(/^\s+|\s+$/g, '');;
      // fieldName=  formGroup.controls[controlName].value + fieldName;
      // formGroup.controls[controlName].value.setValue(fieldName)
      return false

    }
    // formGroup.controls[controlName].setErrors(null);
  }


}

export function mergeArraysById(arr1, arr2, key) {
  // Create an empty object to store merged results
  const merged = {};

  // Merge arr1 into merged object
  arr1.forEach(item => {
    const id = key;
    if (!merged[id]) {
      merged[id] = { ...item };
    } else {
      merged[id] = { ...merged[id], ...item };
    }
  });

  // Merge arr2 into merged object
  arr2.forEach(item => {
    const id = key;
    if (!merged[id]) {
      merged[id] = { ...item };
    } else {
      merged[id] = { ...merged[id], ...item };
    }
  });

  // Convert merged object back to array
  const mergedArray = Object.values(merged);

  return mergedArray;
}
export function processCode(code) {
  if (code.includes(',')) {
    // Step 3
    let codesArray = code.split(',');
    codesArray.forEach(element => {
      if (element.includes('~')) {
        // Goto step 2
        processCodeWithTilde(element);
      } else {
        // Goto step 1
        processCodeWithoutTilde(element);
      }
    });
  } else {
    if (code.includes('~')) {
      // Goto step 2
      processCodeWithTilde(code);
    } else {
      // No tilde present, set number of bags to 1
      console.log("No. of bags: 1");
    }
  }
}

export function processCodeWithTilde(code) {
  let splitArray = code.split('~');
  console.log(splitArray, 'splitArray')
  let number = splitArray[0].match(/\d+/g);
  // console.log(number)
  let rangeStart = parseInt(number[number.length - 1]);
  // let rangeStart = splitArray[0].split('-').pop(); // Get value after last hyphen

  let rangeEnd = splitArray[1];
  let numberOfBags = rangeEnd - rangeStart + 1;
  console.log("No. of bags: " + numberOfBags);
}

export function processCodeWithoutTilde(code) {
  console.log("No. of bags: 1");
}
export function checkDecimalValue(event) {
  console.log(event.target.value)
  var charCode = (event.which) ? event.which : event.keyCode;
  let decimalValues = (event.target.value.toString()).split('.')[0];
  let decimalAfterValues = (event.target.value.toString()).split('.')[1];

  console.log('decimalValues',decimalValues);
  console.log('decimalAfterValues======',decimalAfterValues);
  if (parseInt(charCode) == 17 || parseInt(charCode) == 8) {
    return true;
  }
  if (decimalAfterValues && decimalAfterValues.length >= 3) {

    if (parseInt(charCode) == 17 || parseInt(charCode) == 8) {
      return true;
    }
    else {

      event.preventDefault();
      return false;
    }

  }
  if (decimalValues && decimalValues.length > 3) {
    // let decimalValue=(event.target.value.toString()).split('.')[1];

    // if(decimalValues && decimalValues.length>2){
    // event.preventDefault();
    // return false;
    // }
    // else{
    //   // return true
    // }
    let res = event.target.value.indexOf(".") == -1;
    console.log((event.target.value.toString()).split('.'), 'event.target.value')
    let result = event.target.value.toString();
    // return true;
  }

}
export function checkDecimalValueTwoPlace(event) {
  console.log(event.target.value)
  var charCode = (event.which) ? event.which : event.keyCode;
  let decimalValues=(event.target.value.toString()).split('.')[0];
  let decimalAfterValues=(event.target.value.toString()).split('.')[1];
  if(parseInt(charCode) == 17 || parseInt(charCode) == 8){
    return true;
  }
  if(decimalAfterValues && decimalAfterValues.length>=2){

    if(parseInt(charCode) == 17 || parseInt(charCode) == 8){
      return true;
    }
    else{

      event.preventDefault();
      return false;
    }

  }
  if(decimalValues && decimalValues.length>2){
    // let decimalValue=(event.target.value.toString()).split('.')[1];

    // if(decimalValues && decimalValues.length>2){
    //   event.preventDefault();
    //   return false;
    // }
    // else{
    //   // return true
    // }
    let res = event.target.value.indexOf(".") == -1;
    console.log((event.target.value.toString()).split('.'),'event.target.value')
    let result = event.target.value.toString();
    return true;

  // new code write here
  }
  
}


export function removeDuplicateObjectValues(arr, key) {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}