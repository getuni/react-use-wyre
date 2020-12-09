import { AxiosResponse } from "axios";

export enum AuthenticationType {
  SECRET_KEY_SIGNATURE = "SECRET_KEY_SIGNATURE",
  TOKEN_AUTH = "TOKEN_AUTH",
}

export type WyreParams = {
  readonly apiKey: string;
  readonly secretKey: string;
  readonly authenticationType: AuthenticationType;
  readonly apiUrl: string;
  readonly baseUrl: string;
  readonly url: string;
  readonly method: string;
  readonly data: any;
};

export enum OrderStatus {
  RUNNING_CHECKS,
  PROCESSING,
  FAILED,
  COMPLETE,
}

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
  readonly partnerId: string | null;
};
