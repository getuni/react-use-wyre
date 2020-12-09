import { useCallback } from "react";

import useWyre from "./useWyre";

export default function useCreateAccount() {
  const { wyre } = useWyre();
  const createAccount = useCallback(async (
    {
      type,
      country,
      profileFields,
      referrerAccountId,
      subaccount,
      disableEmail,
    },
    extras,
  ) => {
    const { data } = await wyre({
      url: "v3/accounts",
      method: "post",
      data: {
        type,
        country,
        profileFields,
        referrerAccountId,
        subaccount: !!subaccount,
        disableEmail: !!disableEmail,
      },
    }, extras);
    return data;
  }, []);
  return { createAccount };
}