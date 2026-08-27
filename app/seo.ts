export const SITE_URL = "https://ahmedsalman.pages.dev";

export const seoProfile = {
  name: "Ahmed Salman",
  primaryHandle: "ahmedsalman74",
  alternateHandles: ["ahmedsalman72", "Ahmed Salman 74"],
  title: "Ahmed Salman | Senior Backend Developer, Gamer & Streamer",
  role: "Senior Backend Developer",
  description:
    "Ahmed Salman, also known as ahmedsalman74 and ahmedsalman72, is a senior backend developer, passionate gamer, and game streamer exploring new games, developer tools, and emerging technologies.",
  shortDescription:
    "Senior backend developer, passionate gamer, and game streamer exploring new games and new technologies.",
  keywords: [
    "Ahmed Salman",
    "Ahmed Salman 74",
    "ahmedsalman74",
    "ahmedsalman72",
    "senior backend developer",
    "backend software engineer",
    "Node.js developer",
    "TypeScript developer",
    "microservices engineer",
    "cloud backend developer",
    "passionate gamer",
    "game streamer",
    "new games",
    "new technologies",
  ],
  knowsAbout: [
    "Backend Engineering",
    "Node.js",
    "TypeScript",
    "Nest.js",
    "Microservices",
    "Distributed Systems",
    "Cloud Architecture",
    "Game Streaming",
    "Gaming",
    "New Technologies",
  ],
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
