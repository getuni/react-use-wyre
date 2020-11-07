import React, { useCallback } from "react";
import { typeCheck } from "type-check";

import { SendWyreContext } from "../contexts";
import { wyre as makeRequest, AuthenticationType } from "../requests";

export type SendWyreProps = {
  children: JSX.Element;
  apiKey: string;
  secretKey: string;
  authenticationType: AuthenticationType;
  apiUrl: string;
  baseUrl: string;
  partnerId: string;
};

const SendWyre = function ({
  apiKey,
  secretKey,
  authenticationType,
  partnerId,
  apiUrl,
  baseUrl,
  children,
  ...extras
}: SendWyreProps): JSX.Element {
  if (!typeCheck("String", partnerId)) {
    throw new Error(
      `SendWyre: Expected String partnerId, encountered ${partnerId}.`
    );
  } else if (!typeCheck("String", secretKey)) {
    throw new Error(
      `SendWyre: Expected String secretKey, encountered ${secretKey}.`,
    );
    console.log("Only an apiKey has been defined; using Bearer auth.");
  }

  if (
    authenticationType === AuthenticationType.SECRET_KEY_SIGNATURE
    && !typeCheck("String", apiKey)
  ) {
    throw new Error(`SendWyre: Expected String apiKey, encountered ${apiKey}.`);
  }
   
  const wyre = useCallback(
    ({ url, method, data }, overrides = {}) => makeRequest(
      {
        apiKey,
        secretKey,
        authenticationType,
        apiUrl,
        baseUrl,
        url,
        method,
        data,
        // XXX: The caller can define override properties for the request signature.
        //      e.g. you could perform a different kind of authenticationType.
        ...overrides,
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
  authenticationType: AuthenticationType.SECRET_KEY_SIGNATURE,
  partnerId: null,
  baseUrl: "",
  apiUrl: "https://api.testwyre.com",
};

export default SendWyre;
