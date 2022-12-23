const mongoose = require("mongoose");
const url = process.env.MONGODB_URL;
console.log(url);
const dbConnection = setInterval(async () => {
    mongoose.connect(url).then(() => {
        console.log("Db connected");
        clearInterval(dbConnection);
    }).catch(e => {
        console.error(e);
        console.log("trying to reconnect, pls check your code");
    })
}, 1000);

