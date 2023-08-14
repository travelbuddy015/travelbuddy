exports.getHotellist = (req,res,next) =>{
    res.render("hotellist", {user: req.user});
}