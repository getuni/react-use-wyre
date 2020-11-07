import React from "react";
import { AxiosResponse } from "axios";

export type WyreRequest = {
  readonly [key: string]: unknown;
};

export type WyreInstance = (config: WyreRequest, overrides?: WyreRequest) => Promise<AxiosResponse>;

export type SendWyreContextValue = {
  readonly wyre: WyreInstance;
  readonly partnerId: string;
};

export const defaultContext = Object.freeze({
  wyre: () => Promise.reject(new Error(`SendWyre: You must declare a SendWyre <Provider /> at the root of your application.`)),
  partnerId: null,
});

const SendWyreContext = React.createContext<SendWyreContextValue>(
  // XXX: Note that the actual provider will fail on this if partnerId hasn't been defined.
  // @ts-ignore
  defaultContext as SendWyreContextValue
);

export default SendWyreContext;
