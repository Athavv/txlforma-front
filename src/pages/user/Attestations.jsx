import { useEffect, useState } from "react";
import { attestationService } from "../../api/attestation.service";
import { formatDateShort } from "../../utils/formatUtils";
import presenceImg from "../../assets/images/attestation/presence.png";
import successImg from "../../assets/images/attestation/success.png";

export default function Attestations() {
  const [listeAttestations, setListeAttestations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtreActif, setFiltreActif] = useState("TOUS");

  useEffect(() => {
    async function chargerAttestations() {
      const resultat = await attestationService.getMyAttestations();
      if (resultat.success) {
        setListeAttestations(resultat.data);
      }
      setChargement(false);
    }
    chargerAttestations();
  }, []);

  if (chargement) {
    return <p className="p-6">Chargement des attestations...</p>;
  }
  if (listeAttestations.length === 0) {
    return (
      <div className="space-y-8 px-5 sm:px-6 lg:px-0">
        <h1 className="text-2xl md:text-4xl font-semibold text-noir">Mes attestations</h1>
        <p className="text-gray-600">
          Vous n'avez encore aucune attestation disponible.
        </p>
      </div>
    );
  }

  const attestationsFiltrees = listeAttestations.filter((attestation) => {
    if (filtreActif === "TOUS") return true;
    const typeMap = { PRESENCE: "PRESENCE", REUSSITE: "SUCCES" };
    return attestation.type === (typeMap[filtreActif] || filtreActif);
  });

  return (
    <div className="space-y-8 px-5 sm:px-6 lg:px-0">
      <h1 className="text-2xl md:text-4xl font-semibold text-noir">Mes attestations</h1>
      <div className="flex flex-col md:flex-row gap-3">
        <button
          onClick={() => setFiltreActif("TOUS")}
          className={`px-5 py-3 rounded-full w-full md:w-auto ${filtreActif === "TOUS" ? "bg-noir text-white" : "bg-violet/35 hover:bg-noir hover:text-blanc transition-colors" }`}>
          Tous mes attestations
        </button>

        <button onClick={() => setFiltreActif("PRESENCE")} className={`px-5 py-3 rounded-full w-full md:w-auto ${filtreActif === "PRESENCE"
              ? "bg-noir text-white"
              : "bg-violet/35 hover:bg-noir hover:text-blanc transition-colors"}`}>
          Présence
        </button>

        <button onClick={() => setFiltreActif("REUSSITE")} className={`px-5 py-3 rounded-full w-full md:w-auto ${filtreActif === "REUSSITE"
              ? "bg-noir text-white"
              : "bg-violet/35 hover:bg-noir hover:text-blanc transition-colors"}`}>
          Succès
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {attestationsFiltrees.map((attestation) => { 
          const icon =
            attestation.type === "SUCCES" ? successImg : presenceImg;
          return (
            <div key={`${attestation.id}-${attestation.participationId}`} className="bg-white p-5 rounded-2xl flex flex-col">
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-4 items-start">
                  <img src={icon} alt="icone attestation" className="w-16 h-16 object-cover"/>
                  <div>
                    <h2 className="text-[14px] font-medium text-noir">
                      {attestation.type === "SUCCES" ? "Attestation de réussite": "Attestation de présence"}
                    </h2>
                    <p className="text-gray-700 text-[14px]"> Formation : {attestation.formationTitle}</p>
                    <p className="text-gray-600 text-sm">
                      Date :{" "}
                      {formatDateShort(attestation.startDate, attestation.startTime)}
                    </p>
                    {attestation.type === "SUCCES" && attestation.note && (
                      <p className="text-noir text-sm font-semibold mt-1"> Note : {attestation.note}/20</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const result = await attestationService.downloadAttestation(attestation.id);
                    if (!result.success) {
                      alert(result.error || "Erreur lors de l'ouverture");
                    }
                  }} 
                  className="hidden md:block bg-violet text-white px-5 py-2 rounded-full hover:bg-noir transition">
                  Ouvrir
                </button>
              </div>
              <button
                onClick={async () => {
                  const result = await attestationService.downloadAttestation(attestation.id);
                  if (!result.success) {
                    alert(result.error || "Erreur lors de l'ouverture");
                  }
                }}
                className="block md:hidden bg-violet text-white w-full mt-4 py-2 md:py-3 rounded-full hover:bg-noir transition">
                Ouvrir
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
