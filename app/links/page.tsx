import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import PlatformIcon from "../PlatformIcon";
import { getPortfolioContent } from "../lib/content-store";
import { getLinkPlatform, getPlatformColor, inferPlatformId } from "../link-platforms";
import { absoluteUrl, allProfileAliases, seoProfile } from "../seo";
import ShareButton from "./ShareButton";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const title = seoProfile.linksTitle;

  return {
    title,
    description: seoProfile.linksDescription,
    keywords: seoProfile.keywords,
    alternates: {
      canonical: "/links",
    },
    openGraph: {
      title,
      description: seoProfile.linksDescription,
      url: absoluteUrl("/links"),
      type: "profile",
      siteName: "Ahmed Salman Portfolio",
      locale: "en_US",
      alternateLocale: ["ar_EG"],
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "Ahmed Salman senior backend developer, gamer, and streamer links profile",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: seoProfile.linksDescription,
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function LinksPage() {
  const { linkPage, profile } = await getPortfolioContent();
  if (!linkPage.enabled) notFound();

  const socials = linkPage.socials.filter((item) => item.enabled && safeHref(item.url));
  const links = linkPage.links.filter((item) => item.enabled && safeHref(item.url));
  const featured = links.filter((item) => item.featured);
  const regular = links.filter((item) => !item.featured);
  const theme = safeTheme(linkPage.theme);
  const layout = linkPage.layout === "cards" ? "cards" : "stack";
  const visibleLinkItems = [...socials, ...links];
  const platformNames = uniqueText(
    visibleLinkItems.map((item) => displayPlatformName(inferPlatformId(item))),
  );
  const sameAs = uniqueUrls([
    profile.github,
    profile.linkedin,
    ...linkPage.socials.map((item) => item.url),
    ...linkPage.links.map((item) => item.url),
  ]);
  const profileJsonLd = jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": absoluteUrl("/links#profile-page"),
        url: absoluteUrl("/links"),
        name: `${profile.name} links profile`,
        description: seoProfile.linksDescription,
        mainEntity: {
          "@id": absoluteUrl("/links#ahmed-salman"),
        },
        about: seoProfile.searchAliases,
        hasPart: links
          .filter((item) => safeHref(item.url))
          .map((item) => ({
            "@type": "WebPage",
            name: `${profile.name} on ${displayPlatformName(inferPlatformId(item))}: ${item.title}`,
            url: safeHref(item.url),
            description: item.description || seoProfile.shortDescription,
          })),
      },
      {
        "@type": "Person",
        "@id": absoluteUrl("/links#ahmed-salman"),
        name: profile.name,
        alternateName: allProfileAliases,
        jobTitle: seoProfile.role,
        url: absoluteUrl("/links"),
        sameAs,
        email: profile.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: profile.location,
        },
        description: seoProfile.linksDescription,
        knowsAbout: seoProfile.knowsAbout,
        subjectOf: sameAs.map((url) => ({
          "@type": "WebPage",
          url,
        })),
      },
    ],
  });

  const style = {
    "--links-accent": safeColor(linkPage.accent, "#37e0ff"),
    "--links-bg": safeColor(linkPage.background, "#05070b"),
  } as CSSProperties;

  return (
    <main className={`linksPage linksTheme-${theme}`} style={style}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: profileJsonLd }}
      />
      <section className="linksCard" aria-label={`${linkPage.headline} links`}>
        <header className="linksHero">
          <div className="linksAvatar" aria-hidden="true">
            {linkPage.avatarImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={linkPage.avatarImage} alt="" />
            ) : (
              <span>{linkPage.avatarText || "AS"}</span>
            )}
          </div>
          <div>
            <p className="linksHandle">@{linkPage.handle || "ahmedsalman74"}</p>
            <h1>
              {linkPage.headline || profile.name}
              {linkPage.showVerifiedBadge ? <span aria-label="Verified">✓</span> : null}
            </h1>
            <p>{linkPage.bio || profile.summary}</p>
            <p className="linksSeoLine">{seoProfile.shortDescription}</p>
          </div>
          {linkPage.showShareButton ? <ShareButton /> : null}
        </header>

        <section className="linksSearchPanel" aria-label="Ahmed Salman search identity">
          <div>
            <p className="linksSearchKicker">Search Identity</p>
            <h2>Ahmed Salman / أحمد سلمان</h2>
            <p>
              Official link hub for Ahmed Salman, also written as احمد سلمان or احمد سالمان,
              known online as ahmedsalman74 and ahmedsalman72.
            </p>
          </div>
          <div className="linksSearchGrid">
            <div>
              <strong>Software</strong>
              <span>Senior backend software engineer focused on Node.js, TypeScript, Nest.js, microservices, cloud systems, and APIs.</span>
            </div>
            <div>
              <strong>Gaming</strong>
              <span>Passionate gamer and game streamer across {platformNames.length ? platformNames.join(", ") : "Twitch, Kick, TikTok, X/Twitter, YouTube, Instagram, Discord, and Spotify"}.</span>
            </div>
          </div>
          <div className="linksAliasChips" aria-label="Profile search aliases">
            {seoProfile.searchAliases.map((alias) => (
              <span key={alias}>{alias}</span>
            ))}
          </div>
        </section>

        <div className="linksMeta" aria-label="Profile details">
          {linkPage.status ? <span>{linkPage.status}</span> : null}
          {linkPage.location ? <span>{linkPage.location}</span> : null}
        </div>

        {socials.length ? (
          <nav className="linksSocials" aria-label="Social links">
            {socials.map((item) => (
              <a
                href={safeHref(item.url)}
                key={`${item.label}-${item.url}`}
                rel={isExternal(item.url) ? "noreferrer" : undefined}
                target={isExternal(item.url) ? "_blank" : undefined}
                aria-label={item.label}
                style={platformStyle(inferPlatformId(item))}
              >
                <PlatformIcon platformId={inferPlatformId(item)} fallback={item.icon || item.label.slice(0, 2)} />
              </a>
            ))}
          </nav>
        ) : null}

        {featured.length ? (
          <section className="linksFeatured" aria-label="Featured links">
            {featured.map((item) => (
              <LinkTile item={item} key={`${item.title}-${item.url}`} featured />
            ))}
          </section>
        ) : null}

        <section className={`linksList linksLayout-${layout}`} aria-label="All links">
          {regular.map((item) => (
            <LinkTile item={item} key={`${item.title}-${item.url}`} />
          ))}
        </section>
      </section>
    </main>
  );
}

