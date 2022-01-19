const mongoose = require('mongoose')

const DashboardWidgetSchema = new mongoose.Schema({
  widgetType: String,
  options: String,
})

const DashboardSchema = new mongoose.Schema({
  userId: mongoose.SchemaTypes.ObjectId,
  dashboardWidgets: [DashboardWidgetSchema],
})

const Dashboards = mongoose.model('dashboards', DashboardSchema)

module.exports = { DashboardSchema, Dashboards }
