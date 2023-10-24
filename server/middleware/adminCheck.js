require('dotenv').config();

const adminIsLogged = async (req, res, next) =>{
    if(req.session.adminEmail){
        console.log(6);
        next();
    } else {
        console.log(9);
        res.redirect("/admin_login");
        //res.render("admin_login",{message:"",totalUsers:true,totalProducts:true,totalOrders:true,totalRevenue:true});
    }
}

module.exports = adminIsLogged;