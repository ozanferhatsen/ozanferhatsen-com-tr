import nunjucks from "nunjucks";

const categoryUrls = {
  "İmar Hukuku": "/imar-hukuku/",
  "Kentsel Dönüşüm": "/kentsel-donusum-hukuku/",
  "Kentsel Dönüşüm Hukuku": "/kentsel-donusum-hukuku/",
  "İnşaat Hukuku": "/insaat-hukuku/",
  "Gayrimenkul Hukuku": "/gayrimenkul-hukuku/",
  "Kira Hukuku": "/kira-hukuku/",
  "Bilişim Hukuku": "/bilisim-hukuku/"
};

const sourceAttributions = [
  [/^Şenol Saltık,/, "Av. Şenol Saltık,"],
  [/^Filiz Berberoğlu,/, "Hâkim Filiz Berberoğlu Yenipınar,"],
  [/^Filiz Berberoğlu Yenipınar,/, "Hâkim Filiz Berberoğlu Yenipınar,"],
  [/^Nergis Durmazgezer,/, "Av. Nergiz Durmazgezer,"],
  [/^Nergiz Durmazgezer,/, "Av. Nergiz Durmazgezer,"],
  [/^Erol Köktürk,/, "Prof. Dr. Erol Köktürk,"],
  [/^Ahmet Büyükduman,/, "Dr. Ahmet Büyükduman,"],
  [/^Oğuz Sancakdar,/, "Prof. Dr. Oğuz Sancakdar,"],
  [/^Ali Rıza İlgezdi,/, "Av. Ali Rıza İlgezdi,"]
];

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

  eleventyConfig.addFilter("json", (value) => {
    const serialized = JSON.stringify(value)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026");
    return nunjucks.runtime.markSafe(serialized);
  });

  eleventyConfig.addFilter("sourceAttribution", (value) => {
    if (!value) return "";
    for (const [pattern, replacement] of sourceAttributions) {
      if (pattern.test(value)) return value.replace(pattern, replacement);
    }
    return value;
  });

  eleventyConfig.addFilter("byCategory", (items = [], category) =>
    items.filter((item) => item.data && item.data.category === category)
  );

  eleventyConfig.addFilter("relatedByCategory", (items = [], category, currentUrl, count = 3) =>
    items
      .filter((item) => item.data && item.data.category === category && item.url !== currentUrl)
      .slice(0, count)
  );

  eleventyConfig.addFilter("categoryUrl", (category) => categoryUrls[category] || "/makaleler/");

  eleventyConfig.addFilter("limit", (items = [], count = 6) => items.slice(0, count));

  eleventyConfig.addFilter("sortByDate", (items = []) =>
    [...items].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  );

  eleventyConfig.addCollection("makaleler", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("./content/makaleler/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => new Date(b.data.date || 0) - new Date(a.data.date || 0))
  );

  eleventyConfig.addCollection("vitrinMakaleler", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("./content/makaleler/*.md")
      .filter((item) => !item.data.draft && item.data.category !== "Bilişim Hukuku")
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
