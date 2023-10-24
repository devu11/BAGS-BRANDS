// const Products = require("../../model/products");
// const User = require("../../model/users");
// const Categories = require("../../model/category");

// exports.userProductsViewGet = async (req, res) => {
//   let result, category, sort, keyword, priceRange;
//   let sortOption = {};
//   const query = { isVisible: true };

//   try {
//     /////////////////////// GETTING CATEGORY IF ANY ////////////////////////////////////////////////
//     if (req.query.category && req.query.category !== "false") {
//       category = req.query.category;
//     } else {
//       category = false;
//     }

//     //////////////////////// GETTING SORT VALUE IF ANY //////////////////////
//     if (req.query.sort && req.query.sort !== "false") {
//       sort = req.query.sort;
//       if (req.query.sort == "lowToHigh") {
//         sortOption.price = 1;
//       } else if (req.query.sort == "highToLow") {
//         sortOption.price = -1;
//       }
//     } else {
//       sort = false;
//     }

//     /////////////////////// GETTING PRICE RANGE VALID IF ANY /////////////////////
//     if (req.query.priceRange && req.query.priceRange !== "false") {
//       priceRange = req.query.priceRange;
//       let priceRangeParts = priceRange.replaceAll(/₹/g, "").trim();
//       priceRangeParts = priceRangeParts.split("-");
//       query.price = {
//         $gt: parseFloat(priceRangeParts[0]),
//         $lt: parseFloat(priceRangeParts[1]),
//       };
//     } else {
//       priceRange = false;
//     }

//     //////////////////////// GETTING KEYWORD IF ANY ////////////////////////////////
//     if (req.query.keyword && req.query.keyword !== "false") {
//       keyword = req.query.keyword;
//       query.name = new RegExp(keyword, "i");
//     } else {
//       keyword = false;
//     }

//     const categories = await Categories.findOne({ categoryName: category });
//     if (categories && categories.isAvailable) {
//       query.category = categories._id;
//     }

//     const user = await User.findOne({ email: req.session.email });
//     let wishlistedProduct = [];
//     if (user) {
//       wishlistedProduct = user.wishlist;
//     }

//     const currentPage = parseInt(req.query.page) || 1;
//     const productsPerPage = 6;
//     const skip = (currentPage - 1) * productsPerPage;

//     const totalCount = await Products.countDocuments(query).sort();
//     const totalPages = Math.ceil(totalCount / productsPerPage);
//     const products = await Products.find(query)
//       .populate({
//         path: "category",
//         match: { isAvailable: true },
//         select: "_id",
//       })
//       .sort(sortOption)
//       .skip(skip)
//       .limit(productsPerPage);
//     const filteredProducts = products.filter(
//       (product) => product.category !== null
//     );

//     if (req.session.email) {
//       res.render("user_product_view", {
//         filteredProducts,
//         loggedIn: true,
//         totalCount,
//         totalPages,
//         currentPage,
//         wishlistedProduct,
//         category,
//         noMoredata: Boolean(false),
//         sort,
//         keyword,
//         priceRange,
//       });
//     } else {
//       res.render("user_product_view", {
//         filteredProducts,
//         loggedIn: false,
//         totalCount,
//         totalPages,
//         currentPage,
//         wishlistedProduct,
//         category,
//         noMoreData: Boolean(false),
//         sort,
//         keyword,
//         priceRange,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };


const Products = require("../../model/products");
const User = require("../../model/users");
const Categories = require("../../model/category");

