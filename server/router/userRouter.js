const express=require('express')
const router = express.Router();
const userHomeGet = require("../controller/userControllers/userView.js");
const userLogin = require("../controller/userControllers/userLogin.js");
const userAccountDetails = require("../controller/userControllers/userAccountDetails.js");
const userRegister = require("../controller/userControllers/userRegisters.js");
const userLogout = require("../controller/userControllers/userLogout.js");
const userHeaderMiddleware = require("../middleware/userHeader.js");
const userProductView = require("../controller/userControllers/userProducts.js");
const userAddress = require("../controller/userControllers/userAddress.js");
const userForgotPassword = require("../controller/userControllers/userForgotPassword.js");
const userCart = require("../controller/userControllers/userCart.js");
const userCheckout = require("../controller/userControllers/userCheckout.js");
const userOrders = require("../controller/userControllers/userOrders.js");
const userOrderSuccess = require("../controller/userControllers/userOrderSuccess.js");
const userOrderInvoice = require('../controller/userControllers/userOrderInvoice.js');
const userWishlist = require("../controller/userControllers/userWishlist.js");
const userAuth = require("../middleware/userAuth.js")
// const userSearch= require("../controller/userControllers/userSearch.js")
const { isLogged, blockCheck, isUser } = userAuth;


////////////////////////////////////////////// USER AUTH AND FUNCTIONS //////////////////////////////////////////////
router.get("/", isLogged, userHeaderMiddleware, userHomeGet.home);
router.get('/logout', userLogout.userBlockLogoutGet);
router.get("/login", userHeaderMiddleware, userLogin.loginGet);
router.get("/register", userHeaderMiddleware, userRegister.signinGet);
router.get("/user_otp", userHeaderMiddleware, userRegister.userOtpGet);
router.get("/registerOtp", userHeaderMiddleware, userRegister.registerOtpGet);
router.post("/register", userHeaderMiddleware, userRegister.siginPost);
router.post("/login", userHeaderMiddleware, userLogin.loginPost);
router.post("/user_otp", userHeaderMiddleware, userRegister.userotpPost);
router.post("/user_otp", userHeaderMiddleware, userRegister.userotpPost);
router.get("/user_otp_verifyGet", userHeaderMiddleware, userForgotPassword.verifyOtpGet );
router.post("/user_otp_verifyPost", userHeaderMiddleware, userForgotPassword.verifyOtpPost );
router.get("/user_email_verifyGet", userHeaderMiddleware, userForgotPassword.verifyEmailGet);
router.post("/user_email_verifyPost", userHeaderMiddleware, userForgotPassword.verifyEmailPost );
router.get("/user_confirm_passwordGet", userHeaderMiddleware, userForgotPassword.confirmPasswordGet );
router.post("/user_confirm_passwordPost", userHeaderMiddleware, userForgotPassword.confirmPasswordPost );
router.get("/user_logout", userHeaderMiddleware, userLogout.userLogoutGet);
router.post("/resend_otp_post", userHeaderMiddleware, userForgotPassword.resendOtp );


///////////////////////////////////////////// USER PRODUCT BASED FUNCTIONS ////////////////////////////////////////////
router.get("/user_product_view_get", userHeaderMiddleware, userProductView.userProductsViewGet );
router.get("/user_category_product_view_get", userHeaderMiddleware, userProductView.userCategoryProductViewGet );
router.get("/user_product_details_get/:product_id", userHeaderMiddleware, userProductView.userProductDetailsGet );
router.post("/user_filter_category_post/:categoryid", userHeaderMiddleware, userProductView.userFilterCategory );
router.get("/user_search", userHeaderMiddleware, userProductView.usersearch );



router.post('/create-product',userHeaderMiddleware, userProductView.createProduct )


//////////////////////////////////////////// USER PROFILE BASED FUNCTIONS /////////////////////////////////////////
router.get("/user_account_details_get", userHeaderMiddleware, isLogged, userAccountDetails.userAccountDeatailsGet );
router.post("/user_address_post", isUser, userHeaderMiddleware, blockCheck, userAddress.userAddressPost )
router.post("/user_address_remove_post", isUser, userHeaderMiddleware, blockCheck, userAddress.userAddressRemovePost );
router.post("/user_account_edit_post", isUser, userHeaderMiddleware, blockCheck, userAccountDetails.userAccountDetailsEditPost );


///////////////////////////////////////////// USER CART AND WISHLIST BASED FUNCTIONS ///////////////////////////////////
router.get("/user_wishlist_get", userHeaderMiddleware, isLogged, userWishlist.wishListGet );
router.get("/user_cart_get", userHeaderMiddleware, isLogged, userCart.userCartGet);
router.post("/user_wishlist_post/:product_id", isUser, userHeaderMiddleware, userWishlist.wishlistPost );
router.post("/user_wishlist_remove/:id", isUser, userHeaderMiddleware, userWishlist.wishlistRemove );
router.post("/user_add_to_cart_post/:productid/:quantity", isUser, blockCheck, userHeaderMiddleware, userCart.userCartPost );
router.post("/user_cart_remove/:id", isUser, userHeaderMiddleware, blockCheck, userCart.userCartRemovePost );
router.post("/user_cart_quantity_update", isUser, userHeaderMiddleware, blockCheck, userCart.userCartQuantityUpdate );


///////////////////////////////////////////// USER ORDER BASED FUNCTIONS ///////////////////////////////////////////
router.get("/user_checkout_get", isLogged, userHeaderMiddleware, userCheckout.userCheckOutGet );
router.post("/user_checkout_post", isUser, userHeaderMiddleware, blockCheck, userCheckout.userCheckOutPost );
router.get("/user_order_success_get/:id", userHeaderMiddleware, isLogged, userOrderSuccess.userOrderSuccessGet );
router.get("/user_order_history_get", userHeaderMiddleware, isLogged, userOrders.userOrderHistoryGet );
router.get("/user_order_details_get",userHeaderMiddleware, isLogged, userOrders.userOrderDetailsGet );
router.post("/user_order_cancel", isUser, userHeaderMiddleware, blockCheck, userOrders.userOrderCancel );
router.post("/user_order_returned", isUser, userHeaderMiddleware, blockCheck, userOrders.userOrderReturn );
router.post("/user_coupon_check", isUser, userHeaderMiddleware, blockCheck, userCheckout.userCouponCheck );
router.post('/user_order_invoice', isUser, userHeaderMiddleware, blockCheck, userOrderInvoice.userOrderInvoice);

router.get("/get-available-coupons",isUser,userHeaderMiddleware,blockCheck,userCheckout.availableCoupon)

// router.get('/user_Order_Summary_get',isUser, userHeaderMiddleware, blockCheck, userOrderSuccess.userOrderSummaryGet)




module.exports = router;