import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import SendWyre, { useDebitCard } from 'react-use-wyre';
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
