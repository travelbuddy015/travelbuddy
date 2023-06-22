const User = require("../models/user");

exports.getProfile= (req,res,next)=>{
    const user = req.user;
   
    res.render("profile",{user});
};

exports.updateProfile= (req,res,next)=>{
    // (req.user._id,{
    //     name: req.body.name,
    //     username: req.body.email,
    //     phone: req.body.phone,
    //     age: req.body.age,
    //     gender: req.body.gender,
    //     city: req.body.city,
    // });
   
        const user = req.user;
   
    
                user.name= req.body.name;
                user.username=req.body.email;
                user.phone=req.body.phone;
                user.age=req.body.age;
                user.gender= req.body.gender;
                user.city= req.body.city;
        user.save();
 
    res.redirect('/dashboard');
    next();

}