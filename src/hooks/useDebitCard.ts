import React, { useState, useCallback } from "react";

import { useWyre } from ".";

export default function useDebitCard() {
  const { wyre, partnerId } = useWyre();
  const pay = useCallback(
    async ({
      /* specified */
      amount,
      sourceCurrency,
      destCurrency,
      dest,
      countryCode,
      referenceId,
      user: {firstName, lastName, email, street1, city, state, country, postalCode, phone},
      /* computed */
      quote: {sourceAmount},
      reserve: {reservation},
      /* additional */
      debitCard,
    }) => {
      const {
        data: { id: walletOrderId },
      } = await wyre({
        url: "v3/debitcard/process",
        method: "post",
        data: {
          sourceCurrency,
          amount,
          destCurrency,
          dest,
          reservationId: reservation,
          accountId: partnerId,
          referrerAccountId: partnerId,
          givenName: firstName,
          familyName: lastName,
          email,
          phone,
          address: {
            street1,
            city,
            state,
            postalCode,
            country,
          },
          debitCard,
        },
      });

      const {
        data: { smsNeeded, card2faNeeded },
      } = await wyre({
        url: `v3/debitcard/authorization/${walletOrderId}`,
        method: "get",
      });

      // XXX: What to return?
      return Object.freeze({
        walletOrderId,
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
    [wyre, partnerId]
  );
  return { pay };
}
