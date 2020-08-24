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

  return { createPaymentMethod };
}
