import PanierItem from "./PanierItem";
import PanierEmpty from "./PanierEmpty";

export default function PanierItemsList({
  sessions,
  formations,
  onRemoveSession,
  removingSessionId,
}) {
  if (sessions.length === 0) {
    return <PanierEmpty />;
  }

  return (
    <div className="space-y-4">
      {sessions.map((panierSession) => {
        const session = panierSession.session;
        const formation = formations[session.formationId];

        return (
          <PanierItem
            key={panierSession.id}
            panierSession={panierSession}
            formation={formation}
            onRemove={onRemoveSession}
            isRemoving={removingSessionId === panierSession.sessionId}
          />
        );
      })}
    </div>
  );
}
