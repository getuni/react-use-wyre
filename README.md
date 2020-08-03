# react-use-wyre
React.js hooks for making payments using SendWyre. https://docs.sendwyre.com

## Features
  - Buy and sell fiat and crypto currency in both [**React**](https://reactjs.org/) and [**React Native**](https://reactnative.dev/)
  - Exports an [`axios`](https://github.com/axios/axios)-inspired `useWyre` hook to aid rapid prototyping against the [**SendWyre API**](https://docs.sendwyre.com/).
  - Provides a high-level [`useDebitCard`](./src/hooks/useDebitCard.ts) hook to rapidly introduce debit card payments.
  - Permits a `baseUrl` prop which does not conflict with request signing.
    - _This can be used as a [workaround](https://cors-anywhere.herokuapp.com/) to [**CORS**](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) issues on the Web._

## Getting Started

Before starting, please make sure that you've [**collected an API key**](https://www.testwyre.com/) against the environment you wish to target.

> **Note:** Both the test environment and production environment require a different set of credentials!

#### Installing

Using [**yarn**](https://yarnpkg.com):

```bash
yarn add react-use-wyre
```

Using [**npm**](https://npmjs.com):

```bash
npm install --save react-use-wyre
```

#### Declaring `SendWyre`

The default export of the library is the [`SendWyre`](./src/providers/SendWyre.tsx) top-level [**Provider**](https://reactjs.org/docs/context.html), which is used to configure your API credentials and operating environment:

```javascript
import React from "react";
import SendWyre from "react-use-wyre";

export default function App({...extras}) {
  return (
    <SendWyre
      apiKey={apiKey}
      secretKey={secretKey}
      baseUrl="https://cors-anywhere.herokuapp.com/"
    >
      {/* your app here */}
      <React.Fragment {...extras} />
    </SendWyre>
  );
}
```

By default, the `SendWyre` Provider is configured to use the test API, [**TestWyre**](https://www.testwyre.com/). You must manually specify the `apiUrl` prop if you want to hit the [**Production API**](https://www.sendwyre.com/).

#### Using the `useWyre` Hook

The exported [`useWyre`](./src/hooks/useWyre.ts) hook aids the rapid prototyping of new API calls against SendWyre. All supported client requests are defined in the [**API Specification**](https://docs.sendwyre.com). The interface for this call mimics that of [`axios`](https://github.com/axios/axios).

Below, we show an example of how to hit the [**Exchange Rates**](https://docs.sendwyre.com/docs/live-exchange-rates) API:

```javascript
import { useWyre } from "react-native-wyre";

const { wyre } = useWyre();

const {data} = await(
  {
    url: "v3/rates",
    method: "get",
  },
);
```

## License
[**MIT**](./LICENSE)
