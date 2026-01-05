import { Calendar, Users, MapPin, User } from "lucide-react";

export default function SessionInfoSection({ session, participants }) {
  return (
    <div className="rounded-2xl p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-medium text-noir">Informations générales</h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <Calendar className="h-6 w-6 text-noir mt-1" />
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="text-[18px] font-regular text-noir">
              {new Date(session.startDate).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Users className="h-6 w-6 text-noir mt-1" />
          <div>
            <p className="text-sm text-gray-600">Nombre de participants</p>
            <p className="text-[18px] font-regular text-noir">
              {participants.length}/{session.capacity}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <MapPin className="h-6 w-6 text-noir mt-1" />
          <div>
            <p className="text-sm text-gray-600">Lieux de salle</p>
            <p className="text-[18px] font-regular text-noir">
              {session.location}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <User className="h-6 w-6 text-noir mt-1" />
          <div>
            <p className="text-sm text-gray-600">Formateur</p>
            <p className="text-[18px] font-regular text-noir">
              {session.formateur?.firstname} {session.formateur?.lastname}
            </p>
          </div>
        </div>
        {session.formation?.description && (
          <div className="mt-6">
            <h2 className="text-[24px] mt-8 font-medium">Description de la session</h2>
            <p className="mt-4 font-regular">{session.formation.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}



