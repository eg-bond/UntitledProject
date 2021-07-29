const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  idGenerator: Number,
  todoTitles: Schema.Types.Mixed,
  todoContent: Schema.Types.Mixed,
  currentTodoId: String,
  selectedContentItem: Number,
  owner: { type: Types.ObjectId, ref: 'User' },
})
// const schema = new Schema({
//     idGenerator: Number,
//     todoListArr: [],
//     todoContentObj: Schema.Types.Mixed,
//     owner: {type: Types.ObjectId, ref: 'User'}
// });

module.exports = model('Todo', schema)
