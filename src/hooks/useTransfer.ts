import { useCallback } from "react";

import useWyre from "./useWyre";

export default function useTransfer() {
  const { wyre } = useWyre();
  const getTransfer = useCallback(
    async ({ transferId }) => {
      if (typeof transferId !== "string") {
        throw new Error(`Expected String transferId, encountered ${transferId}.`);
      }
      const { data } = await wyre({
        url: `v3/transfers/${transferId}/track`,
        method: "get",
      });
      return data;
    },
    [wyre],
  );
  return { getTransfer };
}
