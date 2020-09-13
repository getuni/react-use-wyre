import axios from "axios";
import { KJUR } from "jsrsasign";
import { typeCheck } from "type-check";

export type wyreParams = {
  apiKey: string;
  secretKey: string;
  apiUrl: string;
  baseUrl: string;
  url: string;
  method: string;
  data: any;
};

export default function wyre({
  apiKey,
  secretKey,
  apiUrl,
  baseUrl,
  url: endpoint,
  method = "get",
  data = undefined,
}: wyreParams) {
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
}
