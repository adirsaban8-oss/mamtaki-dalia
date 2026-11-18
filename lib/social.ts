/**
 * Follower counts shown on the home page (SocialStats).
 *
 * These are typed in by hand, exactly as each platform shows them on the
 * public profile. Instagram and TikTok show rounded figures ("30.3K") to
 * visitors who are not the owner, so the figure is kept as shown, never
 * re-rounded or made up. To update: open the profile, copy the number,
 * change `shown` and `checkedOn` below, and deploy.
 *
 * Later: an official API (Instagram Graph API for a Business account,
 * TikTok Display API) can fill these at build time instead; keep the same
 * shape so the component does not change.
 */
export type SocialStat = {
  platform: 'instagram' | 'tiktok';
  /** Exactly as the platform displays it. */
  shown: string;
  url: string;
  handle: string;
};

export const SOCIAL_STATS: SocialStat[] = [
  { platform: 'instagram', shown: '30.3K', url: 'https://www.instagram.com/mamtaki_dalia/', handle: '@mamtaki_dalia' },
  { platform: 'tiktok', shown: '43K', url: 'https://www.tiktok.com/@mamtaki.dalia', handle: '@mamtaki.dalia' },
];

/** The day the figures above were read off the public profiles (YYYY-MM-DD). */
export const SOCIAL_CHECKED_ON = '2026-11-18';
