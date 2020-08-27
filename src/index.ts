export { SendWyre as default } from "./providers";
export {
  useWyre,
  useDebitCard,
  useApplePay,
  useTransfer,
  useReservation,
  useWalletOrder,
  usePaymentMethod,
} from "./hooks";

export const OrderStatus = Object.freeze({
  RUNNING_CHECKS: "RUNNING_CHECKS",
  PROCESSING: "PROCESSING",
  FAILED: "FAILED",
  COMPLETE: "COMPLETE",
});
