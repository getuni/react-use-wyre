import React, { useState, useCallback } from "react";

import { useWyre } from ".";

export default function useDebitCard() {
  const { wyre } = useWyre();
  const pay = useCallback(
    // TODO: Just accept raw data and validate.
    async ({...data}) => {
      const {
        data: { id: walletOrderId },
      } = await wyre({
        url: "v3/debitcard/process",
        method: "post",
        data,
      });

      const {
        data: { smsNeeded, card2faNeeded },
      } = await wyre({
        url: `v3/debitcard/authorization/${walletOrderId}`,
        method: "get",
      });

      // XXX: What to return?
      return Object.freeze({
        smsNeeded,
        card2faNeeded,
        authorize: async ({ sms, card2fa }) => {
          const { data } = await wyre({
            url: "v3/debitcard/authorize/partner",
            method: "post",
            data: {
              walletOrderId,
              type:
                smsNeeded && card2faNeeded
                  ? "ALL"
                  : smsNeeded
                  ? "SMS"
                  : card2faNeeded
                  ? "CARD2FA"
                  : null,
              ...(!!smsNeeded && { sms }),
              ...(!!card2faNeeded && { card2fa }),
            },
          });
          return data;
        },
      });
    },
    [wyre]
  );
  return { pay };
}
