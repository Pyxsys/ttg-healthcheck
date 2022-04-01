import {IQuery} from './queries';

export interface IDashboardWidget {
  widgetType: string
  options: IWidgetOptions
}
export interface IWidgetOptions {
  deviceName: string
  deviceId: string
}
export interface IDashboard {
  userId: string
  widgets: IDashboardWidget[]
}

export interface IDashboardQuery extends IQuery {
  userId: string
  'widgets.widgetType'?: string
  'widgets.options'?: IWidgetOptions
}
