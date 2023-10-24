const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/adminCheck");
const upload = require("../middleware/multer");
const adminView = require("../controller/adminControllers/admin_View");
const adminAuth = require("../controller/adminControllers/adminAuth")
const adminUsersManagement = require("../controller/adminControllers/adminUsersManagement");
const adminProductManagement = require("../controller/adminControllers/adminProductManagement");
const adminCategoryManagement = require("../controller/adminControllers/adminCategoryManagement");
const adminOrderManagment = require("../controller/adminControllers/adminOrderManagment");
const adminSalesReport = require("../controller/adminControllers/salesReport");
const adminBannerManagement = require("../controller/adminControllers/adminBannerManagement");
const adminCouponManagment = require("../controller/adminControllers/adminCouponManagment");




// Admin DASHBOARD MANAGEMENT------------------------------------------------------------------------------------------------------------------------------------------------

router.get("/admin", isAdmin, adminView.adminDashboard);
router.get("/admin_chart", isAdmin, adminView.adminChart);
router.get("/admin_login", adminAuth.adminLoginGet);
router.get("/admin_logout", isAdmin, adminAuth.adminLogoutGet);
router.post("/admin_login", adminAuth.adminLoginPost);
// router.get("/admin_salesReport",adminSalesReport.adminSalesReportpost);
router.get("/admin_sales_reports",adminSalesReport.adminSalesReports );
router.get("/admin_sales_pdf",adminSalesReport.adminSalesReportPDF);



///////////////////////////////////////////// ADMIN USER MANAGMENT ////////////////////////////////////////////////////////
router.get("/admin_users_management", isAdmin, adminUsersManagement.adminUserManagementGet );
router.post("/user_block/:userId", isAdmin, adminUsersManagement.userBlock );
router.post("/user_unblock/:userId",isAdmin, adminUsersManagement.userUnblock );


////////////////////////////////////////////// ADMIN PRODUCT MANAGMENT /////////////////////////////////////////////////////
router.get("/admin_product_add_get", isAdmin, adminProductManagement.adminProductAddGet );
router.get("/admin_product_view_get", isAdmin, adminProductManagement.adminProductViewGet );
router.get("/admin_product_edit_get/:product_id", isAdmin, adminProductManagement.adminProductEditGet );
router.post("/admin_product_add_post", isAdmin, upload.array("image", 4), adminProductManagement.adminProductAddPost );
router.post("/admin_product_edit_post/:product_id", isAdmin, upload.array("image", 5), adminProductManagement.adminProductEditPost );
router.post("/admin_delete_image_post/:id", isAdmin, adminProductManagement.adminImageDeletePost );
router.post('/admin_product_unList', isAdmin, adminProductManagement.adminProductunlist );
router.post('/admin_product_list', isAdmin, adminProductManagement.adminProductList);
router.get('/admin_delete_all_listed_products/:product_id',isAdmin,  adminProductManagement.adminProductDelete);



///////////////////////////////////////////////// ADMIN CATEGORY MANAGMENT ////////////////////////////////////////////////
router.get("/admin_category_view_get", isAdmin, adminCategoryManagement.admincategoryViewGet );
router.get("/admin_category_add_get", isAdmin, adminCategoryManagement.adminCategoryAddGet );
router.get("/admin_category_edit_get/:category_id", isAdmin, adminCategoryManagement.adminCategoryEditGet );
router.post("/admin_category_add_post", isAdmin, upload.single("image"), adminCategoryManagement.adminCategoryAddPost );
router.post("/admin_category_edit_post/:category_id", isAdmin, upload.single("image"), adminCategoryManagement.adminCategoryEditPost );
router.post('/admin_category_unlist', isAdmin, adminCategoryManagement.adminCategoryUnList);
router.post('/admin_category_list', isAdmin, adminCategoryManagement.adminCategoryList);
// router.post("/admin_delete_image_post/:id", isAdmin, adminCategoryManagement.adminImageDeletePost );
router.get('/admin_delete_all_listed_category/:category_id',isAdmin,  adminCategoryManagement.adminategoryDelete);


/////////////////////////////////////////////// ADMIN ORDER MANAGMENT /////////////////////////////////////////////////
router.get("/admin_orders_view_get", isAdmin, adminOrderManagment.adminOrderViewGet );
router.post("/admin_order_status_post", isAdmin, adminOrderManagment.adminOrderStatusPost );
router.get("/admin_order_history_get/:orderId", isAdmin, adminOrderManagment.adminOrderHistoryGet);
router.get("/admin_order_details_get/:orderId",isAdmin,adminOrderManagment.adminOrderDetailsGet)



//////////////////////////////////////////////// ADMIN BANNER MANAGMENT /////////////////////////////////////////////
router.get("/admin_banner_view_get", isAdmin, adminBannerManagement.adminBannerView );
router.get("/admin_banner_add_get", isAdmin, adminBannerManagement.adminAddBannerGet );
router.get("/admin_banner_edit_get", isAdmin, adminBannerManagement.adminEditBannerGet );
router.post("/admin_banner_add_post", isAdmin, upload.single("image"),adminBannerManagement.adminAddBannerPost );
router.post("/admin_banner_edit_post", isAdmin, upload.single("image"),adminBannerManagement.adminEditBannerPost );
router.post("/admin_banner_/:action", isAdmin, adminBannerManagement.adminBannerAlterPost );



///////////////////////////////////////////////// ADMIN COUPON MANAGMENT //////////////////////////////////////////////
router.get("/admin_coupon_view_get", isAdmin, adminCouponManagment.adminCouponView );
router.get("/admin_coupon_add_get", isAdmin, adminCouponManagment.adminCouponAddView );
router.post("/admin_coupon_add_post", isAdmin,adminCouponManagment.admincouponAddPost );
router.delete("/admin_Remove_coupon/:coupon_id",isAdmin,adminCouponManagment.adminRemovecoupon)

module.exports = router;





