import * as React from "react";

import {SendWyreContextValue} from "../types";

export const defaultContext = Object.freeze({
  wyre: () => Promise.reject(new Error(`SendWyre: You must declare a SendWyre <Provider /> at the root of your application.`)),
  partnerId: null,
}) as SendWyreContextValue;

const SendWyreContext = React.createContext<SendWyreContextValue>(
  defaultContext,
);

export default SendWyreContext;
