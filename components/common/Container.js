import React, { useContext } from 'react';
import { WindowWidthProvider } from '../hooks/useWindowWidth';

export default function Container({ children }) {
  const isSmallerDevice = useContext(WindowWidthProvider); //used smallerdevice property
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
      }}
    >
      <div style={{ width: isSmallerDevice ? '95%' : '85%' }}>{children}</div>
    </div>
  );
}
