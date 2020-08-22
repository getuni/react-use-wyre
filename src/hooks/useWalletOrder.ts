import { useCallback } from "react";

import { useWyre } from ".";

export default function useWalletOrder() {
  const { wyre } = useWyre();

  const getWalletOrder = useCallback(
    async (walletOrderId) => {
      const { data } = await wyre({
        url: `v3/orders/${walletOrderId}`,
        method: "get",
      });
      return data;
    },
    [wyre],
  );

  return { getWalletOrder };
}
