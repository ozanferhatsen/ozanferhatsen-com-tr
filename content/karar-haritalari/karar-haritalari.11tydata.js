export default {
  layout: "karar-haritasi.njk",
  tags: ["karar-haritasi"],
  content_type: "karar-haritasi",
  eleventyComputed: {
    permalink: (data) => `/ictihat/karar-haritalari/${data.page.fileSlug}/index.html`,
    title: (data) => {
      if (data.page.fileSlug === "arsa-payi-karsiligi-insaat") return "Arsa Payı Karşılığı İnşaat Sözleşmeleri: Yargıtay HGK İçtihat Haritası";
      if (data.page.fileSlug === "tasinmaz-satisi") return "Taşınmaz Satışından Doğan Uyuşmazlıklar: Yargıtay HGK İçtihat Haritası";
      if (data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme") return "Kentsel Dönüşümde Arsa Payının Düzeltilmesi: Yıkım, Hukuki Yarar ve Değerleme";
      return data.title;
    },
    slug: (data) => data.page.fileSlug,
    format_label: (data) => data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme" ? "YARGITAY KARAR HARİTASI" : "HGK KARAR HARİTASI",
    decision_count: (data) => {
      if (data.page.fileSlug === "tasinmaz-satisi") return 20;
      if (data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme") return 3;
      return 24;
    },
    decision_label: (data) => data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme" ? "Yargıtay kararı" : "HGK kararı",
    decision_period: (data) => data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme" ? "2025–2026" : "2020–2022",
    analysis_method: (data) => data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme"
      ? "Hukuki yarar, dava önkoşulu ve değerleme ölçütlerinin karşılaştırmalı analizi"
      : "Konu, uyuşmazlık ve hukuki sonuç bakımından karşılaştırmalı analiz",
    method_note: (data) => data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme"
      ? "Hukuk Genel Kurulu ile Yargıtay 5. ve 6. Hukuk Dairesi kararları, arsa payı düzeltme uyuşmazlığının üç ayrı eşiğini — yıkım sonrası hukuki yarar, kat mülkiyeti/kat irtifakı önkoşulu ve değerleme ölçütleri — birlikte göstermek amacıyla karşılaştırılmıştır."
      : null,
    citation_title: (data) => {
      if (data.page.fileSlug === "tasinmaz-satisi") return "Taşınmaz Satışından Doğan Uyuşmazlıklar: Yargıtay HGK İçtihat Haritası";
      if (data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme") return "Kentsel Dönüşümde Arsa Payının Düzeltilmesi: Yıkım, Hukuki Yarar ve Değerleme";
      return "Arsa Payı Karşılığı İnşaat Sözleşmeleri: Yargıtay HGK İçtihat Haritası";
    },
    summary: (data) => {
      if (data.page.fileSlug === "tasinmaz-satisi") return "Taşınmaz satış uyuşmazlıklarında resmî şekil, harici satış, tescil, sebepsiz zenginleşme, rayiç bedel, iyiniyet, ayıp, eksik ifa, cezai şart, menfi zarar ve usul sorunlarını 20 Yargıtay Hukuk Genel Kurulu kararı üzerinden birlikte analiz eden karar haritası.";
      if (data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme") return "Kentsel dönüşüm sürecinde arsa payı düzeltme davasında yapının yıkılmasının hukuki yarara etkisini, kat irtifakı veya kat mülkiyeti hiç kurulmamış taşınmazlardaki sınırı ve bağımsız bölüm değerlemesinde dikkate alınacak ölçütleri üç güncel Yargıtay kararı üzerinden karşılaştıran karar haritası.";
      return "Arsa payı karşılığı inşaat sözleşmelerinde resmî şekil, imar engeli, nama ifa, fesih, tasfiye, üçüncü kişi iyiniyeti, taraf teşkili, tapu iptali ve usul sorunlarını 24 Yargıtay Hukuk Genel Kurulu kararını birlikte okuyarak haritalayan karşılaştırmalı inceleme.";
    },
    seo_title: (data) => {
      if (data.page.fileSlug === "tasinmaz-satisi") return "Taşınmaz Satış Uyuşmazlıkları | Yargıtay HGK İçtihat Haritası";
      if (data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme") return "Arsa Payı Düzeltme ve Kentsel Dönüşüm | Yargıtay Karar Haritası";
      return "Arsa Payı Karşılığı İnşaat | Yargıtay HGK İçtihat Haritası";
    },
    description: (data) => {
      if (data.page.fileSlug === "tasinmaz-satisi") return "20 Yargıtay HGK kararıyla taşınmaz satışında harici satış, tescil, sebepsiz zenginleşme, ayıp, eksik ifa, cezai şart, rayiç bedel ve tazminat analizi.";
      if (data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme") return "Arsa payı düzeltme davasında yıkım sonrası hukuki yarar, kat irtifakı ve kat mülkiyeti önkoşulu ile bağımsız bölüm değerleme ölçütlerini üç güncel Yargıtay kararıyla inceleyen karar haritası.";
      return "Arsa payı karşılığı inşaat sözleşmelerinde şekil, imar engeli, nama ifa, fesih, tasfiye, üçüncü kişi iyiniyeti ve usul sorunlarını 24 HGK kararıyla karşılaştırmalı olarak inceleyen karar haritası.";
    },
    breadcrumb: (data) => [
      { name: "Ana Sayfa", url: "/" },
      { name: "İçtihat", url: "/ictihat/" },
      { name: "Karar Haritaları", url: "/ictihat/karar-haritalari/" },
      {
        name: data.page.fileSlug === "tasinmaz-satisi"
          ? "Taşınmaz Satışından Doğan Uyuşmazlıklar"
          : data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme"
            ? "Kentsel Dönüşümde Arsa Payının Düzeltilmesi"
            : "Arsa Payı Karşılığı İnşaat"
      }
    ],
    schema: (data) => JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Ana Sayfa",
          item: "https://ozanferhatsen.com.tr/"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "İçtihat",
          item: "https://ozanferhatsen.com.tr/ictihat/"
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Karar Haritaları",
          item: "https://ozanferhatsen.com.tr/ictihat/karar-haritalari/"
        },
        {
          "@type": "ListItem",
          position: 4,
          name: data.page.fileSlug === "tasinmaz-satisi"
            ? "Taşınmaz Satışından Doğan Uyuşmazlıklar"
            : data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme"
              ? "Kentsel Dönüşümde Arsa Payının Düzeltilmesi"
              : "Arsa Payı Karşılığı İnşaat"
        }
      ]
    })
  }
};
