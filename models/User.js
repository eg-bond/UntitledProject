const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    nickname: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    pass: {type: String, required: true},
    todoData: {type: Types.ObjectId, ref: 'Todo'}
});

module.exports = model('User', schema);