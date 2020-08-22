import { useState, useEffect } from "react-native";

import { useWyre } from ".";

export type useTransferArgs = {
  transferId: string;
  timeout: 10000,
};

export default function useTransfer({ transferId, timeout }: useTransferArgs) {
  const { wyre } = useWyre();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState(false);
  useEffect(
    () => {
      const interval = setInterval(
        async () => {
          if (typeof transferId !== "string") {
            return setError(new Error(`Expected String transferId, encountered ${transferId}.`));
          }
          try {
            setLoading(true);
            const { data } = await wyre({
              url: `v3/transfers/${transferId}`,
              method: "get",
            });
            setData(data);
          } catch (e) {
            setError(e);
            setResult(null);
          } finally {
            setLoading(false);
          }
        },
        timeout,
      );
      return () => clearInterval(interval);
    },
    [wyre, setLoading, setError, setResult, timeout, transferId],
  );
  return { loading, error, result };
}
