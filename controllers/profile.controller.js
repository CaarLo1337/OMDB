const User = require("../models/user.model");

module.exports = {
    profile_get
}

async function profile_get(req, res) {
    // some testing
    req.user = await User.findOne();
    const userdata = req.user
    console.log(userdata.role);

    // render profilepage
    res.render('profile.ejs');
}