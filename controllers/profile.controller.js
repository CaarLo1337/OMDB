module.exports = {
    profile_get
}

async function profile_get(req, res) {
    // render profilepage
    res.render('profile.ejs');
}