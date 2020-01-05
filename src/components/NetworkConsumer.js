/* @flow */
import React from 'react';
import NetworkContext from './NetworkContext';

type TNetworkContext = ?{
  isConnected: boolean,
  metric: String, 
  speed: any
};

export default function NetworkConsumer({ children }: Function) {
  return (
    <NetworkContext.Consumer>
      {(context: TNetworkContext) => {
        if (!context) {
          throw new Error(
            'NetworkConsumer components should be rendered within NetworkProvider. ' +
              'Make sure you are rendering a NetworkProvider at the top of your component hierarchy',
          );
        }
        return children({ isConnected: context.isConnected });
      }}
    </NetworkContext.Consumer>
  );
}
