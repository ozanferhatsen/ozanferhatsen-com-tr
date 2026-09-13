(function () {
  const app = document.querySelector('[data-search-app]');
  if (!app) return;

  const form = app.querySelector('[data-search-form]');
  const input = app.querySelector('[data-search-input]');
  const status = app.querySelector('[data-search-status]');
  const resultsEl = app.querySelector('[data-search-results]');
  const filtersEl = app.querySelector('[data-search-filters]');
  const examplesEl = app.querySelector('[data-search-examples]');

  const TYPE_LABELS = {
    'karar-haritasi': 'Karar Haritası',
    'ictihat': 'İçtihat',
    'makale': 'Makale',
    'sayfa': 'Sayfa'
  };

  const LEGAL_PROTECTED_TERMS = new Set([
    'haciz', 'hapis', 'tescil', 'tecil', 'iptal', 'itfa', 'vekalet', 'velayet',
    'muris', 'varis', 'iradi', 'idari', 'rehin', 'tahliye', 'takip', 'kamu',
    'kamulastirma', 'arsa', 'arazi', 'pay', 'paydas', 'ifa', 'itiraz'
  ]);

  const LEGAL_EXPANSIONS = {
    'muteahhit': ['yüklenici'],
    'muteahit': ['yüklenici', 'müteahhit'],
    'yuklenici': ['müteahhit'],
    'iskan': ['yapı kullanma izin belgesi'],
    'kat karsiligi': ['arsa payı karşılığı inşaat'],
    'arsa payi karsiligi': ['kat karşılığı inşaat'],
    'tapu iptal': ['tapu iptali ve tescil'],
    'kentsel donusum': ['6306 sayılı Kanun', 'riskli yapı'],
    'arsa payi duzeltme': ['arsa payının düzeltilmesi'],
    'arsa payi duzeltim': ['arsa payının düzeltilmesi'],
    'insat': ['inşaat']
  };

  const SEARCH_BOOSTS = {
    title: 8,
    legal_terms: 5,
    category: 4,
    summary: 3,
    text: 1
  };

  let engine = null;
  let allResults = [];
  let activeFilter = 'all';

  function foldTurkish(text) {
    return String(text || '')
      .toLocaleLowerCase('tr-TR')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c');
  }

  function processTerm(term) {
    if (!term) return null;
    const lower = String(term).normalize('NFC').toLocaleLowerCase('tr-TR');
    const folded = foldTurkish(lower);
    return lower === folded ? lower : [lower, folded];
  }

  function fuzzyForTerm(term) {
    const folded = foldTurkish(term);
    if (folded.length < 5 || LEGAL_PROTECTED_TERMS.has(folded)) return false;
    return 0.2;
  }

  function typeBoost(_documentId, _term, storedFields) {
    switch (storedFields && storedFields.type) {
      case 'karar-haritasi': return 1.8;
      case 'ictihat': return 1.35;
      case 'makale': return 1.15;
      default: return 1;
    }
  }

  function searchOptions(combineWith) {
    return {
      boost: SEARCH_BOOSTS,
      boostDocument: typeBoost,
      combineWith: combineWith,
      prefix: function (term, index, terms) {
        return term.length >= 3 && index === terms.length - 1;
      },
      fuzzy: fuzzyForTerm,
      maxFuzzy: 1,
      weights: {
        fuzzy: 0.35,
        prefix: 0.65
      }
    };
  }

  function expandedQueries(rawQuery) {
    const foldedQuery = foldTurkish(rawQuery);
    const expanded = new Set();

    Object.entries(LEGAL_EXPANSIONS).forEach(function ([needle, values]) {
      if (!foldedQuery.includes(needle)) return;
      values.forEach(function (value) { expanded.add(value); });
    });

    return Array.from(expanded);
  }

  function mergeResultSets(sets) {
    const merged = new Map();

    sets.forEach(function (set) {
      const factor = set.factor;
      set.results.forEach(function (result) {
        const weightedScore = result.score * factor;
        const existing = merged.get(result.id);
        if (existing) {
          existing.score += weightedScore;
        } else {
          merged.set(result.id, Object.assign({}, result, { score: weightedScore }));
        }
      });
    });

    return Array.from(merged.values()).sort(function (a, b) {
      return b.score - a.score;
    });
  }

  function performSearch(rawQuery) {
    if (!engine) return [];
    const query = rawQuery.trim();
    if (!query) return [];

    const strictResults = engine.search(query, searchOptions('AND'));
    const sets = [{ results: strictResults, factor: 1 }];

    if (strictResults.length < 5) {
      sets.push({ results: engine.search(query, searchOptions('OR')), factor: 0.55 });
    }

    const expansions = expandedQueries(query);
    expansions.forEach(function (expanded) {
      sets.push({ results: engine.search(expanded, searchOptions('OR')), factor: 0.35 });
    });

    return mergeResultSets(sets);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function visibleResults() {
    if (activeFilter === 'all') return allResults;
    return allResults.filter(function (result) { return result.type === activeFilter; });
  }

  function renderFilters() {
    const types = [
      ['all', 'Tümü'],
      ['karar-haritasi', 'Karar Haritaları'],
      ['ictihat', 'İçtihatlar'],
      ['makale', 'Makaleler']
    ];

    filtersEl.innerHTML = types.map(function ([value, label]) {
      const pressed = activeFilter === value ? 'true' : 'false';
      return '<button type="button" class="search-filter" data-search-filter="' + value + '" aria-pressed="' + pressed + '">' + label + '</button>';
    }).join('');
  }

  function renderResults() {
    const results = visibleResults();
    const rawQuery = input.value.trim();

    if (!rawQuery) {
      resultsEl.innerHTML = '<div class="search-empty">Bir hukuki sorun, karar veya kavram yazarak aramaya başlayın.</div>';
      status.textContent = '';
      return;
    }

    status.textContent = results.length + ' sonuç gösteriliyor.';

    if (!results.length) {
      resultsEl.innerHTML = '<div class="search-empty">Bu sorgu için sonuç bulunamadı. Daha kısa bir hukuki kavram veya karar numarasıyla tekrar deneyebilirsiniz.</div>';
      return;
    }

    resultsEl.innerHTML = results.slice(0, 50).map(function (result) {
      const typeLabel = TYPE_LABELS[result.type] || 'Sayfa';
      const category = result.category ? '<span>' + escapeHtml(result.category) + '</span>' : '';
      const summary = result.summary
        ? '<p class="search-result-summary">' + escapeHtml(result.summary) + '</p>'
        : '';

      return '<a class="search-result" href="' + escapeHtml(result.url) + '">' +
        '<div class="search-result-meta"><span class="search-result-type">' + typeLabel + '</span>' + category + '</div>' +
        '<h2 class="search-result-title">' + escapeHtml(result.title) + '</h2>' +
        summary +
        '</a>';
    }).join('');
  }

  function runSearch(rawQuery, updateUrl) {
    allResults = performSearch(rawQuery);
    activeFilter = 'all';
    renderFilters();
    renderResults();

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (rawQuery.trim()) url.searchParams.set('q', rawQuery.trim());
      else url.searchParams.delete('q');
      window.history.replaceState({}, '', url);
    }

    if (rawQuery.trim() && typeof window.gtag === 'function') {
      window.gtag('event', 'site_search', {
        search_term: rawQuery.trim(),
        results_count: allResults.length
      });
    }
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    runSearch(input.value, true);
  });

  filtersEl.addEventListener('click', function (event) {
    const button = event.target.closest('[data-search-filter]');
    if (!button) return;
    activeFilter = button.getAttribute('data-search-filter') || 'all';
    renderFilters();
    renderResults();
  });

  examplesEl.addEventListener('click', function (event) {
    const button = event.target.closest('[data-search-example]');
    if (!button) return;
    input.value = button.getAttribute('data-search-example') || '';
    runSearch(input.value, true);
    input.focus();
  });

  async function init() {
    if (typeof window.MiniSearch === 'undefined') {
      status.textContent = 'Arama motoru yüklenemedi. Sayfayı yenileyip tekrar deneyin.';
      return;
    }

    status.textContent = 'Arama indeksi hazırlanıyor…';

    try {
      const response = await fetch('/search-index.json', { cache: 'force-cache' });
      if (!response.ok) throw new Error('search-index.json yüklenemedi');
      const documents = await response.json();

      engine = new window.MiniSearch({
        fields: ['title', 'summary', 'legal_terms', 'category', 'text'],
        storeFields: ['title', 'url', 'type', 'category', 'summary'],
        processTerm: processTerm,
        searchOptions: searchOptions('OR')
      });
      engine.addAll(documents);

      const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
      input.value = initialQuery;
      renderFilters();

      if (initialQuery) runSearch(initialQuery, false);
      else renderResults();
    } catch (error) {
      console.error(error);
      status.textContent = 'Arama indeksi yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.';
    }
  }

  init();
})();
