import * as React from "react";
import { AxiosResponse } from "axios";

export type AnyObject = {
  readonly [key: string]: unknown;
};

export type WyreRequest = {
  readonly url: string;
  readonly method: string;
  readonly data?: AnyObject;
  readonly headers?: AnyObject;
};

export type WyreInstance = (config: WyreRequest, overrides?: AnyObject) => Promise<AxiosResponse>;

export type SendWyreContextValue = {
  readonly wyre: WyreInstance;
  readonly partnerId: string;
};

export const defaultContext = Object.freeze({
  wyre: () => Promise.reject(new Error(`SendWyre: You must declare a SendWyre <Provider /> at the root of your application.`)),
  partnerId: null,
});

const SendWyreContext = React.createContext<SendWyreContextValue>(
  // @ts-ignore
  defaultContext as SendWyreContextValue
);

export default SendWyreContext;
