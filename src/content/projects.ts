/**
 * Selected projects (spec 006), from Ricardo's previous portfolio
 * (ricardomartinez10.github.io), texts cleaned up. Images live in
 * `public/images/projects/` (copied from `design/`).
 */
export type ProjectCategory =
  "Web" | "Mobile app" | "Interactive installation" | "Java game";

export type ProjectImage = { src: string; alt: string };

export type Project = {
  slug: string;
  title: string;
  /** 1–2 sentences, shown on the card. */
  summary: string;
  /** Full text, shown in the modal. */
  description: string;
  category: ProjectCategory;
  /** e.g. "July 2018". */
  date: string;
  client: string;
  tech: string[];
  /** Card preview. */
  image: ProjectImage;
  /** Modal images; when empty the preview is shown. */
  portraits: ProjectImage[];
  liveUrl?: string;
  repoUrl?: string;
};

const img = (file: string, alt: string): ProjectImage => ({
  src: `/images/projects/${file}`,
  alt,
});

export const projects: Project[] = [
  {
    slug: "jogo",
    title: "Jogo",
    summary:
      "An interactive website with the locations and details of the synthetic soccer fields in Cali.",
    description:
      "Jogo is an interactive website that gathers the location and information of every synthetic soccer field in the city of Cali, so players can find a place to play.",
    category: "Web",
    date: "July 2018",
    client: "Heavy Frames",
    tech: ["React", "CSS", "HTML"],
    image: img("p10.png", "Jogo website preview with a map of soccer fields"),
    portraits: [
      img("p10_portrait.png", "Jogo website showing soccer fields in Cali"),
    ],
    liveUrl: "https://ricardomartinez10.github.io/jogo/",
  },
  {
    slug: "lime-delivery",
    title: "Lime Delivery",
    summary:
      "A mobile app for a virtual liquor store in Cali, for both customers and stores.",
    description:
      "Development of a virtual liquor store app for the city of Cali, with experiences for both customers placing orders and stores managing them.",
    category: "Mobile app",
    date: "July 2017",
    client: "Lime Delivery",
    tech: ["Android (Java)", "Firebase", "Retrofit 2", "RxJava"],
    image: img("p3.png", "Lime Delivery app preview"),
    portraits: [img("p3_portrait.jpg", "Lime Delivery app screens")],
  },
  {
    slug: "sensturo",
    title: "Sensturo",
    summary:
      "An interactive installation that lets visitors perceive a possible future through their senses.",
    description:
      "Sensturo, “the future through the senses”, is an interactive work that creates an immersive space where visitors explore, alone or together, a possible perception of the future. Through body movement, one or more people live experiences made of sounds, lights and textures that place them in a future space.",
    category: "Interactive installation",
    date: "August 2016",
    client: "La Tertulia Museum",
    tech: ["Arduino"],
    image: img("p1.png", "Sensturo interactive installation preview"),
    portraits: [],
  },
  {
    slug: "ingaser",
    title: "Ingaser",
    summary: "A landing page for an architecture firm.",
    description:
      "Development of a landing page for Ingaser, an architecture firm, presenting its services and projects.",
    category: "Web",
    date: "March 2018",
    client: "Paxzu Colombia",
    tech: ["HTML", "CSS", "Bootstrap"],
    image: img("p12.png", "Ingaser landing page preview"),
    portraits: [img("p12_portrait.png", "Ingaser architecture landing page")],
    liveUrl: "http://ingaser.com.co/",
  },
  {
    slug: "borondo",
    title: "Borondo",
    summary:
      "A culture app for Cali that gathers the city's cultural activities in one place.",
    description:
      "Design and development of a culture mobile app for the city of Cali, Colombia, that gathers the city's cultural activities in one place.",
    category: "Mobile app",
    date: "January 2016",
    client: "Icesi University",
    tech: ["Android (Java)", "Firebase"],
    image: img("p2.png", "Borondo culture app preview"),
    portraits: [img("p2_portrait.png", "Borondo app screens")],
  },
  {
    slug: "move-on",
    title: "Move On",
    summary:
      "An interactive rehab system for knee-injury recovery with game-based routines.",
    description:
      "Move On is a portable, interactive rehab system for knee-injury recovery that complements the rehabilitation center so patients can keep recovering at home. It offers dynamic, game-based routines and interactive environments for every recovery phase, detailed guidance on each exercise and immediate feedback on its correct execution, helping patients get excellent results and stick to their treatment.",
    category: "Interactive installation",
    date: "April 2017",
    client: "Icesi University",
    tech: ["Java", "Processing", "Arduino", "Firebase"],
    image: img("p9.png", "Move On rehab system preview"),
    portraits: [],
  },
  {
    slug: "hockey-town",
    title: "Hockey Town",
    summary:
      "A four-player air hockey game controlled from the players' phones or the keyboard.",
    description:
      "An air hockey table game with a four-player multiplayer mode: each player controls the game from their own phone or the laptop keyboard. Built for a networks class, with the Processing library for the user interface.",
    category: "Java game",
    date: "October 2016",
    client: "Icesi University",
    tech: ["Java", "Processing"],
    image: img("p4.png", "Hockey Town air hockey game preview"),
    portraits: [],
  },
  {
    slug: "wild-friends",
    title: "Wild Friends",
    summary:
      "A game built on trust between players, for a human–computer interaction class.",
    description:
      "A game based on the trust between its players, built as one of the projects of the human–computer interaction class.",
    category: "Java game",
    date: "September 2015",
    client: "Icesi University",
    tech: ["Java", "Processing"],
    image: img("p7.png", "Wild Friends game preview"),
    portraits: [
      img("p7_portrait2.png", "Wild Friends gameplay"),
      img("p7_portrait3.png", "Wild Friends game screen"),
      img("p7_portrait4.png", "Wild Friends players"),
    ],
  },
];
