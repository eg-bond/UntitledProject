const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    idGenerator: {type: Number, required: true},
    todoListArr: [],
    todoContentObj: Schema.Types.Mixed
});

module.exports = model('Todo', schema);


// owner: {type: Types.ObjectId, ref: 'User'}