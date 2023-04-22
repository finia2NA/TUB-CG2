import React, { createContext, useState } from 'react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [gatherMode, setGatherMode] = useState("knn");
  const [gatherArgument, setGatherArgument] = useState(10);

  return (
    <AppContext.Provider value={{ gatherMode, setGatherMode, gatherArgument, setGatherArgument }}>
      {props.children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;