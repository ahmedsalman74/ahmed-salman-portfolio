import { getLinkPlatform } from "./link-platforms";

export default function PlatformIcon({
  platformId,
  fallback,
  className,
}: {
  platformId?: string;
  fallback?: string;
  className?: string;
}) {
  const platform = getLinkPlatform(platformId);
  const label = fallback || platform.iconLabel;

  if (platform.iconPath) {
    return (
      <svg
        aria-hidden="true"
        className={className || "platformIcon"}
        focusable="false"
        viewBox="0 0 24 24"
      >
        <path d={platform.iconPath} fill="currentColor" />
      </svg>
    );
  }

  return <span className={className || "platformTextIcon"}>{label}</span>;
}
