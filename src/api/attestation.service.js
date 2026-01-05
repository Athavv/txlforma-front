import api from "./api";

async function generateAttestation(participationId) {
  try {
    const { data } = await api.get(`/attestations/generate/${participationId}`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Erreur" };
  }
}

async function downloadAttestation(attestationId) {
  const res = await api.get(`/attestations/download/${attestationId}`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "attestation.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  return { success: true };
}

async function getMyAttestations() {
  const { data } = await api.get("/attestations/me");
  return { success: true, data };
}

async function regenerateAttestation(attestationId) {
  try {
    const { data } = await api.post(
      `/attestations/regenerate/${attestationId}`
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Erreur" };
  }
}

export const attestationService = {
  generateAttestation,
  downloadAttestation,
  getMyAttestations,
  regenerateAttestation,
};
