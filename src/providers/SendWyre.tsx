import React, { useCallback } from "react";
import { typeCheck } from "type-check";

import { SendWyreContext } from "../contexts";
import { wyre as makeRequest } from "../requests";

export type SendWyreProps = {
  children: JSX.Element;
  apiKey: string;
  secretKey: string;
  apiUrl: string;
  baseUrl: string;
  partnerId: string;
};

const SendWyre = function ({
  apiKey,
  secretKey,
  partnerId,
  apiUrl,
  baseUrl,
  children,
  ...extras
}: SendWyreProps): JSX.Element {
  if (!typeCheck("String", apiKey)) {
    throw new Error(`SendWyre: Expected String apiKey, encountered ${apiKey}.`);
  } else if (!typeCheck("String", secretKey)) {
    throw new Error(
      `SendWyre: Expected String secretKey, encountered ${secretKey}.`
    );
  } else if (!typeCheck("String", partnerId)) {
    throw new Error(
      `SendWyre: Expected String partnerId, encountered ${partnerId}.`
    );
  }
  const wyre = useCallback(
    ({ url, method, data }) => makeRequest(
      {
        apiKey,
        secretKey,
        apiUrl,
        baseUrl,
        url,
        method,
        data,
      },
    ),
    [secretKey, apiKey, apiUrl, baseUrl]
  );
  return (
    <SendWyreContext.Provider
      {...extras}
      value={{ wyre, partnerId }}
    >
      {children}
    </SendWyreContext.Provider>
  );
};

SendWyre.displayName = "SendWyre";

SendWyre.defaultProps = {
  apiKey: null,
  secretKey: null,
  partnerId: null,
  baseUrl: "",
  apiUrl: "https://api.testwyre.com",
};

export default SendWyre;