function LinkTile({
  item,
  featured = false,
}: {
  item: {
    title: string;
    url: string;
    platform?: string;
    username?: string;
    description: string;
    category: string;
    icon: string;
  };
  featured?: boolean;
}) {
  const platformId = inferPlatformId(item);

  return (
    <a
      className={featured ? "linksTile linksTileFeatured" : "linksTile"}
      href={safeHref(item.url)}
      rel={isExternal(item.url) ? "noreferrer" : undefined}
      target={isExternal(item.url) ? "_blank" : undefined}
    >
      <span className="linksTileIcon" style={platformStyle(platformId)}>
        <PlatformIcon platformId={platformId} fallback={item.icon || item.title.slice(0, 2)} />
      </span>
      <span>
        {item.category ? <em>{item.category}</em> : null}
        <strong>{item.title}</strong>
        {item.description ? <small>{item.description}</small> : null}
      </span>
    </a>
  );
}

function safeHref(value: string) {
  if (!value) return "";
  if (value.startsWith("/")) return value;

  try {
    const url = new URL(value);
    if (["https:", "http:", "mailto:", "tel:"].includes(url.protocol)) {
      return value;
    }
  } catch {
    return "";
  }

  return "";
}

function isExternal(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

function safeTheme(value: string) {
  return ["midnight", "aurora", "minimal", "carbon"].includes(value)
    ? value
    : "midnight";
}

function safeColor(value: string, fallback: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function platformStyle(platformId: string) {
  return { "--platform-color": getPlatformColor(platformId) } as CSSProperties;
}

function displayPlatformName(platformId: string) {
  const platform = getLinkPlatform(platformId);
  return platform.id === "x" ? "X/Twitter" : platform.name;
}

function uniqueText(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function uniqueUrls(values: string[]) {
  return Array.from(
    new Set(
      values
        .map((value) => safeHref(value))
        .filter((value) => value.startsWith("http://") || value.startsWith("https://")),
    ),
  );
}

function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
