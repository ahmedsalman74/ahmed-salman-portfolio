import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getPortfolioContent } from "../lib/content-store";
import ShareButton from "./ShareButton";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { linkPage, profile } = await getPortfolioContent();
  return {
    title: `${linkPage.headline || profile.name} | Links`,
    description: linkPage.bio || profile.summary,
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

  const style = {
    "--links-accent": safeColor(linkPage.accent, "#37e0ff"),
    "--links-bg": safeColor(linkPage.background, "#05070b"),
  } as CSSProperties;

  return (
    <main className={`linksPage linksTheme-${theme}`} style={style}>
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
          </div>
          {linkPage.showShareButton ? <ShareButton /> : null}
        </header>

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
              >
                {item.icon || item.label.slice(0, 2)}
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
    description: string;
    category: string;
    icon: string;
  };
  featured?: boolean;
}) {
  return (
    <a
      className={featured ? "linksTile linksTileFeatured" : "linksTile"}
      href={safeHref(item.url)}
      rel={isExternal(item.url) ? "noreferrer" : undefined}
      target={isExternal(item.url) ? "_blank" : undefined}
    >
      <span className="linksTileIcon">{item.icon || item.title.slice(0, 2)}</span>
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
