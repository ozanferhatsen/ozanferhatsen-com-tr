export default {
  layout: "karar-haritasi.njk",
  tags: ["karar-haritasi"],
  eleventyComputed: {
    permalink: (data) => `/ictihat/karar-haritalari/${data.page.fileSlug}/index.html`,
    title: (data) => {
      if (data.page.fileSlug === "arsa-payi-karsiligi-insaat") return "Arsa Payı Karşılığı İnşaat Sözleşmeleri: Yargıtay HGK İçtihat Haritası";
      if (data.page.fileSlug === "tasinmaz-satisi") return "Taşınmaz Satışından Doğan Uyuşmazlıklar: Yargıtay HGK İçtihat Haritası";
      return data.title;
    },
    slug: (data) => data.page.fileSlug,
    format_label: "HGK KARAR HARİTASI",
    decision_count: (data) => data.page.fileSlug === "tasinmaz-satisi" ? 20 : 24,
    decision_period: "2020–2022",
    analysis_method: "Konu, uyuşmazlık ve hukuki sonuç bakımından karşılaştırmalı analiz",
    citation_title: (data) => data.page.fileSlug === "tasinmaz-satisi"
      ? "Taşınmaz Satışından Doğan Uyuşmazlıklar: Yargıtay HGK İçtihat Haritası"
      : "Arsa Payı Karşılığı İnşaat Sözleşmeleri: Yargıtay HGK İçtihat Haritası",
    summary: (data) => data.page.fileSlug === "tasinmaz-satisi"
      ? "Taşınmaz satış uyuşmazlıklarında resmî şekil, harici satış, tescil, sebepsiz zenginleşme, rayiç bedel, iyiniyet, ayıp, eksik ifa, cezai şart, menfi zarar ve usul sorunlarını 20 Yargıtay Hukuk Genel Kurulu kararı üzerinden birlikte analiz eden karar haritası."
      : "Arsa payı karşılığı inşaat sözleşmelerinde resmî şekil, imar engeli, nama ifa, fesih, tasfiye, üçüncü kişi iyiniyeti, taraf teşkili, tapu iptali ve usul sorunlarını 24 Yargıtay Hukuk Genel Kurulu kararını birlikte okuyarak haritalayan karşılaştırmalı inceleme.",
    seo_title: (data) => data.page.fileSlug === "tasinmaz-satisi"
      ? "Taşınmaz Satış Uyuşmazlıkları | Yargıtay HGK İçtihat Haritası"
      : "Arsa Payı Karşılığı İnşaat | Yargıtay HGK İçtihat Haritası",
    description: (data) => data.page.fileSlug === "tasinmaz-satisi"
      ? "20 Yargıtay HGK kararıyla taşınmaz satışında harici satış, tescil, sebepsiz zenginleşme, ayıp, eksik ifa, cezai şart, rayiç bedel ve tazminat analizi."
      : "Arsa payı karşılığı inşaat sözleşmelerinde şekil, imar engeli, nama ifa, fesih, tasfiye, üçüncü kişi iyiniyeti ve usul sorunlarını 24 HGK kararıyla karşılaştırmalı olarak inceleyen karar haritası."
  }
};
