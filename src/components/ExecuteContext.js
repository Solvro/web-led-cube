import React, { createContext, useContext, useRef } from 'react';

//THIS FILE IS NOT USED - it's to remind me to change how function is executed
const ExecuteContext = createContext();

export const ExecuteProvider = ({ children }) => {
  const executeCodeRef = useRef(null);

  return (
    <ExecuteContext.Provider value={executeCodeRef}>
      {children}
    </ExecuteContext.Provider>
  );
};

export const useExecute = () => {
  return useContext(ExecuteContext);
};