import api from "./api";

async function createCheckoutSession(panierId) {
  const { data } = await api.post(
    `/payments/create-checkout-session?panierId=${panierId}`
  );
  return { success: true, data };
}

async function syncCheckoutSession(sessionId) {
  try {
    const response = await api.post(
      `/payments/sync-checkout-session?sessionId=${sessionId}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Erreur lors de la synchronisation",
    };
  }
}

export const paymentService = {
  createCheckoutSession,
  syncCheckoutSession,
};
