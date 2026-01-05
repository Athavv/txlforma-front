export default function SessionDetailSidebar({
  activeSection,
  setActiveSection,
}) {
  const sections = [
    {
      id: "info",
      label: "Informations générales",
      bgColor: "bg-vert",
      bgColorInactive: "bg-vert",
    },
    {
      id: "participants",
      label: "Les participants",
      bgColor: "bg-violet",
      bgColorInactive: "bg-violet",
    },
    {
      id: "emargements",
      label: "Émargements",
      bgColor: "bg-orange",
      bgColorInactive: "bg-orange",
    },
    {
      id: "notes",
      label: "Notes",
      bgColor: "bg-beige2",
      bgColorInactive: "bg-beige2",
    },
    {
      id: "attestations",
      label: "Attestation",
      bgColor: "bg-beige3",
      bgColorInactive: "bg-beige3",
    },
  ];

  return (
    <div className="pl-6">
      <div className="mb-6">
        <h3 className="text-2xl font-medium text-noir">
          En savoir plus sur la session
        </h3>
        <div className="h-[2px] bg-gray-200 rounded-full mt-4"></div>
      </div>
      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`rounded-2xl cursor-pointer transition-colors overflow-hidden flex flex-col justify-between min-h-[120px] ${
              activeSection === section.id
                ? section.bgColor
                : section.bgColorInactive
            }`}
          >
            <div className="p-4" onClick={() => setActiveSection(section.id)}>
              <span className="font-semibold text-noir">{section.label}</span>
            </div>
            <div className="p-4">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveSection(section.id);
                }}
                className="px-5 py-2 bg-noir text-white rounded-full hover:bg-blanc hover:text-noir transition-colors text-xs font-medium"
              >
                Voir plus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


