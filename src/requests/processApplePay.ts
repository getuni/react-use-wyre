import type { WyreInstance } from "../contexts";

export type processApplePayArgs = {
  readonly wyre: WyreInstance;
  readonly partnerId: string;
  readonly ref: {
    readonly amount: string;
    readonly sourceCurrency: string;
    readonly destCurrency: string;
    readonly dest: string;
    readonly countryCode: string;
    readonly referenceId: string;
    readonly user: {
      readonly firstName: string;
      readonly lastName: string;
      readonly email: string;
      readonly street1: string;
      readonly city: string;
      readonly state: string;
      readonly country: string;
      readonly postalCode: string;
      readonly phone: string;
    },
    readonly quote: { readonly sourceAmount: string };
    readonly reserve: { readonly reservation: string };
  },
  readonly applePayToken: unknown;
};

export default async function processApplePay({
  wyre,
  partnerId,
  ref,
  applePayToken,
}: processApplePayArgs) {
  const {
    /* specified */
    sourceCurrency,
    destCurrency,
    dest,
    countryCode,
    referenceId,
    user: {
      firstName,
      lastName,
      email,
      street1,
      city,
      state,
      country,
      postalCode,
      phone,
    },
    /* computed */
    quote: { sourceAmount },
    reserve: { reservation },
  } = ref;
  const addressLines = [street1, city, state];
  const { data } = await wyre(
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
}
