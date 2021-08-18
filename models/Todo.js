const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  idGenerator: Number,
  todoTitles: Schema.Types.Mixed,
  todoContent: Schema.Types.Mixed,
  lastUpdate: Number,
  owner: { type: Types.ObjectId, ref: 'User' },
})

module.exports = model('Todo', schema)
