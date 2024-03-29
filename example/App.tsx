import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import SendWyre, {
  AuthenticationType,
  useWyre,
  useDebitCard,
  useApplePay,
  useTransfer,
  useReservation,
  useWalletOrder,
  usePaymentMethod,
  useSecretKey,
  useCreateAccount,
  useFetchWallet,
} from "react-use-wyre";
import { nanoid } from "nanoid/non-secure";
import Constants from "expo-constants";

// XXX: You should use "nanoid", not "nanoid/non-secure"! :)
const generateRandomSecretKey = (): string => {
  return [...Array(35)].map((e) => nanoid().charAt(0)).join("");
};

function CreateUserControlledWallet({ ...extras }) {
  const { wyre } = useWyre();
  const { createSecretKey } = useSecretKey();
  const { createAccount } = useCreateAccount();
  const { fetchWallet } = useFetchWallet();
  useEffect(() => {
    (async () => {
      const secretKey = generateRandomSecretKey();
      const { apiKey } = await createSecretKey({ secretKey });
      console.warn({ apiKey, secretKey });
      const { id: accountId } = await createAccount(
        {
          type: "INDIVIDUAL",
          country: "US",
          profileFields: [],
          referrerAccountId: null,
          subaccount: true,
          disableEmail: true,
        },
        {
          authenticationType: AuthenticationType.TOKEN_AUTH,
          secretKey,
        }
      );

      console.warn({ accountId });

      // XXX: Create a savings wallet under the subaccount.
      const {
        data: { id: savingsWalletId },
      } = await wyre(
        {
          url: `v2/wallets`,
          method: "post",
          data: {
            type: "SAVINGS",
            name: nanoid(),
            //callbackUrl: "https://your.website.io/callback",
            notes: JSON.stringify({}),
          },
        },
        {
          authenticationType: AuthenticationType.TOKEN_AUTH,
          secretKey,
        }
      );
      const dataAsOwner = await fetchWallet(
        {
          walletId: savingsWalletId,
        },
        {
          authenticationType: AuthenticationType.TOKEN_AUTH,
          secretKey,
        }
      );

      console.warn({ dataAsOwner });

      // XXX: Should throw.
      const dataAsPartner = await fetchWallet({
        walletId: savingsWalletId,
      });
    })();
  }, [wyre, createSecretKey, createAccount, fetchWallet]);
  return null;
}

function CreatePaymentMethod({ ...extras }): JSX.Element {
  const { wyre } = useWyre();
  const {
    createPaymentMethod,
    listPaymentMethods,
    attachBlockchain,
  } = usePaymentMethod();
  return (
    <TouchableOpacity
      onPress={async () => {
        //const data = await listPaymentMethods();
        //console.log(data);
        // list payment methods
        //const { id, owner, srn } = await createPaymentMethod({
        //  publicToken: "public-sandbox-0867194d-97cd-4691-8282-c4acff3b9788|MrBN83mDa5cjqZLbK7JwfWPW7oowmzH9DZRKN",
        //});
        //const { blockchains } = await attachBlockchain({
        //  paymentMethodId: id,
        //  blockchains: ["ALL"],
        //  notifyUrl: null,
        //  muteMessages: true,
        //});
        // changes each time...
        // XXX: load it up with ETH...
        // XXX: ETH, BTC.
        // create a transfer
        //const { data } = await wyre({
        //  url: "v3/transfers",
        //  method: "post",
        //  data: {
        //    source: owner,
        //    sourceCurrency: "ETH",
        //    sourceAmount: "0.1",
        //    dest: srn,
        //    destCurrency:"USD",
        //    message: "Payment for DorianNakamoto@sendwyre.com",
        //    autoConfirm: false,
        //  },
        //});
        //console.log(data);
      }}
    >
      <Text children="Withdraw some fake money. (Code must be uncommented!)" />
    </TouchableOpacity>
  );
}

