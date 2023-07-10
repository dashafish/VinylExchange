const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    owner:{type: Schema.Types.ObjectId, ref:'User'},
    name:{type: String, required: [true, "name is required"]},
    category:{type: String, required: [true, "category is required"]},
    details:{type: String, required:[true, "details are required"],
            minLength:[10, 'description should have at least 10 characters']},
    status:{type:String, required:[true, "status is required"],
                enum:['available', 'pending','traded', 'hidden']},
    artist:{type: String, required: [true, "artist is required"]},
    image:{type:String},
    condition:{type: String, required: [true, "condition is required"]},
    createdAt:{type: Date, default: Date.now}
},
{timestamps:true }
);

//collection name is items in the database
module.exports = mongoose.model('Item', tradeSchema);
