import { useCallback } from "react";
import { useWyre, useReservation } from ".";

export default function useApplePay() {
  const { wyre, partnerId } = useWyre();
  const processApplePay = useCallback(
    async (
      {
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
      },
      applePayToken,
    ) => {
      const addressLines = [street1, city, state];
      const {data} = await wyre(
        {
          url: "v3/apple-pay/process/partner",
          method: "post",
          data: {
            partnerId,
            payload: {
              paymentObject: {
                billingContact: {
                  addressLines,
                  postalCode,
                  country,
                  countryCode,
                  familyName: lastName,
                  givenName: firstName,
                  locality: city,
                  administrativeArea: state,
                  subAdministrativeArea: "",
                  subLocality: "",
                },
                shippingContact: {
                  addressLines,
                  postalCode,
                  country,
                  countryCode,
                  emailAddress: email,
                  familyName: lastName,
                  givenName: firstName,
                  locality: city,
                  phoneNumber: phone,
                  administrativeArea: state,
                  subAdministrativeArea: "",
                  subLocality: "",
                },
                token: applePayToken,
              },
              orderRequest: {
                //amount,
                amount: sourceAmount,
                sourceCurrency,
                destCurrency,
                dest,
                reservationId: reservation,
                referrerAccountId: partnerId,
                referenceId,
              }
            }
          },
        },
      );
      return data;
    },
    [wyre, partnerId],
  );

  return { processApplePay };
}
