/** Reservljud om Web Audio blockeras (autoplay-policy, Safari, m.m.) */
const FALLBACK_SOUND_URL = "/sound2.mp3";

let fallbackAudio: HTMLAudioElement | null = null;
let fallbackPreloaded = false;

function getFallbackAudio(): HTMLAudioElement {
  if (!fallbackAudio) {
    fallbackAudio = new Audio(FALLBACK_SOUND_URL);
    fallbackAudio.preload = "auto";
  }
  return fallbackAudio;
}

/** Ladda mp3 efter användarklick — ökar chansen att ljud fungerar */
export function preloadNotificationSound(): void {
  if (typeof window === "undefined" || fallbackPreloaded) return;
  const audio = getFallbackAudio();
  audio.load();
  fallbackPreloaded = true;
}

async function playFallbackSound(volume: number): Promise<void> {
  const audio = getFallbackAudio();
  audio.volume = Math.min(1, Math.max(0, volume));
  audio.currentTime = 0;
  await audio.play();
}

async function playWebAudioBeep(volume: number): Promise<void> {
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new Ctx();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  return new Promise((resolve, reject) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.onended = () => {
        void ctx.close();
        resolve();
      };
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch (err) {
      void ctx.close();
      reject(err);
    }
  });
}

export async function playNotificationSound(volume = 0.35): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    await playWebAudioBeep(volume);
  } catch {
    try {
      await playFallbackSound(volume);
    } catch {
      // Båda blockerade — tyst
    }
  }
}

export function canUseDesktopNotifications(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!canUseDesktopNotifications()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!canUseDesktopNotifications()) return false;
  if (Notification.permission === "granted") {
    preloadNotificationSound();
    return true;
  }
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  if (result === "granted") preloadNotificationSound();
  return result === "granted";
}

export type DesktopNotificationOptions = {
  title: string;
  body?: string;
  tag?: string;
  onClick?: () => void;
};

export function showDesktopNotification(
  options: DesktopNotificationOptions,
): void {
  if (!canUseDesktopNotifications() || Notification.permission !== "granted") {
    return;
  }

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      tag: options.tag,
      icon: "/file.svg",
    });

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      options.onClick?.();
      notification.close();
    };
  } catch {
    // Ignorera om notiser blockeras
  }
}

export type ChatNotifyOptions = {
  playSound?: boolean;
  soundVolume?: number;
  desktop?: DesktopNotificationOptions;
  /** Hoppa över desktop-notis (t.ex. när chatten redan är öppen) */
  skipDesktop?: boolean;
};

/** Ljud + valfri desktop-notis */
export function notifyChatEvent({
  playSound = true,
  soundVolume = 0.4,
  desktop,
  skipDesktop = false,
}: ChatNotifyOptions): void {
  if (playSound) void playNotificationSound(soundVolume);
  if (desktop && !skipDesktop) showDesktopNotification(desktop);
}
