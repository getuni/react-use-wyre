import { useCallback } from "react";
import { useWyre } from ".";
import { processApplePay as shouldProcessApplePay } from "../requests";

export default function useApplePay() {
  const { wyre, partnerId } = useWyre();
  const processApplePay = useCallback(
    (ref, applePayToken) => shouldProcessApplePay(
      {
        wyre,
        partnerId,
        ref,
        applePayToken,
      },
    ),
    [wyre, partnerId],
  );
  return { processApplePay };
}
