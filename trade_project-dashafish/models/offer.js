const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const offerSchema =({
    sender: {type: Schema.Types.ObjectId, ref:'User'},
    receiver: {type: Schema.Types.ObjectId, ref:'User'},
    ownedItem: {type: Schema.Types.ObjectId, ref:'Item'},
    wantedItem: {type: Schema.Types.ObjectId, ref:'Item'},

});

//collection name is items in the database
module.exports = mongoose.model('Offer', offerSchema);
