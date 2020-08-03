import React from "react";

const defaultContext = Object.freeze({});

const SendWyreContext = React.createContext(defaultContext);

SendWyreContext.defaultContext = defaultContext;

export default SendWyreContext;
