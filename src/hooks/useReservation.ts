import { useCallback } from "react";

import { useWyre } from ".";

export default function useReservation() {

  const { wyre, partnerId } = useWyre();

  const makeReservation = useCallback(
    async ({...opts}) => {
      const {
        amount,
        sourceCurrency,
        destCurrency,
        dest,
        user: {firstName, lastName, email, street1, city, state, country, postalCode, phone},
      } = opts;
      const {data: quote} = await wyre(
        {
          url: "v3/orders/quote/partner",
          method: "post",
          data: {
            amount,
            sourceCurrency,
            destCurrency,
            dest,
            accountId: partnerId,
            country,
          },
        },
      );
      const {data: reserve} = await wyre(
        {
          url: "v3/orders/reserve",
          method: "post",
          data: {
            amount,
            sourceCurrency,
            destCurrency,
            dest,
            referrerAccountId: partnerId,
            email,
            firstName,
            city,
            phone,
            street1,
            country,
            // TODO: fix this
            redirectUrl: "https://google.com",
            failureRedirectUrl: "https://google.com",
            paymentMethod: "apple-pay",
            state,
            postalCode,
            lastName,
            lockFields: ["amount", "sourceCurrency"],
          },
        },
      );
      // XXX: Return the completed transaction data.
      return Object.freeze({...opts, quote, reserve});
    },
    [wyre, partnerId],
  );

  return { makeReservation };
}
