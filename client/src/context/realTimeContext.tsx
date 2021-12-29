import React, {useState} from 'react';
import {DeviceLog} from '../types/queries';
import Contextualizer, {AppServices} from '../services/context.service';

/**
 * Calls the function, when a device log is updated from the database.
 * @param device the updated device
 */
type RealTimeCallback = (device: DeviceLog) => void;

export interface IRealTimeService {
  setDeviceIds(deviceIds: string[]): void;
  getRealTimeData(callbackFn: RealTimeCallback): void;
  enableRealTimeData(): void;
  disableRealTimeData(): void;
}

const RealTimeContext = Contextualizer.createContext<IRealTimeService>(AppServices.RealTimeService);
export const useRealTimeService = () => Contextualizer.use<IRealTimeService>(AppServices.RealTimeService);

const RealTimeService = ({children}: any) => {
  const SERVER_PORT = 5000;
  const [wsClient, setWsClient] = useState(new WebSocket(`ws://localhost:${SERVER_PORT}/?reason=realTime`) as WebSocket | null);

  const realTimeService: IRealTimeService = {
    setDeviceIds: (deviceIds) => {
      if (wsClient && deviceIds.length > 0) {
        if (wsClient.readyState === WebSocket.CONNECTING) {
          wsClient.onopen = () => {
            wsClient.send(`clear-devices?deviceIds=${deviceIds.join(',')}`);
            wsClient.onopen = null;
          };
        } else {
          wsClient.send(`clear-devices?deviceIds=${deviceIds.join(',')}`);
        }
      }
    },

    getRealTimeData: (callbackFn) => {
      if (wsClient && wsClient.readyState === WebSocket.OPEN) {
        wsClient.onmessage = (msg) => {
          const data = msg.data;
          if (!(data as string).startsWith('message')) {
            console.log('sending updates');

            const device: DeviceLog = JSON.parse(data);
            callbackFn(device);
          }
        };
      }
    },

    enableRealTimeData: () => {
      if (!wsClient) {
        setWsClient(new WebSocket(`ws://localhost:${SERVER_PORT}/?reason=realTime`));
      }
    },

    disableRealTimeData: () => {
      if (wsClient) {
        wsClient.close();
        setWsClient(null);
      }
    },
  };

  return (
    <>
      <RealTimeContext.Provider value={realTimeService}>
        {children}
      </RealTimeContext.Provider>
    </>
  );
};

export default RealTimeService;
