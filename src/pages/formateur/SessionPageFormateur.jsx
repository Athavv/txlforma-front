import { useState, useEffect } from "react";
import { sessionService } from "../../api/session.service";
import SessionsInProgress from "../../components/formateur/session/SessionsInProgress";
import SessionsUpcoming from "../../components/formateur/session/SessionsUpcoming";
import SessionsPast from "../../components/formateur/session/SessionsPast";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function SessionsPageFormateur() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inProgressIndex, setInProgressIndex] = useState(0);
  const [upcomingIndex, setUpcomingIndex] = useState(0);

  const IN_PROGRESS_PER_PAGE = 1;
  const UPCOMING_PER_PAGE = 2;

  const [pastVisibleCount, setPastVisibleCount] = useState(5);

  useEffect(() => {
    loadSessions();
  }, []);

  const normalizeDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
  };

  const getSessionStatus = (session) => {
    const today = normalizeDate(new Date());
    const start = normalizeDate(session.startDate);
    const end = normalizeDate(session.endDate);

    if (today < start) return "a_venir";
    if (today <= end) return "en_cours";
    return "passee";
  };

  const loadSessions = async () => {
    try {
      const result = await sessionService.getMySessions();

      if (result.success) {
        setSessions(
          result.data.map((s) => ({
            ...s,
            status: getSessionStatus(s),
          }))
        );
      } else {
        setError(result.error || "Erreur lors du chargement");
      }
    } catch {
      setError("Impossible de charger les sessions");
    } finally {
      setLoading(false);
    }
  };

  const sessionsInProgress = sessions.filter(session => session.status === "en_cours");

  const sessionsUpcoming = sessions
  .filter(session => session.status === "a_venir")
  .sort(
    (sessionA, sessionB) => new Date(sessionA.startDate) - new Date(sessionB.startDate)
  );

  const sessionsPast = sessions
  .filter(session => session.status === "passee")
  .sort(
    (sessionA, sessionB) => new Date(sessionB.endDate) - new Date(sessionA.endDate)
  );

  const visiblePastSessions = sessionsPast.slice(0, pastVisibleCount);

  const paginate = (items, index, perPage) =>
    items.slice(index, index + perPage);

  const goNext = (index, setIndex, perPage, total) => {
    if (index + perPage < total) setIndex(index + perPage);
  };

  const goPrev = (index, setIndex, perPage) => {
    if (index > 0) setIndex(index - perPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 px-5 sm:px-6 lg:px-0">

      <h1 className="text-2xl md:text-4xl font-semibold text-noir">Mes Sessions</h1>

    <div>
        <div className="flex items-center mb-3 mt-2">
          <h2 className="text-xl font-medium text-noir">
            Sessions en cours ({sessionsInProgress.length})
          </h2>

        {sessionsInProgress.length > 1 && (
          <div className="ml-auto flex items-center gap-3">
          <button 
            onClick={() => goPrev(inProgressIndex, setInProgressIndex, IN_PROGRESS_PER_PAGE)}
            disabled={inProgressIndex === 0}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition
            hover:bg-[#FF4F01]
            disabled:opacity-40
            disabled:cursor-not-allowed">
            <ArrowLeft className="w-7 h-7 text-noir" />
          </button>
    
          <button 
            onClick={() =>
              goNext(
                inProgressIndex,
                setInProgressIndex,
                IN_PROGRESS_PER_PAGE,
                sessionsInProgress.length
              )
            }
            disabled={inProgressIndex + IN_PROGRESS_PER_PAGE >= sessionsInProgress.length}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition 
            hover:bg-[#FF4F01]
            disabled:opacity-40
            disabled:cursor-not-allowed">
            <ArrowRight className="w-7 h-7 text-noir" />
          </button>
          </div> 
        )}
        </div>
        
        <SessionsInProgress
          sessions={paginate(
            sessionsInProgress,
            inProgressIndex,
            IN_PROGRESS_PER_PAGE
          )}
        />
    </div>
        
      <div>
        <div className="flex items-center mb-3 mt-2">
          <h2 className="text-xl font-medium text-noir">
            Sessions à venir ({sessionsUpcoming.length})
          </h2>

        {sessionsUpcoming.length > 2 && (
          <div className="ml-auto flex gap-3">
          <button 
            onClick={() => goPrev(upcomingIndex, setUpcomingIndex, UPCOMING_PER_PAGE)}
            disabled={upcomingIndex === 0}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition
            hover:bg-[#FF4F01]
            disabled:opacity-40
            disabled:cursor-not-allowed">
            <ArrowLeft className="w-7 h-7 text-noir" />
          </button>
    
          <button 
            onClick={() =>
              goNext(
                upcomingIndex,
                setUpcomingIndex,
                UPCOMING_PER_PAGE,
                sessionsUpcoming.length
              )
            }
            disabled={upcomingIndex + UPCOMING_PER_PAGE >= sessionsUpcoming.length}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition
            hover:bg-[#FF4F01]
            disabled:opacity-40
            disabled:cursor-not-allowed">
            <ArrowRight className="w-7 h-7 text-noir" />
          </button>
          </div>
        )}
        </div>

        <SessionsUpcoming
          sessions={paginate(
            sessionsUpcoming,
            upcomingIndex,
            UPCOMING_PER_PAGE
          )}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 mt-2">
        <h2 className="text-xl font-medium text-noir">
          Sessions passées ({sessionsPast.length})
        </h2>

        {pastVisibleCount < sessionsPast.length && (
          <button
            onClick={() => setPastVisibleCount((prev) => prev + 5)}
            className="text-sm underline hover:text-[#FF4F01]"
          >
            Voir plus
          </button>
        )}

        {pastVisibleCount > 5 && (
          <button
            onClick={() => setPastVisibleCount(5)}
            className="text-sm underline hover:text-[#FF4F01] ml-4"
          >
            Voir moins
          </button>
        )}

        </div>
        <SessionsPast sessions={visiblePastSessions} />
      </div>
    </div>
  );
}