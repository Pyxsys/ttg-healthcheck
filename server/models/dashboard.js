const mongoose = require('mongoose')

const WidgetOptionsSchema = new mongoose.Schema({
  deviceId: String,
  deviceName: String,
})

const DashboardWidgetSchema = new mongoose.Schema({
  widgetType: String,
  options: WidgetOptionsSchema,
})

const DashboardSchema = new mongoose.Schema({
  userId: mongoose.SchemaTypes.ObjectId,
  widgets: [DashboardWidgetSchema],
})

const Dashboards = mongoose.model('dashboards', DashboardSchema)

module.exports = { DashboardSchema, Dashboards }
