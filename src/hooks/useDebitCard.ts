import React, { useState, useCallback } from "react";

import { useWyre } from ".";

export default function useDebitCard() {
  const {wyre} = useWyre();
  const pay = useCallback(
    async ({
      cardNumber,
      expiryMonth,
      expiryYear,
      cvc,
      sourceCurrency,
      amount,
      destCurrency,
      dest,
      referrerAccountId, 
      givenName,
      familyName,
      email,
      phone,
      state,
      city,
      postalCode,
      country,
      addressLine1,
    }) => {
      const { data: { id: walletOrderId } } = await wyre({
        url: "v3/debitcard/process",
        method: "post",
        data: {
          debitCard:{
            number: cardNumber,
            month: expiryMonth,
            year: expiryYear,
            cvv: cvc,
          },
          sourceCurrency: sourceCurrency.toUpperCase(),
          amount,
          destCurrency: destCurrency.toUpperCase(),
          dest,
          referrerAccountId,
          givenName,
          familyName,
          email,
          phone,
          address: {
            street1: addressLine1,
            city,
            state,
            postalCode,
            country,
          },
        }, 
      });

      const { data: { smsNeeded, card2faNeeded } } = await wyre(
        { url: `v3/debitcard/authorization/${walletOrderId}`, method: "get" },
      );

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
              type: (smsNeeded && card2faNeeded) ? "ALL" : (smsNeeded ? "SMS" : (card2faNeeded ? "CARD2FA" : null)),
              ...(!!smsNeeded && { sms }),
              ...(!!card2faNeeded && { card2fa }),
            },
          });
          return data;
        },
      });
    },
    [wyre],
  );
  return { pay };
}
