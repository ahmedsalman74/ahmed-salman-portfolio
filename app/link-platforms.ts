import type { SimpleIcon } from "simple-icons";
import {
  siApplemusic,
  siApplepodcasts,
  siBandcamp,
  siBehance,
  siBluesky,
  siBuymeacoffee,
  siCalendly,
  siCashapp,
  siDailymotion,
  siDeezer,
  siDevdotto,
  siDiscord,
  siDribbble,
  siFacebook,
  siFigma,
  siGithub,
  siGitlab,
  siGumroad,
  siHashnode,
  siInstagram,
  siKick,
  siKofi,
  siLinktree,
  siMastodon,
  siMedium,
  siNetflix,
  siNotion,
  siNpm,
  siOdysee,
  siPatreon,
  siPaypal,
  siPinterest,
  siPodcastaddict,
  siProducthunt,
  siQuora,
  siReddit,
  siRumble,
  siSignal,
  siSnapchat,
  siSoundcloud,
  siSpotify,
  siStackoverflow,
  siSteam,
  siSubstack,
  siTelegram,
  siThreads,
  siTidal,
  siTiktok,
  siTumblr,
  siTwitch,
  siVenmo,
  siVimeo,
  siWhatsapp,
  siX,
  siYoutube,
  siZoom,
} from "simple-icons";

export type LinkPlatformCategory =
  | "Social"
  | "Video & Streaming"
  | "Music & Podcasts"
  | "Community & Chat"
  | "Developer & Design"
  | "Creator & Payments"
  | "Contact";

export type LinkPlatform = {
  id: string;
  name: string;
  category: LinkPlatformCategory;
  iconLabel: string;
  brandColor: string;
  urlTemplate: string;
  placeholder: string;
  iconPath?: string;
};

const icon = (simpleIcon: SimpleIcon) => ({
  iconPath: simpleIcon.path,
  brandColor: `#${simpleIcon.hex}`,
});

const fallback = (brandColor: string) => ({ brandColor });

