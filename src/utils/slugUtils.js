/**
 * Creates a SEO-friendly URL slug from a title or text string
 * Follows Google indexing best practices
 *
 * @param {string} title - The input title/text to convert to slug
 * @returns {string} - Clean, SEO-friendly slug
 */
export const createSlug = (title) => {
  if (!title) return "";

  let slug = title.toString().trim();

  try {
    slug = decodeURIComponent(slug);
  } catch (_err) {
    // keep the original value if decoding fails
  }

  // Replace spaces, &, and : with hyphens
  slug = slug.replace(/[\s&,:]+/g, "-");

  // Remove brackets and other special characters ((), {}, [], quotes, etc.)
  slug = slug.replace(/[()[\]{}'"]/g, "");

  // Remove everything except letters, digits, and hyphens
  slug = slug.replace(/[^a-zA-Z0-9-]/g, "");

  // Collapse multiple hyphens into one
  slug = slug.replace(/-{2,}/g, "-");

  // Trim leading/trailing hyphens
  slug = slug.replace(/^-|-$/g, "");

  // Capitalize first letter of each word (separated by hyphens)
  slug = slug.replace(
    /(^|-)([a-z])/g,
    (match, separator, letter) => separator + letter
  );

  return slug;
};

/**
 * Creates a canonical URL for articles
 * @param {string|number} articleId - The article ID
 * @param {string} title - The article title
 * @param {string} baseUrl - Base URL (default: https://www.all-cures.com)
 * @returns {string} - Complete canonical URL
 */
export const createCanonicalUrl = (
  articleId,
  title,
  baseUrl = "https://www.all-cures.com"
) => {
  const cleanSlug = createSlug(title);
  return `${baseUrl}/cure/${articleId}${cleanSlug ? `-${cleanSlug}` : ""}`;
};

/**
 * Creates a URL path for articles (without domain)
 * @param {string|number} articleId - The article ID
 * @param {string} title - The article title
 * @returns {string} - URL path for article
 */
export const createArticlePath = (articleId, title) => {
  const cleanSlug = createSlug(title);
  return `/cure/${articleId}${cleanSlug ? `-${cleanSlug}` : ""}`;
};

/**
 * Creates a slug for disease categories
 * @param {string|number} categoryId - The category ID
 * @param {string} categoryName - The category name
 * @returns {string} - URL slug for category
 */
export const createCategorySlug = (categoryId, categoryName) => {
  const cleanSlug = createSlug(categoryName);
  return `${categoryId}${cleanSlug ? `-${cleanSlug}` : ""}`;
};
