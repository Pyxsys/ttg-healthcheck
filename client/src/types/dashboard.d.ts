import {IQuery} from './queries';

export interface DashboardWidget {
  widgetType: string
  options: WidgetOptions
}
export interface WidgetOptions {
  deviceName: string
  deviceId: string
}
export interface Dashboard {
  userId: string
  widgets: DashboardWidget[]
}

export interface IDashboardQuery extends IQuery {
  userId: string
  'widgets.widgetType'?: string
  'widgets.options'?: WidgetOptions
}