export const LINK_PLATFORMS: LinkPlatform[] = [
  platform("x", "X", "Social", "X", "https://x.com/{value}", "@ahmedsalman74", icon(siX)),
  platform("instagram", "Instagram", "Social", "IG", "https://instagram.com/{value}", "username", icon(siInstagram)),
  platform("facebook", "Facebook", "Social", "FB", "https://facebook.com/{value}", "profile username", icon(siFacebook)),
  platform("threads", "Threads", "Social", "TH", "https://threads.net/@{value}", "username", icon(siThreads)),
  platform("linkedin", "LinkedIn", "Social", "IN", "https://www.linkedin.com/in/{value}", "profile slug", fallback("#0a66c2")),
  platform("tiktok", "TikTok", "Social", "TT", "https://www.tiktok.com/@{value}", "username", icon(siTiktok)),
  platform("snapchat", "Snapchat", "Social", "SC", "https://www.snapchat.com/add/{value}", "username", icon(siSnapchat)),
  platform("reddit", "Reddit", "Social", "RD", "https://www.reddit.com/user/{value}", "username", icon(siReddit)),
  platform("pinterest", "Pinterest", "Social", "PI", "https://www.pinterest.com/{value}", "username", icon(siPinterest)),
  platform("bluesky", "Bluesky", "Social", "BS", "https://bsky.app/profile/{value}", "handle.bsky.social", icon(siBluesky)),
  platform("mastodon", "Mastodon", "Social", "MA", "{value}", "full profile URL", icon(siMastodon)),
  platform("tumblr", "Tumblr", "Social", "TB", "https://{value}.tumblr.com", "blog name", icon(siTumblr)),
  platform("quora", "Quora", "Social", "QU", "https://www.quora.com/profile/{value}", "profile slug", icon(siQuora)),

  platform("youtube", "YouTube", "Video & Streaming", "YT", "https://www.youtube.com/@{value}", "channel handle", icon(siYoutube)),
  platform("twitch", "Twitch", "Video & Streaming", "TW", "https://www.twitch.tv/{value}", "channel name", icon(siTwitch)),
  platform("kick", "Kick", "Video & Streaming", "KI", "https://kick.com/{value}", "channel name", icon(siKick)),
  platform("vimeo", "Vimeo", "Video & Streaming", "VI", "https://vimeo.com/{value}", "username or id", icon(siVimeo)),
  platform("dailymotion", "Dailymotion", "Video & Streaming", "DM", "https://www.dailymotion.com/{value}", "username", icon(siDailymotion)),
  platform("rumble", "Rumble", "Video & Streaming", "RU", "https://rumble.com/c/{value}", "channel name", icon(siRumble)),
  platform("odysee", "Odysee", "Video & Streaming", "OD", "https://odysee.com/@{value}", "channel name", icon(siOdysee)),
  platform("steam", "Steam", "Video & Streaming", "ST", "https://steamcommunity.com/id/{value}", "profile id", icon(siSteam)),
  platform("netflix", "Netflix", "Video & Streaming", "NF", "{value}", "full profile or title URL", icon(siNetflix)),

  platform("spotify", "Spotify", "Music & Podcasts", "SP", "https://open.spotify.com/user/{value}", "user id or full URL", icon(siSpotify)),
  platform("soundcloud", "SoundCloud", "Music & Podcasts", "SC", "https://soundcloud.com/{value}", "username", icon(siSoundcloud)),
  platform("apple-music", "Apple Music", "Music & Podcasts", "AM", "{value}", "full artist or playlist URL", icon(siApplemusic)),
  platform("apple-podcasts", "Apple Podcasts", "Music & Podcasts", "AP", "{value}", "full podcast URL", icon(siApplepodcasts)),
  platform("deezer", "Deezer", "Music & Podcasts", "DZ", "{value}", "full profile or playlist URL", icon(siDeezer)),
  platform("tidal", "TIDAL", "Music & Podcasts", "TI", "{value}", "full profile or playlist URL", icon(siTidal)),
  platform("bandcamp", "Bandcamp", "Music & Podcasts", "BC", "https://{value}.bandcamp.com", "artist name", icon(siBandcamp)),
  platform("podcast-addict", "Podcast Addict", "Music & Podcasts", "PA", "{value}", "full podcast URL", icon(siPodcastaddict)),

  platform("discord", "Discord", "Community & Chat", "DI", "https://discord.gg/{value}", "invite code or full URL", icon(siDiscord)),
  platform("telegram", "Telegram", "Community & Chat", "TG", "https://t.me/{value}", "username or channel", icon(siTelegram)),
  platform("whatsapp", "WhatsApp", "Community & Chat", "WA", "https://wa.me/{value}", "phone number", icon(siWhatsapp)),
  platform("signal", "Signal", "Community & Chat", "SG", "{value}", "full signal link", icon(siSignal)),
  platform("slack", "Slack", "Community & Chat", "SL", "{value}", "workspace or invite URL", fallback("#4a154b")),
  platform("zoom", "Zoom", "Community & Chat", "ZM", "{value}", "meeting or booking URL", icon(siZoom)),

  platform("github", "GitHub", "Developer & Design", "GH", "https://github.com/{value}", "username", icon(siGithub)),
  platform("gitlab", "GitLab", "Developer & Design", "GL", "https://gitlab.com/{value}", "username", icon(siGitlab)),
  platform("stackoverflow", "Stack Overflow", "Developer & Design", "SO", "{value}", "full profile URL", icon(siStackoverflow)),
  platform("npm", "npm", "Developer & Design", "NP", "https://www.npmjs.com/~{value}", "username", icon(siNpm)),
  platform("devto", "dev.to", "Developer & Design", "DV", "https://dev.to/{value}", "username", icon(siDevdotto)),
  platform("hashnode", "Hashnode", "Developer & Design", "HN", "https://hashnode.com/@{value}", "username", icon(siHashnode)),
  platform("codepen", "CodePen", "Developer & Design", "CP", "https://codepen.io/{value}", "username", fallback("#ffffff")),
  platform("figma", "Figma", "Developer & Design", "FG", "{value}", "community or profile URL", icon(siFigma)),
  platform("dribbble", "Dribbble", "Developer & Design", "DR", "https://dribbble.com/{value}", "username", icon(siDribbble)),
  platform("behance", "Behance", "Developer & Design", "BE", "https://www.behance.net/{value}", "username", icon(siBehance)),
  platform("notion", "Notion", "Developer & Design", "NO", "{value}", "public Notion URL", icon(siNotion)),

  platform("linktree", "Linktree", "Creator & Payments", "LT", "https://linktr.ee/{value}", "username", icon(siLinktree)),
  platform("producthunt", "Product Hunt", "Creator & Payments", "PH", "https://www.producthunt.com/@{value}", "username", icon(siProducthunt)),
  platform("medium", "Medium", "Creator & Payments", "ME", "https://medium.com/@{value}", "username", icon(siMedium)),
  platform("substack", "Substack", "Creator & Payments", "SS", "https://{value}.substack.com", "publication name", icon(siSubstack)),
  platform("patreon", "Patreon", "Creator & Payments", "PT", "https://www.patreon.com/{value}", "username", icon(siPatreon)),
  platform("buymeacoffee", "Buy Me A Coffee", "Creator & Payments", "BC", "https://www.buymeacoffee.com/{value}", "username", icon(siBuymeacoffee)),
  platform("kofi", "Ko-fi", "Creator & Payments", "KF", "https://ko-fi.com/{value}", "username", icon(siKofi)),
  platform("gumroad", "Gumroad", "Creator & Payments", "GR", "https://{value}.gumroad.com", "username", icon(siGumroad)),
  platform("paypal", "PayPal", "Creator & Payments", "PP", "https://paypal.me/{value}", "username", icon(siPaypal)),
  platform("cashapp", "Cash App", "Creator & Payments", "CA", "https://cash.app/{value}", "cash tag", icon(siCashapp)),
  platform("venmo", "Venmo", "Creator & Payments", "VE", "https://venmo.com/{value}", "username", icon(siVenmo)),

  platform("website", "Website", "Contact", "WW", "https://{value}", "domain or full URL", fallback("#37e0ff")),
  platform("email", "Email", "Contact", "@", "mailto:{value}", "email address", fallback("#37e0ff")),
  platform("phone", "Phone", "Contact", "PH", "tel:{value}", "phone number", fallback("#37e0ff")),
  platform("calendly", "Calendly", "Contact", "CA", "https://calendly.com/{value}", "username or event path", icon(siCalendly)),
  platform("portfolio", "Portfolio", "Contact", "PF", "{value}", "/ or /cv", fallback("#37e0ff")),
  platform("ask", "Anonymous Ask", "Contact", "?", "{value}", "/ask", fallback("#37e0ff")),
  platform("custom", "Custom", "Contact", "LN", "{value}", "full URL", fallback("#37e0ff")),
];

