export default {
  layout: "karar-haritasi.njk",
  tags: ["karar-haritasi"],
  eleventyComputed: {
    permalink: (data) => `/ictihat/karar-haritalari/${data.page.fileSlug}/index.html`,
    title: (data) => data.page.fileSlug === "arsa-payi-karsiligi-insaat"
      ? "Arsa Payı Karşılığı İnşaat Sözleşmeleri: Yargıtay HGK İçtihat Haritası"
      : data.title,
    slug: (data) => data.page.fileSlug,
    format_label: "HGK KARAR HARİTASI",
    decision_count: 24,
    decision_period: "2020–2022",
    analysis_method: "Konu, uyuşmazlık ve hukuki sonuç bakımından karşılaştırmalı analiz",
    citation_title: "Arsa Payı Karşılığı İnşaat Sözleşmeleri: Yargıtay HGK İçtihat Haritası",
    summary: "Arsa payı karşılığı inşaat sözleşmelerinde resmî şekil, imar engeli, nama ifa, fesih, tasfiye, üçüncü kişi iyiniyeti, taraf teşkili, tapu iptali ve usul sorunlarını 24 Yargıtay Hukuk Genel Kurulu kararını birlikte okuyarak haritalayan karşılaştırmalı inceleme.",
    seo_title: "Arsa Payı Karşılığı İnşaat | Yargıtay HGK İçtihat Haritası",
    description: "Arsa payı karşılığı inşaat sözleşmelerinde şekil, imar engeli, nama ifa, fesih, tasfiye, üçüncü kişi iyiniyeti ve usul sorunlarını 24 HGK kararıyla karşılaştırmalı olarak inceleyen karar haritası."
  }
};
