const mongoose = require('mongoose')
const Mongo_Url = process.env.MONGO_URL
function dbConnection(params) {
    mongoose.connect(Mongo_Url, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then((data) => {
        console.log('Db connected successfully');
    }).catch((error) => {
        console.log('Error while db connection ', error);
    })
}

module.exports = dbConnection;