import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { KJUR } from "jsrsasign";
// @ts-ignore
import deepmerge from "deepmerge";

export enum AuthenticationType {
  SECRET_KEY_SIGNATURE,
  TOKEN_AUTH,
};

export type wyreParams = {
  readonly apiKey: string;
  readonly secretKey: string;
  readonly authenticationType: AuthenticationType;
  readonly apiUrl: string;
  readonly baseUrl: string;
  readonly url: string;
  readonly method: string;
  readonly data: any;
};

export default async function wyre({
  apiKey,
  secretKey,
  authenticationType: maybeAuthenticationType,
  apiUrl,
  baseUrl = "",
  url: endpoint,
  method = "get",
  data = undefined,
}: wyreParams): Promise<AxiosResponse> {
  if (typeof endpoint !== "string") {
    throw new Error(`Expected String url, encountered ${endpoint}.`);
  }

  const authenticationType = maybeAuthenticationType || AuthenticationType.SECRET_KEY_SIGNATURE;

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
    const mac = new KJUR.crypto.Mac({ alg: "HmacSHA256", pass: secretKey });
    mac.updateString(url + (data ? JSON.stringify(data) : ""));
    return axios(deepmerge(baseProps, {
      headers: {
        "X-Api-Key": apiKey,
        "X-Api-Signature": mac.doFinal(),
      },
    }) as AxiosRequestConfig);
  } else if (authenticationType === AuthenticationType.TOKEN_AUTH) {
    return axios(deepmerge(baseProps, {
      headers: { "Authorization": `Bearer ${secretKey}` },
    }) as AxiosRequestConfig);
  }

  throw new Error(`Encountered unexpected authenticationType, "${authenticationType}".`);
}
