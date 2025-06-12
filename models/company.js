const mongoose = require('mongoose');

const CompanySchema =mongoose.Schema({
    name:{
        type :String,
        required: true,
    },
    email:{
        type :String,
        required: true,
    },
    password:{
        type :String,
        required: true,
    },
    phone:{
        type :String,
        required: true,
    },
    address:{
        type :String,
        required: true,
    },
    website:{
        type :String,
        required: true,
    },
    image:{
        public_id:{type:String},
        url:{type:String},
    },
    role:{
        type:String,
        default:"company"
        
    },
    

})
const CompnayModel =mongoose.model('company',CompanySchema)

module.exports =CompnayModel