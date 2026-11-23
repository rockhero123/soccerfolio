"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { easterEgg } from "@/content/easterEgg";
import { theaterSkipped } from "./theaterSkip";
import TheaterCurtain from "./TheaterCurtain";
import { SCENE_H } from "./waterfallSize";
import {
  loadYouTube,
  YOUTUBE_HOST,
  type YTNamespace,
  type YTPlayer,
} from "./youtube";

/** How long to wait for autoplay with sound before falling back to muted. */
export const AUTOPLAY_CHECK_MS = 1500;

type Status = "loading" | "ready" | "unavailable";

/** The choice only changes through this component, so there is nothing to subscribe to. */
const subscribeNever = () => () => {};

const button =
  "pointer-events-auto pixel-button px-3 py-0.5 font-heading text-xl leading-tight uppercase tracking-wide text-ink hover:bg-gold-500 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-red-600";

/**
 * The easter egg (spec 900 US-2): the waterfall with a music video hidden
 * behind it (only the music is heard), from YouTube's privacy-enhanced embed.
 *
 * - Every load, when `easterEgg.theater.enabled`: the theater with its curtain
 *   closed covers the page while the video loads, without playing (AC6).
 *   "Start" is a real click, so the music starts with sound right away as the
 *   curtain rises; Escape enters silently.
 * - With the theater off (AC2): it tries to play with sound; if the browser
 *   blocks that, it plays muted and turns the sound on at the first click, tap
 *   or key press, with a "Sound on" button.
 * - With prefers-reduced-motion it never starts by itself (AC4).
 * Play/pause and mute controls are always available; if YouTube cannot load,
 * the waterfall simply shows on its own.
 *
 * `scene` (the waterfall) and `theater` (the curtain, stage and seats) are
 * artwork rendered on the server, so their pixel art is never bundled for the
 * browser.
 */
export default function MusicWaterfall({
  scene,
  theater,
}: {
  scene: ReactNode;
  theater?: { drapes: ReactNode; stalls: ReactNode };
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const ytRef = useRef<YTNamespace | null>(null);
  /** "Start" was pressed before the player was ready: play with sound when it is. */
  const pendingKickRef = useRef(false);
  const [status, setStatus] = useState<Status>("loading");
  // Skipped by tests (see theaterSkip.ts); never on the server or during hydration.
  const skipped = useSyncExternalStore(
    subscribeNever,
    theaterSkipped,
    () => false,
  );
  // closed → rising (the visitor chose) → up (removed).
  const [curtain, setCurtain] = useState<"closed" | "rising" | "up">("closed");
  const showTheater =
    easterEgg.theater.enabled && theater && curtain !== "up" && !skipped;
  const curtainUp = useCallback(() => setCurtain("up"), []);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [needsSound, setNeedsSound] = useState(false);

  useEffect(() => {
    // With the theater on, the video loads but waits for "Start" (or, when the
    // theater is skipped, stays silent). With it off, every load follows AC2.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const autoplay = !easterEgg.theater.enabled && !reduceMotion;
    let cancelled = false;
    let check: ReturnType<typeof setTimeout> | undefined;

    const enableSound = () => {
      const player = playerRef.current;
      if (!player) return;
      player.unMute();
      setMuted(false);
      setNeedsSound(false);
    };

    loadYouTube()
      .then((YT) => {
        if (cancelled || !hostRef.current) return;
        ytRef.current = YT;
        playerRef.current = new YT.Player(hostRef.current, {
          host: YOUTUBE_HOST,
          videoId: easterEgg.video.id,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            loop: 1,
            playlist: easterEgg.video.id,
            controls: 0,
            disablekb: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: ({ target }) => {
              setStatus("ready");
              if (pendingKickRef.current) {
                pendingKickRef.current = false;
                target.unMute();
                target.playVideo();
                return;
              }
              if (!autoplay) return;
              target.playVideo();
              check = setTimeout(() => {
                if (target.getPlayerState() === YT.PlayerState.PLAYING) return;
                // Autoplay with sound was blocked: play muted, unmute on first interaction.
                target.mute();
                target.playVideo();
                setMuted(true);
                setNeedsSound(true);
                const once = { once: true, capture: true } as const;
                document.addEventListener("pointerdown", enableSound, once);
                document.addEventListener("keydown", enableSound, once);
              }, AUTOPLAY_CHECK_MS);
            },
            onStateChange: ({ data }) =>
              setPlaying(data === YT.PlayerState.PLAYING),
            onError: () => setStatus("unavailable"),
          },
        });
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      });

    return () => {
      cancelled = true;
      clearTimeout(check);
      document.removeEventListener("pointerdown", enableSound, true);
      document.removeEventListener("keydown", enableSound, true);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  const begin = () => {
    setCurtain("rising");
    const player = playerRef.current;
    if (player && status === "ready") {
      player.unMute();
      player.playVideo();
      setMuted(false);
    } else {
      pendingKickRef.current = true;
    }
  };

  const skip = () => setCurtain("rising");

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;
    if (playing) player.pauseVideo();
    else player.playVideo();
  };

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;
    if (muted) {
      player.unMute();
      setNeedsSound(false);
    } else player.mute();
    setMuted(!muted);
  };

  return (
    <>
      {scene}
      {/* The music video (US-2), hidden behind the cascade: only its music is
          heard. Kept in the page (not display:none) so the browser keeps playing it. */}
      <div
        aria-hidden="true"
        data-waterfall="video"
        className="pointer-events-none absolute top-0 left-1/2 z-[2] aspect-video -translate-x-1/2 overflow-hidden opacity-0"
        style={{ height: `calc(${SCENE_H} * var(--px))` }}
      >
        {/* Oversized and centred, so YouTube's own title and control overlays fall outside the frame. */}
        <div className="-mt-[22%] -ml-[25%] h-[170%] w-[150%]">
          <div
            ref={hostRef}
            data-music-video=""
            title={easterEgg.video.title}
          />
        </div>
      </div>
      {showTheater && (
        <TheaterCurtain
          drapes={theater.drapes}
          stalls={theater.stalls}
          onBegin={begin}
          onSkip={skip}
          onDone={curtainUp}
        />
      )}
      {status === "ready" && (
        <div
          role="group"
          aria-label="Music video"
          data-music-controls=""
          className="pointer-events-none absolute top-[calc(var(--field-inset)+0.75rem)] right-[calc(var(--field-inset)+0.75rem)] z-20 flex flex-wrap justify-end gap-2"
        >
          {needsSound && (
            <button
              type="button"
              onClick={toggleMute}
              className={`${button} bg-gold-500`}
            >
              🔊 Sound on
            </button>
          )}
          <button type="button" onClick={togglePlay} className={`${button} bg-paper-200`}>
            {playing ? "Pause" : "Play"}
            <span className="sr-only"> music video</span>
          </button>
          <button type="button" onClick={toggleMute} className={`${button} bg-paper-200`}>
            {muted ? "Unmute" : "Mute"}
            <span className="sr-only"> music video</span>
          </button>
        </div>
      )}
    </>
  );
}
