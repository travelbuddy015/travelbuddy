const express = require('express')
const passport = require('passport')
const router = express.Router()
const user = require('../models/user')

router.get('/login', (req, res) => {
    const data = {}
    data.user = req.user
    res.render('login', { data })
})
router.get('/registration', (req, res) => {
    const data = {}
    data.user = req.user
    res.render('register', { data })
})

router.post('/login', passport.authenticate('userlocal', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.post('/registration', (req, res) => {
    console.log(req.body)
    const temp = new user({
        username: req.body.username,
        name: req.body.name,
    })

    user.register(temp, req.body.password, (err, item) => {
        if (err) {
            console.log(err);
            res.render('register');
        }
        passport.authenticate('userlocal')(req, res, () => {
            res.redirect('/')
        });
    });
});

module.exports = router