const PLATFORM_BY_ID = new Map(LINK_PLATFORMS.map((item) => [item.id, item]));

export const LINK_PLATFORM_CATEGORIES = Array.from(
  new Set(LINK_PLATFORMS.map((item) => item.category)),
);

export function getLinkPlatform(platformId?: string) {
  return PLATFORM_BY_ID.get(platformId || "") ?? PLATFORM_BY_ID.get("custom")!;
}

export function getPlatformColor(platformId?: string) {
  return getLinkPlatform(platformId).brandColor;
}

export function inferPlatformId(input: {
  platform?: string;
  label?: string;
  title?: string;
  icon?: string;
  url?: string;
}) {
  if (input.platform && PLATFORM_BY_ID.has(input.platform)) {
    return input.platform;
  }

  const text = `${input.label || ""} ${input.title || ""} ${input.icon || ""} ${input.url || ""}`.toLowerCase();
  const aliases: Array<[string, string]> = [
    ["github", "github"],
    ["linkedin", "linkedin"],
    ["instagram", "instagram"],
    ["youtube", "youtube"],
    ["youtu.be", "youtube"],
    ["discord", "discord"],
    ["x.com", "x"],
    ["twitter", "x"],
    ["tiktok", "tiktok"],
    ["twitch", "twitch"],
    ["spotify", "spotify"],
    ["mailto:", "email"],
    ["@ ", "email"],
    ["cv", "portfolio"],
    ["portfolio", "portfolio"],
    ["/ask", "ask"],
    ["anonymous ask", "ask"],
  ];

  return aliases.find(([needle]) => text.includes(needle))?.[1] ?? "custom";
}

export function buildPlatformHref(platformId: string | undefined, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) return trimmed;

  const platform = getLinkPlatform(platformId);
  if (platform.id === "email") return `mailto:${trimmed}`;
  if (platform.id === "phone") return `tel:${trimmed.replace(/[^\d+]/g, "")}`;

  const cleanValue = trimmed.replace(/^@+/, "");
  if (platform.id === "website") return `https://${cleanValue.replace(/^\/+/, "")}`;
  if (platform.id === "calendly") return `https://calendly.com/${cleanValue.replace(/^\/+/, "")}`;
  if (platform.urlTemplate === "{value}") return cleanValue;

  return platform.urlTemplate.replace("{value}", encodeURIComponent(cleanValue));
}

export function platform(
  id: string,
  name: string,
  category: LinkPlatformCategory,
  iconLabel: string,
  urlTemplate: string,
  placeholder: string,
  iconData: { brandColor: string; iconPath?: string },
): LinkPlatform {
  return {
    id,
    name,
    category,
    iconLabel,
    urlTemplate,
    placeholder,
    ...iconData,
  };
}
