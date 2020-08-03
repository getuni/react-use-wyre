import React, { useCallback } from "react";
import { typeCheck } from "type-check";
import axios from "axios";
import { KJUR } from "jsrsasign";

import { SendWyreContext } from "../contexts";

export type SendWyreProps = {
  children: JSX.Element;
  apiKey: string;
  secretKey: string;
  apiUrl: string;
  baseUrl: string;
};

const SendWyre = function ({
  apiKey,
  secretKey,
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
  }
  const wyre = useCallback(
    ({ url: endpoint, method = "get", data = undefined }) => {
      if (!typeCheck("String", endpoint)) {
        throw new Error(`Expected String url, encountered ${endpoint}.`);
      }
      const url = `${apiUrl}/${endpoint}${
        endpoint.includes("?") ? "&" : "?"
      }timestamp=${new Date().getTime()}000`;
      /* encryption */
      const mac = new KJUR.crypto.Mac({ alg: "HmacSHA256", pass: secretKey });
      mac.updateString(url + (data ? JSON.stringify(data) : ""));
      /* request */
      return axios({
        url: `${baseUrl}${url}`,
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
          "X-Api-Signature": mac.doFinal(),
        },
        method,
        data,
      });
    },
    [secretKey, apiKey, apiUrl, baseUrl]
  );
  return (
    <SendWyreContext.Provider {...extras} value={{ wyre }}>
      {children}
    </SendWyreContext.Provider>
  );
};

SendWyre.displayName = "SendWyre";

SendWyre.defaultProps = {
  apiKey: null,
  secretKey: null,
  baseUrl: "https://cors-anywhere.herokuapp.com/",
  apiUrl: "https://api.testwyre.com",
};

export default SendWyre;
