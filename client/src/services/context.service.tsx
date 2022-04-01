/* eslint-disable no-unused-vars */
import React, {createContext, useContext} from 'react';

export enum AppServices {
  RealTimeService,
  Authentication,
  ModalService,
}

const contexts = new Map<AppServices, React.Context<any | null>>();

const Contextualizer = {
  createContext<T>(service: AppServices): React.Context<T | null> {
    const context = createContext<T | null>(null);
    contexts.set(service, context);
    return context;
  },

  use<T>(service: AppServices): T {
    const context = contexts.get(service);
    if (!context) {
      throw new Error(`Must create ${AppServices[service]} service before use`);
    }

    const serviceContext = useContext(context);
    if (!serviceContext) {
      throw new Error(
          `Must use ${AppServices[service]} from within its service`,
      );
    }

    return serviceContext;
  },

  clear: () => {
    contexts.clear();
  },
};

export default Contextualizer;
