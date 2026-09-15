export default {
  layout: "karar-haritasi.njk",
  tags: ["karar-haritasi"],
  content_type: "karar-haritasi",
  eleventyComputed: {
    permalink: (data) => `/ictihat/karar-haritalari/${data.page.fileSlug}/index.html`,
    title: (data) => {
      if (data.page.fileSlug === "arsa-payi-karsiligi-insaat") return "Güncel Yargıtay İçtihatları ve Doktrin Işığında Arsa Payı Karşılığı İnşaat ve Kentsel Dönüşüm İçtihat Ontolojisi (2024–2026)";
      if (data.page.fileSlug === "tasinmaz-satisi") return "Taşınmaz Satışından Doğan Uyuşmazlıklar: Yargıtay HGK İçtihat Ontolojisi";
      if (data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme") return "Kentsel Dönüşümde Arsa Payının Düzeltilmesi: Yıkım, Hukuki Yarar ve Değerleme";
      return data.title;
    },
    slug: (data) => data.page.fileSlug,
    format_label: (data) => data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme" ? "YARGITAY İÇTİHAT ONTOLOJİSİ" : "YARGITAY İÇTİHAT ONTOLOJİSİ (2024–2026)",
    decision_count: (data) => {
      if (data.page.fileSlug === "tasinmaz-satisi") return 20;
      if (data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme") return 3;
      return 18;
    },
    decision_label: (data) => data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme" ? "Yargıtay kararı" : "Yargıtay Emsal Kararı & Doktriner Analiz",
    decision_period: (data) => data.page.fileSlug === "tasinmaz-satisi" ? "2020–2022" : "2024–2026",
    analysis_method: (data) => data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme"
      ? "Hukuki yarar, dava önkoşulu ve değerleme ölçütlerinin karşılaştırmalı analizi"
      : "Konu, uyuşmazlık ve hukuki sonuç bakımından ontolojik ve karşılaştırmalı analiz",
    method_note: (data) => data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme"
      ? "Hukuk Genel Kurulu ile Yargıtay 5. ve 6. Hukuk Dairesi kararları, arsa payı düzeltme uyuşmazlığının üç ayrı eşiğini — yıkım sonrası hukuki yarar, kat mülkiyeti/kat irtifakı önkoşulu ve değerleme ölçütleri — birlikte göstermek amacıyla karşılaştırılmıştır."
      : "Bu çalışma tekil karar özeti niteliğinde değildir. Arsa Payı Karşılığı İnşaat Sözleşmesi (APKİS) ve 6306 sayılı Kentsel Dönüşüm Kanunu uyuşmazlıklarının 18 temel eksende birbiriyle ilişkisi, 2024–2026 emsal kararları ve yerel doktrin çerçevesinde ontolojik olarak modellenmiştir.",
    citation_title: (data) => {
      if (data.page.fileSlug === "tasinmaz-satisi") return "Taşınmaz Satışından Doğan Uyuşmazlıklar: Yargıtay HGK İçtihat Ontolojisi";
      if (data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme") return "Kentsel Dönüşümde Arsa Payının Düzeltilmesi: Yıkım, Hukuki Yarar ve Değerleme";
      return "Güncel Yargıtay İçtihatları ve Doktrin Işığında Arsa Payı Karşılığı İnşaat ve Kentsel Dönüşüm İçtihat Ontolojisi (2024–2026)";
    },
    summary: (data) => {
      if (data.page.fileSlug === "tasinmaz-satisi") return "Taşınmaz satış uyuşmazlıklarında resmî şekil, harici satış, tescil, sebepsiz zenginleşme, rayiç bedel, iyiniyet, ayıp, eksik ifa, cezai şart, menfi zarar ve usul sorunlarını 20 Yargıtay Hukuk Genel Kurulu kararı üzerinden birlikte analiz eden içtihat ontolojisi.";
      if (data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme") return "Kentsel dönüşüm sürecinde arsa payı düzeltme davasında yapının yıkılmasının hukuki yarara etkisini, kat irtifakı veya kat mülkiyeti hiç kurulmamış taşınmazlardaki sınırı ve bağımsız bölüm değerlemesinde dikkate alınacak ölçütleri üç güncel Yargıtay kararı üzerinden karşılaştıran içtihat ontolojisi.";
      return "Yüklenicinin temerrüdü, %90 ifa seviyesi, geriye/ileriye etkili fesih, 3. kişilerin tapu durumu, TMK 1023 iyiniyet denetimi ve 6306 idari fesih süreçlerinin 18 eksende güncel Yargıtay kararları ve doktrin ile ontolojik incelemesi.";
    },
    seo_title: (data) => {
      if (data.page.fileSlug === "tasinmaz-satisi") return "Taşınmaz Satış Uyuşmazlıkları | Yargıtay HGK İçtihat Ontolojisi";
      if (data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme") return "Arsa Payı Düzeltme ve Kentsel Dönüşüm | Yargıtay İçtihat Ontolojisi";
      return "Arsa Payı Karşılığı İnşaat ve Kentsel Dönüşüm İçtihat Ontolojisi | 2024–2026";
    },
    description: (data) => {
      if (data.page.fileSlug === "tasinmaz-satisi") return "20 Yargıtay HGK kararıyla taşınmaz satışında harici satış, tescil, sebepsiz zenginleşme, ayıp, eksik ifa, cezai şart, rayiç bedel ve tazminatın ontolojik analizi.";
      if (data.page.fileSlug === "kentsel-donusum-arsa-payi-duzeltme") return "Arsa payı düzeltme davasında yıkım sonrası hukuki yarar, kat irtifakı ve kat mülkiyeti önkoşulu ile bağımsız bölüm değerleme ölçütlerini üç güncel Yargıtay kararıyla inceleyen içtihat ontolojisi.";
      return "Yüklenicinin temerrüdü, %90 ifa seviyesi, geriye/ileriye etkili fesih, 3. kişilerin tapu durumu, TMK 1023 iyiniyet denetimi ve 6306 idari fesih süreçlerinin 18 eksende güncel Yargıtay kararları ve doktrin ile ontolojik incelemesi.";
    },
    breadcrumb: (data) => [
      { name: "Ana Sayfa", url: "/" },
      { name: "İçtihat", url: "/ictihat/" },
      { name: "İçtihat Ontolojisi", url: "/ictihat/karar-haritalari/" },
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
          name: "İçtihat Ontolojisi",
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