function DebitCard({ ...extras }): JSX.Element {
  const { wyre } = useWyre();
  const { getTransfer } = useTransfer();
  const { getWalletOrder } = useWalletOrder();
  const { makeReservation } = useReservation();
  const { pay } = useDebitCard();
  return (
    <TouchableOpacity
      {...extras}
      onPress={async () => {
        const ref = await makeReservation({
          amount: 1,
          sourceCurrency: "USD",
          destCurrency: "ETH",
          dest: "ethereum:0x9E01E0E60dF079136a7a1d4ed97d709D5Fe3e341",
          countryCode: "US",
          referenceId: `${Math.random()}`,
          user: {
            firstName: "User",
            lastName: "Surname",
            email: "user@sendwyre.com",
            street1: "1550 Bryant Street",
            city: "San Francisco",
            state: "CA",
            country: "US",
            postalCode: "94103",
            phone: "+12126712234",
          },
        });
        console.log("Debit card reservation is:", ref);
        const result = await pay({
          ...ref,
          debitCard: {
            number: "4111111111111111",
            month: "01",
            year: "2023",
            cvv: "312",
          },
        });
        const { walletOrderId } = result;
        const { status } = await getWalletOrder(walletOrderId);
        console.log("The order status is: ", status);
      }}
    />
  );
}

function QuoteTransaction({
  amount,
  sourceCurrency,
  destCurrency,
  dest,
  accountId,
  country,
}) {
  const [result, setResult] = useState(null);
  const { wyre } = useWyre();
  useEffect(
    () =>
      (async () => {
        const { data } = await wyre({
          url: "v3/orders/quote/partner",
          method: "post",
          data: {
            amount,
            sourceCurrency,
            destCurrency,
            dest,
            accountId,
            country,
          },
        });
        setResult(data);
      })() && undefined,
    [amount, sourceCurrency, destCurrency, dest, accountId, country, setResult]
  );
  return <View>{!!result && <Text children={JSON.stringify(result)} />}</View>;
}

//function ApplePay() {
//  const { makeReservation } = useReservation();
//  const { processApplePay } = useApplePay();
//  useEffect(
//    () => (async () => {
//      const ref = await makeReservation(
//        {
//          amount: 1,
//          sourceCurrency: "USD",
//          destCurrency: "ETH",
//          dest: "ethereum:0x9E01E0E60dF079136a7a1d4ed97d709D5Fe3e341",
//          countryCode: "US",
//          referenceId: `${Math.random()}`,
//          user: {
//            firstName: "User",
//            lastName: "Surname",
//            email: "user@sendwyre.com",
//            street1: "1550 Bryant Street",
//            city: "San Francisco",
//            state: "CA",
//            country: "US",
//            postalCode: "94103",
//            phone: "+12126712234",
//          },
//        },
//      );
//
//      const {quote: {sourceAmount: totalCost}} = ref;
//      console.warn('The total cost is:', totalCost);
//      //const {...data} = await processApplePay(ref, YOUR_APPLE_TOKEN_JSON);
//      //console.warn('The placed  wallet order is:', data);
//    })() && undefined,
//    [makeReservation, processApplePay],
//  );
//  return null;
//}

const {
  APP_MANIFEST: { extra },
} = process.env;
const {
  WYRE_API_KEY: apiKey,
  WYRE_SECRET_KEY: secretKey,
  WYRE_PARTNER_ID: partnerId,
} = extra;

export default function App() {
  return (
    <SendWyre
      partnerId={partnerId}
      apiKey={apiKey}
      secretKey={secretKey}
      baseUrl={
        Platform.OS === "web" ? "https://cors-anywhere.herokuapp.com/" : ""
      }
    >
      <View style={styles.container}>
        <StatusBar style="auto" />

        <DebitCard>
          <Text>Tap here to make a fake debit card transaction.</Text>
        </DebitCard>
        <CreateUserControlledWallet />
        <QuoteTransaction
          amount="100.00"
          sourceCurrency="USD"
          destCurrency="ETH"
          dest="ethereum:0x0dfd1a00b5e25065e162534a630242d8debdab41"
          accountId="AC_M7JR6JUCDR3"
          country="US"
        />
        <CreatePaymentMethod />
      </View>
    </SendWyre>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
