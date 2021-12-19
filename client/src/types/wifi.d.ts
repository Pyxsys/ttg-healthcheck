
export interface WifiStatic {
  adapterName: string
  SSID: string
  connectionType: string
  ipv4Address: string
  ipv6Address: string
}

export interface WifiDynamic {
  sendSpeed: number
  receiveSpeed: number
  signalStrength: string
}