exports.userProductsViewGet = async (req, res) => {
  console.log(566556,req.query)
  let result, category, sort, keyword, priceRange;
  let sortOption = {};
  const query = { isVisible: true };

  try {
    /////////////////////// GETTING CATEGORY IF ANY ////////////////////////////////////////////////
    if (req.query.category && req.query.category !== "false") {
      category = req.query.category;
    } else {
      category = false;
    }

    //////////////////////// GETTING SORT VALUE IF ANY /////search-container/////////////////
    if (req.query.sort && req.query.sort !== "false") {
      sort = req.query.sort;
      if (req.query.sort == "lowToHigh") {
        sortOption.price = 1;
      } else if (req.query.sort == "highToLow") {
        sortOption.price = -1;
      }
    } else {
      sort = false;
    }

    /////////////////////// GETTING PRICE RANGE VALID IF ANY /////////////////////
    if (req.query.priceRange && req.query.priceRange !== "false") {
      priceRange = req.query.priceRange;
      let priceRangeParts = priceRange.replaceAll(/₹/g, "").trim();
      priceRangeParts = priceRangeParts.split("-");
      query.price = {
        $gt: parseFloat(priceRangeParts[0]),
        $lt: parseFloat(priceRangeParts[1]),
      };
    } else {
      priceRange = false;
    }

    //////////////////////// GETTING KEYWORD IF ANY ////////////////////////////////
    if (req.query.keyword && req.query.keyword !== "false") {
      keyword = req.query.keyword;
      query.name = new RegExp(keyword, "i");
    } else {
      keyword = false;
    }

    const categories = await Categories.findOne({ categoryName: category });
    if (categories && categories.isAvailable) {
      query.category = categories._id;
    }

    const user = await User.findOne({ email: req.session.email });
    let wishlistedProduct = [];
    if (user) {
      wishlistedProduct = user.wishlist;
    }

    const currentPage = parseInt(req.query.page) || 1;
    const productsPerPage = 6;
    const skip = (currentPage - 1) * productsPerPage;

    const totalCount = await Products.countDocuments(query).sort();
    const totalPages = Math.ceil(totalCount / productsPerPage);

    // Search functionality
    if (req.query.q) {
      keyword = req.query.q;
      const searchResults = await Products.find({
        $text: { $search: keyword },
        isVisible: true,
      }).then((res)=>{
        console.log(res,33)
      }).catch((err)=>console.log(err))
      // You can process and use searchResults in your rendering logic.
      if (searchResults?.length > 0) {
        // You have search results, use them in your rendering logic
        res.render("user_product_view", {
          filteredProducts: searchResults,
          loggedIn: req.session.email ? true : false,
          totalCount: searchResults.length,
          totalPages: 1,
          currentPage: 1,
          wishlistedProduct,
          category,
          noMoreData: Boolean(false),
          sort,
          keyword,
          priceRange,
        });
        return; // Exit the function to avoid rendering the default view
      }
    }

    // If no search results found, render the regular product view
    const products = await Products.find(query)
      .populate({
        path: "category",
        match: { isAvailable: true },
        select: "_id",
      })
      .sort(sortOption)
      .skip(skip)
      .limit(productsPerPage);
    const filteredProducts = products.filter(
      (product) => product.category !== null
    );

    if (req.session.email) {
      res.render("user_product_view", {
        filteredProducts,
        loggedIn: true,
        totalCount,
        totalPages,
        currentPage,
        wishlistedProduct,
        category ,
        noMoredata: Boolean(false),
        sort,
        keyword,
        priceRange,
      });
    } else {
      res.render("user_product_view", {
        filteredProducts,
        loggedIn: false,
        totalCount,
        totalPages,
        currentPage,
        wishlistedProduct,
        category,
        noMoreData: Boolean(false),
        sort,
        keyword,
        priceRange,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.userCategoryProductViewGet = async (req, res) => {
  try {
    console.log(req.query)
    const categoryId = req.query.category;
    const products = await Products.find({ category: categoryId });
    const user = await User.findOne({ email: req.session.email });
    let wishlistedProduct = [];
    if (user) {
      wishlistedProduct = user.wishlist;
    }

    const totalCount = await Products.countDocuments({ category: categoryId });
    if (req.session.email && !user.isBlocked) {
      res.render("user_product_category_view", {
        loggedIn: true,
        products,
        totalCount,
        wishlistedProduct,
      });
    } else {
      res.render("user_product_category_view", {
        loggedIn: false,
        products,
        totalCount,
        wishlistedProduct,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.userProductDetailsGet = async (req, res) => {
  const id = req.params.product_id;
  const product = await Products.findById(id);
  const user = await User.findOne({ email: req.session.email });
  let outOfStock = "";
  if (product.stock == 0) {
    outOfStock = "Currently Out Of Stock";
  }
  let userCartItems = 0;
  if (user) {
    userCartItems = user.cart.length;
  }
  if (req.session.email && !user.isBlocked) {
    res.render("user_product_details", {
      loggedIn: true,
      product,
      userCartItems,
      outOfStock,
    });
  } else {
    res.render("user_product_details", {
      loggedIn: false,
      product,
      outOfStock,
    });
  }
};

exports.userFilterCategory = async (req, res) => {
  const categoryId = req.params.categoryid;
  const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter or default to 1
  const perPage = 6;
  try {
    const totalProducts = await Products.countDocuments({
      category: categoryId,
    });
    const totalPages = Math.ceil(totalProducts / perPage);
    const skip = (page - 1) * perPage;

    const user = await User.findOne({ email: req.session.email });
    let wishlistedProduct = [];
    if (user) {
      wishlistedProduct = user.wishlist;
    }
    const categorizedProduct = await Products.find({ category: categoryId })
      .skip(skip)
      .limit(perPage);
    res.json({ categorizedProduct, wishlistedProduct, page, totalPages });
  } catch (err) {
    console.log(err);
  }
};

exports.createProduct = async (req, res) => {
  const { name, price } = req.body;

  if (!Number.isInteger(price)) {
    return res.status(400).send('Price must be a valid number.');
  }

  try {
    const newProduct = new Product({ name, price });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    // Handle database or other errors
    res.status(500).send('Error creating product.');
  }
  const invalidPriceRecords = await Product.find({ price: { $type: 'string' } });

for (const record of invalidPriceRecords) {
  const validPrice = parseFloat(record.price);
  if (!isNaN(validPrice)) {
    record.price = validPrice;
    await record.save();
  }
}
};
exports.usersearch = async (req,res)=>{
  try{
    if (req.query.q) {
      keyword = req.query.q;
      const user = await User.findOne({ email: req.session.email });
    let wishlistedProduct = [];
    if (user) {
      wishlistedProduct = user.wishlist;
    }

      const searchResults = await Products.find({
        $text: { $search: keyword },
        isVisible: true,
      }).then((result)=>{
        console.log(result,33)
        res.render("user_product_view", {
          filteredProducts: result,
          loggedIn: req.session.email ? true : false,
          totalCount: result.length,
          totalPages: 1,
          currentPage: 1,
          wishlistedProduct,
          noMoreData: Boolean(false),
          category : result.category,
          keyword,
          priceRange : 0,
          sort : null

        });
      }).catch((err)=>console.log(err))
      // You can process and use searchResults in your rendering logic.
      if (searchResults.length > 0) {
        // You have search results, use them in your rendering logic
        
        return; // Exit the function to avoid rendering the default view
      }
    }
  }catch(err){
    console.error(err.message);
  }
}