const Coupons = require("../../model/coupon");

exports.adminCouponView = async (req, res) => {
  const coupons = await Coupons.find();
  res.render("admin_coupon_view", { coupons });
};

exports.adminCouponAddView = async (req, res) => {
  res.render("admin_coupon_add");
};

exports.admincouponAddPost = async (req, res) => {
  const valid = couponValidation(req.body);
  try {
    if (!valid.isValid) {
      const error = new Error();
      error.code = 400;
      error.errors = valid.errors;
      return res.status(400).json({ error: valid.errors });
    }

    const { code, discount, minDiscount, maxDiscount, expiryDate } = req.body;

    const expiryDateObj = new Date(expiryDate);
    const currentDate = new Date();

    let status;
    if (expiryDateObj < currentDate) {
      status = false;
    } else {
      status = true;
    }

    const coupon = new Coupons({
      code: code,
      discount: discount,
      minDiscount: minDiscount,
      maxDiscount: maxDiscount,
      expiryDate: expiryDateObj,
      status: status,
    });
    await coupon.save();
    console.log("coupon data",coupon)
    return res.status(200).end();
  } catch (err) {
    if (err.code == 400) {
      return res.status(400).json({ error: err.errors });
    }
  }
};

function couponValidation(data) {
  const { code, discount, minDiscount, maxDiscount, expiryDate } = data;
  const errors = {};
  const regex = /^[0-9]+$/;
  if (!code) {
    errors.couponCodeError = "The coupon code should not be empty";
  }

  if (!discount) {
    errors.couponDiscountError = "Please enter an discount amount";
  } else if (!regex.test(discount)) {
    errors.couponDiscountError = "The discount should only be numbers";
  }

  if (!minDiscount) {
    errors.couponMinDiscountError = "Please provide an Minimum amount";
  } else if (!regex.test(minDiscount)) {
    errors.couponMinDiscountError = "The Minimum price should only be numbers";
  }

  if (!maxDiscount) {
    errors.couponMaxDiscountError = "Please provide an Maximum amount";
  } else if (!regex.test(maxDiscount)) {
    errors.couponMaxDiscountError = "The Maximum price should only be numbers";
  }

  if (!expiryDate) {
    errors.couponDateError = "Please provide a Date for expiry";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}


exports.adminRemovecoupon = async (req, res) => {
  try {
    const couponId = req.params.coupon_id; // Check the parameter name

    console.log('Received couponId:', couponId);

    const removedCoupon = await Coupons.findByIdAndRemove(couponId);

    if (!removedCoupon) {
      console.log('Coupon not found.');
      return res.status(404).json({ error: 'Coupon not found' });
    }

    console.log('Coupon removed successfully.');

    res.status(200).json({ message: 'Coupon removed successfully' });
  } catch (error) {
    console.error('Error removing coupon:', error);
    res.status(500).json({ error: 'Coupon removal failed' });
  }
};
