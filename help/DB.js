const mongoose = require('mongoose');
const DB = () => {

    try {
  

        mongoose.connect("mongodb://localhost/new", 
            {
                    useNewUrlParser:true,
                    useUnifiedTopology:true,
                    useFindAndModify:true
            },
            console.log('connected to DB'));
    } catch (e) {
        console.log('error in DB connection', e);
    }
}

module.exports = DB