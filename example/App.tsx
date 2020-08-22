import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import SendWyre, { useWyre, useDebitCard, useApplePay, useTransfer, useReservation } from 'react-use-wyre';
import Constants from "expo-constants";


function DebitCard({ ...extras }): JSX.Element {
  const { getTransfer } = useTransfer();
  const { makeReservation } = useReservation();
  const { pay } = useDebitCard();
  return (
    <TouchableOpacity
      {...extras}
      onPress={async () => {
        const ref = await makeReservation(
          {
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
          },
        );
        console.log("Debit card reservation is:", ref);
        const { data: result } = await pay(
          {
            ...ref,
            debitCard:{
              number: "4111111111111111",
              month: "01",
              year: "2023",
              cvv: "312",
            },
          },
        );
        console.log(result);
      }}
    />
  );
}

function QuoteTransaction({ amount, sourceCurrency, destCurrency, dest, accountId, country }) {
  const [result, setResult] = useState(null);
  const {wyre} = useWyre();
  useEffect(
    () => (async () => {
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
    [amount, sourceCurrency, destCurrency, dest, accountId, country, setResult],
  );
  return (
    <View>
      {!!result && (
        <Text children={JSON.stringify(result)} />
      )}
    </View>
  );
}


//function ApplePay() {
//  const { makeReservation } = useReservation();
//  const { processApplePay } = useApplePay();
//  const [requestApplePay, completeApplePay] = useApplePay();
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


const { APP_MANIFEST: { extra } } = process.env;
const { WYRE_API_KEY: apiKey, WYRE_SECRET_KEY: secretKey, WYRE_PARTNER_ID: partnerId } = extra;

export default function App() {
  return (
    <SendWyre
      apiKey={apiKey}
      secretKey={secretKey}
      partnerId={partnerId}
      baseUrl="https://cors-anywhere.herokuapp.com/"
    >
      <View style={styles.container}>
        <StatusBar style="auto" />

        <DebitCard>
          <Text>Tap here to make a fake debit card transaction.</Text>
        </DebitCard>

        <QuoteTransaction
          amount="100.00"
          sourceCurrency="USD"
          destCurrency="ETH"
          dest="ethereum:0x0dfd1a00b5e25065e162534a630242d8debdab41"
          accountId="AC_M7JR6JUCDR3"
          country="US"
        />

      </View>
    </SendWyre>
  );
}

//        <ApplePay />


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
