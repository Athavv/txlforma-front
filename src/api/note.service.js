import api from "./api";

async function getNotesBySession(sessionId) {
  try {
    const { data } = await api.get(`/notes/session/${sessionId}`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Erreur" };
  }
}

async function createNote(participationId, noteValue) {
  try {
    const { data } = await api.post("/notes", {
      participationId,
      note: noteValue,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Erreur" };
  }
}

async function updateNote(noteId, noteValue) {
  try {
    const { data } = await api.put(`/notes/${noteId}`, { note: noteValue });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Erreur" };
  }
}

async function getMyNotes() {
  const { data } = await api.get("/notes/me");
  return { success: true, data };
}

async function getNoteByParticipation(participationId) {
  const { data } = await api.get(`/notes/participation/${participationId}`);
  return { success: true, data };
}

export const noteService = {
  getNotesBySession,
  createNote,
  updateNote,
  getMyNotes,
  getNoteByParticipation,
};
