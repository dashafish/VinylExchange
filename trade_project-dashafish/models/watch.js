const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const watchSchema = new Schema({
    user:{type: Schema.Types.ObjectId, ref:'User'},
    watchItem:{type: Schema.Types.ObjectId, ref:'Item'}
});

module.exports = mongoose.model('Watch', watchSchema);

