export default function DerniersResultats({ note, session }) {
  const total = 20;
  if (note === null || note === undefined) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center gap-6">
          <p className="text-noir">
            Vous n'avez pas encore de résultat disponible.
          </p>
        </div>
      </div>
    );
  }
  const message =
    note >= 10
      ? `Bravo 🎉 ! Vous avez réussi votre dernière session ${session?.title} avec succès.`
      : `Continuez vos efforts ! Vous progressez sur la session ${session?.title}, ne lâchez rien !`;

  return (
    <div>
      <div className="bg-fond rounded-xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-7">
          <div
            className={
              "w-28 h-28 rounded-full border-[5px] flex items-center justify-center text-xl font-semibold p-2 " +
              (note >= 10 ? "border-vert text-noir" : "border-orange text-noir")} >
            {note}/{total}
          </div>
          <div className="flex-1 w-full text-center space-y-4 md:px-2">
            <div className="p-4 rounded-2xl bg-beige w-full">
              <p className="text-noir text-base px-5">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
