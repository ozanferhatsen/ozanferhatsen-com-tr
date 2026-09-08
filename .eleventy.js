import { execFileSync } from "node:child_process";

const gitUpdatedCache = new Map();

function validDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function gitUpdated(inputPath, fallback) {
  const normalizedPath = String(inputPath || "")
    .replace(/^\.\//, "")
    .replace(/\\/g, "/");

  if (gitUpdatedCache.has(normalizedPath)) {
    const cached = gitUpdatedCache.get(normalizedPath);
    const fallbackDate = validDate(fallback);
    const cachedDate = validDate(cached);
    if (fallbackDate && (!cachedDate || fallbackDate > cachedDate)) return fallback;
    return cached || fallback || "";
  }

  let gitValue = "";
  if (normalizedPath) {
    try {
      gitValue = execFileSync(
        "git",
        ["log", "-1", "--format=%cI", "--", normalizedPath],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
      ).trim();
    } catch {
      gitValue = "";
    }
  }

  gitUpdatedCache.set(normalizedPath, gitValue);

  const gitDate = validDate(gitValue);
  const fallbackDate = validDate(fallback);
  if (gitDate && fallbackDate) return gitDate > fallbackDate ? gitValue : fallback;
  return gitValue || fallback || "";
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("robots.txt");

  eleventyConfig.addFilter("dateTR", (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Istanbul"
    }).format(date);
  });

  eleventyConfig.addFilter("isoDate", (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString();
  });

  eleventyConfig.addFilter("gitUpdated", gitUpdated);
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));

  eleventyConfig.addFilter("byCategory", (items = [], category) =>
    items.filter((item) => item.data && item.data.category === category)
  );

  eleventyConfig.addFilter("limit", (items = [], count = 6) => items.slice(0, count));

  eleventyConfig.addCollection("makaleler", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("./content/makaleler/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => new Date(b.data.date || 0) - new Date(a.data.date || 0))
  );

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
}
