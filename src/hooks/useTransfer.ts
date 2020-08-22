import { useCallback } from "react";

import { useWyre } from ".";

export default function useTransfer() {
  const { wyre } = useWyre();
  const getTransfer = useCallback(
    async ({ transferId }) => {
      if (typeof transferId !== "string") {
        return setError(new Error(`Expected String transferId, encountered ${transferId}.`));
      }
      const { data } = await wyre({
        url: `v3/transfers/${transferId}`,
        method: "get",
      });
      return data;
    },
    [wyre],
  );
  return { getTransfer };
}
