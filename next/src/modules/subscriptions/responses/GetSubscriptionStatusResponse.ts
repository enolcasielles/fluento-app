export interface GetSubscriptionStatusResponse {
  isActive: boolean;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}
