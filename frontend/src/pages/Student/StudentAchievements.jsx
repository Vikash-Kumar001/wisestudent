import React, { useEffect, useMemo, useState } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchStudentAchievements } from "../../services/studentService";
import { getGameDataById } from "../../utils/getGameData";

const PAGE_SIZE = 20;

const formatPillarLabel = (pillar) =>
  pillar === "Brain Health" ? "Brain & Mental Health" : pillar;

const pillarNameMap = {
  ai: "AI for All",
  brain: "Brain & Mental Health",
  finance: "Financial Literacy",
  financial: "Financial Literacy",
  mental: "Mental Health",
  educational: "Digital Citizenship & Online Safety",
  uvls: "UVLS",
  dcos: "Digital Citizenship & Online Safety",
  moral: "Moral Values",
  "moral-values": "Moral Values",
  ehe: "Entrepreneurship & Higher Education",
  crgc: "Civic Responsibility & Global Citizenship",
  "civic-responsibility": "Civic Responsibility & Global Citizenship",
  "health-male": "Health - Male",
  healthMale: "Health - Male",
  "health-female": "Health - Female",
  healthFemale: "Health - Female",
  sustainability: "Sustainability",
  wellness: "Brain Health",
  personal: "UVLS (Life Skills & Values)",
  education: "Digital Citizenship & Online Safety",
  creativity: "Moral Values",
  entertainment: "AI for All",
  social: "Health - Male",
  competition: "Health - Female",
  rewards: "Entrepreneurship & Higher Education",
  shopping: "Civic Responsibility & Global Citizenship",
};

const normalizeKey = (key) =>
  key ? key.toLowerCase().replace(/[^a-z0-9]/g, "") : "";

const findPillarLabelFromText = (text) => {
  if (!text) return null;
  const normalized = normalizeKey(text);
  for (const key of Object.keys(pillarNameMap)) {
    if (normalized.includes(normalizeKey(key))) {
      return pillarNameMap[key];
    }
  }
  return null;
};

const extractCategoryFromGameId = (gameId) => {
  if (!gameId) return null;
  const parts = gameId.split("-");
  if (parts.length < 2) return null;

  const firstTwo = parts.slice(0, 2).join("-");
  if (pillarNameMap[firstTwo]) {
    return firstTwo;
  }

  return parts[0];
};

const extractPillarFromBadgeImage = (imagePath) => {
  if (!imagePath) return null;
  const segments = imagePath.split("/").filter(Boolean);
  if (segments.length < 2) return null;
  const candidate = segments[1];
  return pillarNameMap[candidate] ? candidate : null;
};

const resolvePillarName = ({
  pillar,
  pillarName,
  gameType,
  gameId,
  badgeImage,
  gameCategory,
}) => {
  if (pillarName) return pillarName;
  if (pillar) return pillar;

  const candidateFromImage = extractPillarFromBadgeImage(badgeImage);
  if (candidateFromImage) {
    return pillarNameMap[candidateFromImage] || candidateFromImage;
  }

  const candidateFromId = extractCategoryFromGameId(gameId);
  if (candidateFromId) {
    return pillarNameMap[candidateFromId] || candidateFromId;
  }

  if (gameType) {
    return pillarNameMap[gameType] || gameType;
  }

  const fallbackFromCategory = findPillarLabelFromText(gameCategory);
  if (fallbackFromCategory) return fallbackFromCategory;

  const fallbackFromBadgeImage = findPillarLabelFromText(badgeImage);
  if (fallbackFromBadgeImage) return fallbackFromBadgeImage;

  return "General";
};

const getAgeGroupFromGameId = (gameId = "") => {
  if (!gameId || typeof gameId !== "string") return null;
  if (gameId.includes("kids")) return "Kids";
  if (gameId.includes("teen")) return "Teen";
  if (gameId.includes("young-adult")) return "Young Adult";
  if (gameId.includes("adult")) return "Adult";
  return null;
};

const formatModuleLabel = (group) => {
  if (!group) return null;
  const normalized = group.toLowerCase();
  if (normalized.includes("kids")) return "Kids";
  if (normalized.includes("teen")) return "Teen";
  if (normalized.includes("young")) return "Young Adult";
  if (normalized.includes("adult")) return "Adult";
  return group;
};

const extractModuleFromBadgePath = (badgeImage) => {
  if (!badgeImage || typeof badgeImage !== "string") return null;
  const parts = badgeImage.split("/").filter(Boolean);
  if (parts.length < 3) return null;
  const tierSegment = parts[2];
  if (tierSegment?.includes("kids")) return "Kids";
  if (tierSegment?.includes("teens") || tierSegment?.includes("teen")) return "Teen";
  if (tierSegment?.includes("young-adult")) return "Young Adult";
  if (tierSegment?.includes("adults") || tierSegment?.includes("adult")) return "Adult";
  return null;
};

const StudentAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    if (selectedBadge) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedBadge]);

  useEffect(() => {
    let isActive = true;

    const loadAchievements = async () => {
      setLoading(true);
      try {
        const response = await fetchStudentAchievements();
        const list = Array.isArray(response)
          ? response
          : response?.achievements || [];
        const normalized = list.map((raw) => {
          const gameData = getGameDataById(raw.gameId);
          const badgeImage =
            raw.badgeImage ||
            raw.image ||
            raw.icon ||
            gameData?.badgeImage ||
            null;
          const badgeName =
            raw.badgeName ||
            raw.title ||
            raw.name ||
            gameData?.badgeName ||
            "Badge Earned";

          const dedupAgeGroup =
            raw.ageGroup ||
            raw.age_group ||
            getAgeGroupFromGameId(raw.gameId || raw.gameIdKey) ||
            extractModuleFromBadgePath(badgeImage);
          const moduleName = formatModuleLabel(
            dedupAgeGroup || raw.module || raw.level
          );
          return {
            id:
              raw.id ||
              `${badgeName}-${raw.earnedAt || raw.date || raw.createdAt || Date.now()}`,
            badgeName,
            badgeImage,
            pillarName: resolvePillarName({
              pillar: raw.pillar,
              pillarName: raw.pillarName,
              gameType: raw.gameType || gameData?.type,
              gameId: raw.gameId || raw.gameIdKey,
              badgeImage,
              gameCategory: raw.category || gameData?.category,
              ageGroup: dedupAgeGroup,
            }),
            moduleName,
            earnedAt: raw.earnedAt || raw.date || raw.createdAt,
            unlocked: raw.unlocked ?? true
          };
        });

        if (isActive) {
          setAchievements(normalized);
          setError(null);
          setPage(1);
        }
      } catch (err) {
        if (isActive) {
          setError("Unable to load achievements right now.");
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadAchievements();
    return () => {
      isActive = false;
    };
  }, []);

  const unlockedAchievements = useMemo(
    () => achievements.filter((achievement) => achievement.unlocked),
    [achievements]
  );

  const pageCount = Math.max(
    1,
    Math.ceil(unlockedAchievements.length / PAGE_SIZE)
  );

  const paginatedAchievements = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return unlockedAchievements.slice(start, start + PAGE_SIZE);
  }, [unlockedAchievements, page]);

  const handlePrev = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(pageCount, prev + 1));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-[85rem] space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-transparent rounded-3xl shadow-none p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BadgeCheck className="w-7 h-7 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Celebrating milestones
                </p>
                <h1 className="text-3xl font-black text-slate-900">
                  All Achievements
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>
                Page {page} of {pageCount}
              </span>
              <button
                onClick={handlePrev}
                disabled={page <= 1 || loading}
                className="disabled:opacity-40 rounded-full p-1 hover:bg-slate-100 transition"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={page >= pageCount || loading}
                className="disabled:opacity-40 rounded-full p-1 hover:bg-slate-100 transition"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="text-sm text-slate-500">
            Showing {paginatedAchievements.length} of{" "}
            {unlockedAchievements.length} badges
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {loading
              ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <div
                    key={`placeholder-${index}`}
                    className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-white/60 p-5 space-y-3 animate-pulse"
                  >
                    <div className="h-16 w-16 rounded-2xl bg-slate-200"></div>
                    <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                ))
              : paginatedAchievements.length > 0
            ? paginatedAchievements.map((achievement) => (
                  <div
                    key={achievement.id || achievement.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 cursor-pointer"
                    onClick={() => setSelectedBadge(achievement)}
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-inner">
                        {achievement.badgeImage ? (
                          <img
                            src={achievement.badgeImage}
                            alt={achievement.badgeName || "Badge"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <BadgeCheck className="h-full w-full text-slate-300" />
                        )}
                      </div>
                      <p className="text-lg font-semibold text-slate-900">
                        {achievement.badgeName || achievement.title || "Badge Earned"}
                      </p>
                      <div className="space-y-0.5 text-center">
                        <p className="text-xs font-semibold text-slate-500">
                          {formatPillarLabel(
                            achievement.pillarName || achievement.pillar || "General"
                          )}
                        </p>
                        {achievement.moduleName && (
                          <p className="text-xs text-slate-400">{achievement.moduleName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              : !loading && (
                <div className="col-span-full text-center text-sm text-slate-500">
                  No badges unlocked yet. Start playing to earn your first badge!
                </div>
              )}
          </div>
          {selectedBadge && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={() => setSelectedBadge(null)}
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition"
              >
                ×
              </button>
              <div
                onClick={(event) => event.stopPropagation()}
                className="relative h-full w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden"
              >
                {selectedBadge.badgeImage ? (
                  <img
                    src={selectedBadge.badgeImage}
                    alt={selectedBadge.badgeName}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <BadgeCheck className="h-full w-full text-white" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAchievements;
