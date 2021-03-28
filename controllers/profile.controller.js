module.exports = {
    profile_get
}

function profile_get(req, res) {
    console.log(user.role);
    res.render('profile.ejs');
}