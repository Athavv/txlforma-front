import PanierItemsList from "./PanierItemsList";
import PanierSummary from "./PanierSummary";

export default function PanierContent({
  sessions,
  formations,
  totalPrice,
  removingSessionId,
  redirecting,
  onRemoveSession,
  onProceedToPayment,
}) {
  return (
    <div className="grid grid-cols-12 md:gap-16 gap-0   md:w-full">
      <div className="col-span-12 lg:col-span-7 pr-0 lg:pr-10">
        <p className="text-gray-700 mb-6">
          Quantité de sessions: {sessions.length}
        </p>
        <PanierItemsList
          sessions={sessions}
          formations={formations}
          onRemoveSession={onRemoveSession}
          removingSessionId={removingSessionId}
        />
      </div>
      <div className="col-span-12 lg:col-span-5">
        <PanierSummary
          totalPrice={totalPrice}
          sessionsCount={sessions.length}
          onProceedToPayment={onProceedToPayment}
          redirecting={redirecting}
        />
      </div>
    </div>
  );
}
