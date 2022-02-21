export interface IWifiStatic {
  adapterName: string
  SSID: string
  connectionType: string
  ipv4Address: string
  ipv6Address: string
}

export interface IWifiDynamic {
  sendSpeed: number
  receiveSpeed: number
  signalStrength: number
}
