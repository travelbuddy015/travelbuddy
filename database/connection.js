const mongoose = require('mongoose')

const db = async () => {
    try {
        const con = await mongoose.connect("mongodb+srv://dustin:1234@nodeexpressproject.ihoq4gl.mongodb.net/travelbuddy", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected with database...')
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
module.exports = db