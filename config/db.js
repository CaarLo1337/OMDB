const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');



mongoose
    .connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true, 
        useUnifiedTopology: true}
    )
    .then(() => {
        console.log(`\n*  Database successfully connected\n`);
    })
    .catch((err) => {
        console.log(err) 
    });