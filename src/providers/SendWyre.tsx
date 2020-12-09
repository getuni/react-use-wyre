import * as React from "react";

import { SendWyreContext } from "../contexts";
import { wyre as makeRequest } from "../requests";
import { AuthenticationType } from "../types";

const { useCallback } = React;

export type SendWyreProps = {
  children: JSX.Element | JSX.Element[];
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
  if (typeof partnerId !== "string") {
    throw new Error(
      `SendWyre: Expected String partnerId, encountered ${partnerId}.`
    );
  } else if (typeof secretKey !== "string") {
    throw new Error(
      `SendWyre: Expected String secretKey, encountered ${secretKey}.`
    );
  }

  if (
    authenticationType === AuthenticationType.SECRET_KEY_SIGNATURE &&
    typeof apiKey !== "string"
  ) {
    throw new Error(`SendWyre: Expected String apiKey, encountered ${apiKey}.`);
  }

  const wyre = useCallback(
    ({ url, method, data }, overrides = {}) => {
      if (!overrides || typeof overrides !== "object") {
        throw new Error(
          `Expected object overrides, encountered ${overrides} (${typeof overrides}).`
        );
      }
      return makeRequest({
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
      });
    },
    [secretKey, apiKey, apiUrl, baseUrl]
  );

  return (
    <SendWyreContext.Provider {...extras} value={{ wyre, partnerId }}>
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
