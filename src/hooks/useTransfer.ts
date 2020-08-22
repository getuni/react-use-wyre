import { useCallback } from "react-native";

import { useWyre } from ".";

export default function useTransfer() {
  const { wyre } = useWyre();
  const getTransfer = useEffect(
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
