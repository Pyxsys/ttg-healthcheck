const mongoose = require('mongoose')

const PeripheralSchema = new mongoose.Schema({
  hardware_id: String,
  connection: String,
  name: String,
})

module.exports = {
  PeripheralSchema: PeripheralSchema,
}
