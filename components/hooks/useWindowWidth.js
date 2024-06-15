//Convertion of  useWindowWidth hook to ContextAPI.
//By declaring the ContextAPI globally and access the isSmallerDevice property.

import React, { createContext, useState, useEffect } from 'react';

const WindowWidthContext = createContext();

const WindowWidthProvider = ({ children }) => {
  const [isSmallerDevice, setIsSmallerDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallerDevice(width < 500);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <WindowWidthContext.Provider value={{ isSmallerDevice }}>
      {children}
    </WindowWidthContext.Provider>
  );
};

export { WindowWidthContext, WindowWidthProvider };
