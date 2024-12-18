const products = require("../controllers/product.controller.js");
const auth = require('../_middleware/auth');
// const redis = require('../_middleware/redis');

module.exports = app => {
    app.post("/api/add-product/:companyId",auth, products.addProduct)
    app.post("/api/edit-product/:productId",auth, products.editProduct)
    app.post("/api/view-product",auth, products.viewProduct)
    app.post("/api/add-tag",auth, products.addTag)
    app.post("/api/delete-product/:productId",auth, products.deleteProduct)
    app.post("/api/update-product-status/:productId",auth, products.updateProductStatus)
    app.post("/api/get-cfc-users",auth, products.getCfcUsers)
    app.post("/api/update-status/:productId",auth, products.updateProductStatus2)
    app.post("/api/update-product-meeting/:productId",auth, products.updateProductMeeting)
    app.post("/api/get-meetingid",products.getMeetingId)

    app.post("/api/post-comment/:userId/:productId",auth, products.postComment)
    app.get("/api/get-comment/:id",auth, products.getComment)
    app.get("/api/get-crop-name",auth, products.getCrop)
    app.get("/api/get-company-name",auth, products.getAllCompanyName)
    app.get("/api/get-crop-name/:id",auth, products.getCrop)
    // app.get("/api/get-All-companyName",products.getAllCompanyName)
    app.post("/api/update-comment",auth, products.updateComment)
   // app.post("/api/upload-application", applications.uploadApplication)
   // app.get("/api/view-application/:id", auth, applications.viewApplication )
    app.get("/api/get-all-country",auth, products.getAllCountry)
   
    app.post("/api/get-company-email",products.getCompanyEmail)

    app.post("/api/add-state",auth,products.addState)
    app.get("/api/get-state-list",products.viewState)
    app.post("/api/get-all-states", auth,  products.getAllState)

    app.post("/api/edit-state", auth, products.editState)
    app.post("/api/delete-state", auth, products.deleteState)

    app.post("/api/add-district", auth,  products.addDistrict)
    app.get("/api/get-district-list/:id", auth,  products.viewDistrict)
    app.get("/api/get-all-districts", auth,  products.viewAllDistricts)
    app.post("/api/get-all-districts", auth,  products.getAllDistricts)
    app.post("/api/edit-district", auth, products.updateDistrict)



    app.post("/api/add-subdistrict", auth,  products.addSubdistrict)
    app.get("/api/get-subdistrict-list/:id", auth, products.viewSubdistrict)
    app.get("/api/get-all-subdistricts", auth, products.viewAllSubdistricts)
    app.post("/api/get-all-subdistricts", auth,  products.getAllSubdistricts)
    app.post("/api/edit-subdistrict", auth, products.updateSubdistrict)



    app.post("/api/add-block", auth, products.addBlock)
    app.get("/api/get-block-list/:id",auth,products.viewBlock)
    app.get("/api/get-all-blocks",auth,products.viewAllBlocks)
    app.post("/api/get-all-blocks", auth, products.getAllBlocks)
    app.post("/api/edit-block", auth,products.updateBlock)



    app.post("/api/add-village", products.addVillage)
    // app.get("/api/get-all-villages", products.getAllVillages)
    app.get("/api/get-village-list/:id",products.viewVillage)
    // app.post("/api/get-village-list",products.getAllVillage)

    //
    app.post("/api/get-all-villages", products.getAllVillages)
    app.post("/api/edit-village",products.updateVillage)


    app.post("/api/delete-district",products.deleteDistrict)
    app.post("/api/delete-sub-district",products.deleteSubDistrict)
    app.post("/api/delete-block",products.deleteBlock)
    app.post("/api/delete-village",products.deleteVillage)
   
 
};
    