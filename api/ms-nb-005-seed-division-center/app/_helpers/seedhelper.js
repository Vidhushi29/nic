
class seedhelper {
    static removeDuplicates(array, key) {
       const uniqueValues = new Set();
       return array.filter(obj => {
           if (!uniqueValues.has(obj[key])) {
               uniqueValues.add(obj[key]);
               return true;
           }
           return false;
       });
       }
   static removeTwoDuplicates(arr) {
       const uniqueObjects = {};

       arr.forEach(obj => {
           const uniqueKey = obj['id'] ;

           if (!uniqueObjects.hasOwnProperty(uniqueKey)) {
               uniqueObjects[uniqueKey] = obj;
           }
       });

       return Object.values(uniqueObjects);
   }
   
   static sumofDuplicateData(indentordata){
       const uniqueIndentorDataMap = []
       for (const item of indentordata) {
         let keys = ['user_id']
         const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

         if (!uniqueIndentorDataMap[key]) {
           uniqueIndentorDataMap[key] = { ...item }; // Copy the object
         } else {
           uniqueIndentorDataMap[key].quantity_of_seed_produced += item.quantity_of_seed_produced; // Calculate the sum based on the "value" property
         }
       }
       const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
       return uniqueJsonArrays
   }
   static sumofDuplicateDataVariety(indentordata){
       const uniqueIndentorDataMap = []
       for (const item of indentordata) {
         let keys = ['crop_code']
         const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

         if (!uniqueIndentorDataMap[key]) {
           uniqueIndentorDataMap[key] = { ...item }; // Copy the object
         } else {
           uniqueIndentorDataMap[key].quantity_of_seed_produced += item.quantity_of_seed_produced; // Calculate the sum based on the "value" property
         }
       }
       const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
       return uniqueJsonArrays
   }
      static sumofDuplicateDataAllocated(indentordata){
       const uniqueIndentorDataMap = []
       for (const item of indentordata) {
         let keys = ['crop_code']
         const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

         if (!uniqueIndentorDataMap[key]) {
           uniqueIndentorDataMap[key] = { ...item }; // Copy the object
         } else {
           uniqueIndentorDataMap[key].allocated += item.allocated; // Calculate the sum based on the "value" property
         }
       }
       const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
       return uniqueJsonArrays
   }
   static sumofDuplicateDataIndenter(indentordata){
       const uniqueIndentorDataMap = []
       for (const item of indentordata) {
         let keys = ['user_id']
         const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

         if (!uniqueIndentorDataMap[key]) {
           uniqueIndentorDataMap[key] = { ...item }; // Copy the object
         } else {
           uniqueIndentorDataMap[key].lifting_quantity += item.lifting_quantity; // Calculate the sum based on the "value" property
         }
       }
       const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
       return uniqueJsonArrays
   }
   
   static sumofDuplicateDataAllocatedQty(indentordata){
    const uniqueIndentorDataMap = []
    for (const item of indentordata) {
      let keys = ['user_id']
      const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

      if (!uniqueIndentorDataMap[key]) {
        uniqueIndentorDataMap[key] = { ...item }; // Copy the object
      } else {
        uniqueIndentorDataMap[key].qty += item.qty; // Calculate the sum based on the "value" property
      }
    }
    const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
    return uniqueJsonArrays
}
static sumofDuplicateDataIndentDataQty(indentordata){
const uniqueIndentorDataMap = []
for (const item of indentordata) {
  let keys = ['crop_code','variety_id']
  const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

  if (!uniqueIndentorDataMap[key]) {
    uniqueIndentorDataMap[key] = { ...item }; // Copy the object
  } else {
    uniqueIndentorDataMap[key].indent_quantity += item.indent_quantity; // Calculate the sum based on the "value" property
  }
}
const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
return uniqueJsonArrays
}
     
}
module.exports=seedhelper