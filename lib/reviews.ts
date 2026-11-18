/**
 * Reviews shown next to Google's (which load live from the Places API).
 *
 * Add a review here ONLY when it is real, written about this shop, and you
 * have the right to show it: for example a review the writer sent you, or
 * one you have permission to quote from Easy / Facebook. Copy it word for
 * word, keep its real rating and date, name its source, and link to it.
 * Do not add only the good ones to hide the others.
 *
 * Empty on purpose: Easy blocks automated reading and Facebook reviews need
 * a login, so none were collected automatically.
 */
export type ManualReview = {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** YYYY-MM-DD */
  date: string;
  source: 'Easy' | 'Facebook' | 'Instagram' | 'TikTok' | 'WhatsApp' | 'Other';
  url?: string;
};

export const MANUAL_REVIEWS: ManualReview[] = [];
