import { useCallback } from "react";

import useWyre from "./useWyre";
import { processApplePay as shouldProcessApplePay } from "../requests";

export default function useApplePay() {
  const { wyre, partnerId } = useWyre();
  const processApplePay = useCallback(
    async (ref, applePayToken) => {
      if (!partnerId) {
        throw new Error(`Expected String partnerId, encountered ${partnerId}.`);
      }
      return shouldProcessApplePay(
        {
          wyre,
          partnerId,
          ref,
          applePayToken,
        },
      );
    },
    [wyre, partnerId],
  );
  return { processApplePay };
}
