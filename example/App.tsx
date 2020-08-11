import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import SendWyre, { useWyre, useDebitCard } from 'react-use-wyre';
import Constants from "expo-constants";

const { APP_MANIFEST: { extra } } = process.env;
const { WYRE_API_KEY: apiKey, WYRE_SECRET_KEY: secretKey } = extra;

function DebitCard({ ...extras }): JSX.Element {
  const { pay } = useDebitCard();
  return (
    <TouchableOpacity
      {...extras}
      onPress={() => pay({
        debitCard:{
          number: "4111111111111111",
          month: "01",
          year: "23",
          cvv: "312",
        },
        sourceCurrency: "USD",
        amount: "1.50",
        destCurrency: "BTC",
        dest: "bitcoin:tb1q6yn0ajs733xsk25vefrhwjey4629qt9c67y6ma",
        referrerAccountId: "AC_C24QF6JJWVA",
        givenName: "Username",
        familyName: "Lastname",
        email: "test.wyre@sendwyre.com",
        phone: "+12126712234", 
        address: {
          street1: "5825 Reseda Blvd",
          city: "US",
          state: "CA",
          postalCode: "94103",
          country: "US",
        }
      })}
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

export default function App() {
  return (
    <SendWyre
      apiKey={apiKey}
      secretKey={secretKey}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});