import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { KJUR } from "jsrsasign";
import deepmerge from "deepmerge";

import {WyreParams, AuthenticationType} from '../types';

export default async function wyre({
  apiKey,
  secretKey,
  authenticationType: maybeAuthenticationType,
  apiUrl,
  baseUrl = "",
  url: endpoint,
  method = "get",
  data = undefined,
}: WyreParams): Promise<AxiosResponse> {
  if (typeof endpoint !== "string") {
    throw new Error(`Expected String url, encountered ${endpoint}.`);
  }

  const authenticationType =
    maybeAuthenticationType || AuthenticationType.SECRET_KEY_SIGNATURE;

  const url = `${apiUrl}/${endpoint}${
    endpoint.includes("?") ? "&" : "?"
  }timestamp=${new Date().getTime()}000`;

  const baseProps = {
    url: `${baseUrl}${url}`,
    method,
    data,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (authenticationType === AuthenticationType.SECRET_KEY_SIGNATURE) {
    // eslint-disable-next-line
    // @ts-ignore
    const mac = new KJUR.crypto.Mac({ alg: "HmacSHA256", pass: secretKey });
    mac.updateString(url + (data ? JSON.stringify(data) : ""));
    return axios(
      deepmerge(baseProps, {
        headers: {
          "X-Api-Key": apiKey,
          "X-Api-Signature": mac.doFinal(),
        },
      }) as AxiosRequestConfig
    );
  } else if (authenticationType === AuthenticationType.TOKEN_AUTH) {
    return axios(
      deepmerge(baseProps, {
        headers: { Authorization: `Bearer ${secretKey}` },
      }) as AxiosRequestConfig
    );
  }

  throw new Error(
    `Encountered unexpected authenticationType, "${authenticationType}".`
  );
}
