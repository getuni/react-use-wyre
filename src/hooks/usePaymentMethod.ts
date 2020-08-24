import { useCallback } from "react";

import { useWyre } from ".";

export default function usePaymentMethod() {

  const { wyre } = useWyre();
  
  const createPaymentMethod = useCallback(
    async ({ publicToken, country, paymentMethodType }) => {
      const { data } = await wyre({
        url: "v2/paymentMethods",
        method: "post",
        data: {
          publicToken,
          country: country || "US",
          paymentMethodType: paymentMethodType || "LOCAL_TRANSFER",
        },
      });
      return data;
    },
    [wyre],
  );

  const listPaymentMethods = useCallback(
    async () => {
      const { data } = await wyre({
        url: "v2/paymentMethods",
        method: "get",
      });
      return data;
    },
    [wyre],
  );

  const attachBlockchain = useCallback(
    async ({ paymentMethodId, blockchains, notifyUrl, muteMessages }) => {
      const { data } = await wyre({
        url: `v2/paymentMethod/${paymentMethodId}/attach`,
        method: "post",
        data: {
          blockchain: [...blockchains].join(","),
          notifyUrl,
          muteMessages,
        },
      });
      return data;
    },
    [wyre],
  );

  return {
    createPaymentMethod,
    listPaymentMethods,
    attachBlockchain,
  };
}
