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
    'sayfa': 'Sayfa',
    'karar-corpus': 'Yargıtay Kararı'
  };

  const LEGAL_PROTECTED_TERMS = new Set([
    'haciz', 'hapis', 'tescil', 'tecil', 'iptal', 'itfa', 'vekalet', 'velayet',
    'muris', 'varis', 'iradi', 'idari', 'rehin', 'tahliye', 'takip', 'kamu',
    'kamulastirma', 'arsa', 'arazi', 'pay', 'paydas', 'ifa', 'itiraz'
  ]);

  const EMPTY_ONTOLOGY = {
    symmetric: [],
    one_way: [],
    abbreviations: [],
    corrections: []
  };

  const SEARCH_BOOSTS = {
    title: 8,
    legal_terms_text: 6,
    category: 4,
    summary: 3,
    headings_text: 3,
    topics_text: 3,
    court_terms_text: 2,
    decision_refs_text: 2,
    esas: 2,
    karar: 2
  };

  let engine = null;
  let ontology = EMPTY_ONTOLOGY;
  let allResults = [];
  let activeFilter = 'all';
  let documentLookup = new Map();

  function foldTurkish(text) {
    return String(text || '')
      .normalize('NFC')
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
      case 'makale': return 2.50;
      case 'karar-haritasi': return 2.00;
      case 'ictihat': return 1.35;
      case 'karar-corpus': return 0.70;
      default: return 1.0;
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

  function escapeRegExp(value) {
    return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function containsOntologyTerm(foldedQuery, term) {
    const needle = foldTurkish(term).replace(/\s+/g, ' ').trim();
    if (!needle) return false;

    if (/^[a-z0-9]+$/.test(needle) && needle.length <= 5) {
      const boundary = new RegExp('(^|[^a-z0-9])' + escapeRegExp(needle) + '(?=$|[^a-z0-9])');
      return boundary.test(foldedQuery);
    }

    return foldedQuery.includes(needle);
  }

  function addExpansion(target, query, factor) {
    const normalized = String(query || '').trim();
    if (!normalized) return;
    const key = foldTurkish(normalized);
    const previous = target.get(key);
    if (!previous || factor > previous.factor) target.set(key, { query: normalized, factor: factor });
  }

  function expandedQueries(rawQuery) {
    const foldedQuery = foldTurkish(rawQuery).replace(/\s+/g, ' ').trim();
    const expanded = new Map();

    (ontology.symmetric || []).forEach(function (group) {
      const terms = Array.isArray(group.terms) ? group.terms : [];
      const matched = terms.some(function (term) { return containsOntologyTerm(foldedQuery, term); });
      if (!matched) return;
      terms.forEach(function (term) {
        if (!containsOntologyTerm(foldedQuery, term)) addExpansion(expanded, term, Number(group.factor) || 0.35);
      });
    });

    (ontology.one_way || []).forEach(function (rule) {
      const from = Array.isArray(rule.from) ? rule.from : [];
      if (!from.some(function (term) { return containsOntologyTerm(foldedQuery, term); })) return;
      (Array.isArray(rule.to) ? rule.to : []).forEach(function (term) {
        addExpansion(expanded, term, Number(rule.factor) || 0.3);
      });
    });

    (ontology.abbreviations || []).forEach(function (rule) {
      const term = String(rule.term || '').trim();
      const expansions = Array.isArray(rule.expansions) ? rule.expansions : [];
      const factor = Number(rule.factor) || 0.35;

      if (containsOntologyTerm(foldedQuery, term)) {
        expansions.forEach(function (value) { addExpansion(expanded, value, factor); });
      }

      if (rule.reverse) {
        const fullFormMatched = expansions.some(function (value) {
          return containsOntologyTerm(foldedQuery, value);
        });
        if (fullFormMatched) addExpansion(expanded, term, factor);
      }
    });

    (ontology.corrections || []).forEach(function (rule) {
      const from = Array.isArray(rule.from) ? rule.from : [];
      if (!from.some(function (term) { return containsOntologyTerm(foldedQuery, term); })) return;
      (Array.isArray(rule.to) ? rule.to : []).forEach(function (term) {
        addExpansion(expanded, term, Number(rule.factor) || 0.35);
      });
    });

    return Array.from(expanded.values());
  }

  function normalizeQuotes(value) {
    return String(value || '').replace(/[“”„]/g, '"');
  }

  function exactPhrases(rawQuery) {
    const normalized = normalizeQuotes(rawQuery);
    const phrases = [];
    for (const match of normalized.matchAll(/"([^"]+)"/g)) {
      const phrase = match[1].trim();
      if (phrase) phrases.push(phrase);
    }
    return phrases;
  }

  function queryWithoutQuotes(rawQuery) {
    return normalizeQuotes(rawQuery).replace(/"/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function normalizeDecisionRef(year, number) {
    if (!year || !number) return null;
    return String(year).trim() + '/' + String(number).replace(/\s+/g, '').trim();
  }

  function parseDecisionQuery(rawQuery) {
    const raw = String(rawQuery || '').normalize('NFC');
    const folded = foldTurkish(raw).replace(/[,:;]/g, ' ').replace(/\s+/g, ' ').trim();
    const parsed = {
      courtCode: null,
      chamberCode: null,
      esas: null,
      karar: null,
      unlabeledRefs: [],
      refs: []
    };

    if (/\b(?:hgk|hukuk genel kurulu)\b/.test(folded)) parsed.courtCode = 'HGK';
    else if (/\b(?:ibbgk|ictihatlari birlestirme buyuk genel kurulu)\b/.test(folded)) parsed.courtCode = 'İBBGK';
    else if (/\b(?:aym|anayasa mahkemesi)\b/.test(folded)) parsed.courtCode = 'AYM';

    const chamberMatch = folded.match(/(?:yargitay\s+)?(\d{1,2})\s*\.?\s*(?:hd|hukuk dairesi)\b/);
    if (chamberMatch) parsed.chamberCode = chamberMatch[1] + '. HD';

    const esasMatch = raw.match(/(?:\bEsas(?:\s+No(?:su)?)?|\bE)\s*[\.,:]?\s*(\d{4})\s*\/\s*(\d+(?:[-/]\d+)*)/iu);
    const kararMatch = raw.match(/(?:\bKarar(?:\s+No(?:su)?)?|\bK)\s*[\.,:]?\s*(\d{4})\s*\/\s*(\d+(?:[-/]\d+)*)/iu);

    if (esasMatch) parsed.esas = normalizeDecisionRef(esasMatch[1], esasMatch[2]);
    if (kararMatch) parsed.karar = normalizeDecisionRef(kararMatch[1], kararMatch[2]);

    const allRefs = [];
    for (const match of raw.matchAll(/\b(\d{4})\s*\/\s*(\d+(?:[-/]\d+)*)\b/g)) {
      const ref = normalizeDecisionRef(match[1], match[2]);
      if (ref && !allRefs.includes(ref)) allRefs.push(ref);
    }

    if (!allRefs.length && (parsed.courtCode || parsed.chamberCode)) {
      const spacedRef = folded.match(/\b(20\d{2}|19\d{2})\s+(\d{1,6})\b/);
      if (spacedRef) allRefs.push(normalizeDecisionRef(spacedRef[1], spacedRef[2]));
    }

    parsed.refs = allRefs;
    parsed.unlabeledRefs = allRefs.filter(function (ref) {
      return ref !== parsed.esas && ref !== parsed.karar;
    });
    parsed.hasDecisionReference = Boolean(parsed.esas || parsed.karar || parsed.unlabeledRefs.length);
    return parsed;
  }

  function foldedMetadata(document) {
    const courtTerms = Array.isArray(document && document.court_terms)
      ? document.court_terms.join(' ')
      : (document && document.court_terms) || '';
    return foldTurkish([
      document && document.court,
      document && document.chamber,
      document && document.court_code,
      courtTerms
    ].filter(Boolean).join(' '));
  }

  function documentMatchesDecisionQuery(document, parsed) {
    if (!document || !parsed || !parsed.hasDecisionReference) return false;

    if (parsed.esas && String(document.esas || '') !== parsed.esas) return false;
    if (parsed.karar && String(document.karar || '') !== parsed.karar) return false;

    if (parsed.unlabeledRefs.length) {
      const refs = new Set([String(document.esas || ''), String(document.karar || '')].filter(Boolean));
      if (!parsed.unlabeledRefs.every(function (ref) { return refs.has(ref); })) return false;
    }

    const metadata = foldedMetadata(document);
    if (parsed.courtCode && !metadata.includes(foldTurkish(parsed.courtCode))) return false;
    if (parsed.chamberCode && !metadata.includes(foldTurkish(parsed.chamberCode))) return false;

    return true;
  }

  function exactDecisionResults(rawQuery) {
    const parsed = parseDecisionQuery(rawQuery);
    if (!parsed.hasDecisionReference) return [];

    const results = [];
    documentLookup.forEach(function (document) {
      if (!documentMatchesDecisionQuery(document, parsed)) return;

      results.push({
        id: document.id,
        score: 25,
        title: document.title,
        url: document.url || document.id,
        type: document.type,
        category: document.category,
        summary: document.summary,
        area: document.area,
        court: document.court,
        chamber: document.chamber,
        court_code: document.court_code,
        esas: document.esas,
        karar: document.karar,
        year: document.year
      });
    });

    return results;
  }

  function searchableDocumentText(document) {
    if (!document) return '';
    const legalTerms = Array.isArray(document.legal_terms)
      ? document.legal_terms.join(' ')
      : String(document.legal_terms_text || document.legal_terms || '');
    const topics = Array.isArray(document.topics)
      ? document.topics.join(' ')
      : String(document.topics_text || document.topics || '');
    const headings = Array.isArray(document.headings)
      ? document.headings.join(' ')
      : String(document.headings_text || document.headings || '');
    const courtTerms = Array.isArray(document.court_terms)
      ? document.court_terms.join(' ')
      : String(document.court_terms_text || document.court_terms || '');
    const decisionRefs = Array.isArray(document.decision_refs)
      ? document.decision_refs.join(' ')
      : String(document.decision_refs_text || document.decision_refs || '');

    return foldTurkish([
      document.title,
      document.summary,
      document.category,
      topics,
      legalTerms,
      headings,
      courtTerms,
      decisionRefs,
      document.court,
      document.chamber,
      document.court_code,
      document.esas,
      document.karar
    ].filter(Boolean).join(' ').replace(/\s+/g, ' '));
  }

  function matchesExactPhrases(result, phrases) {
    if (!phrases.length) return true;
    const document = documentLookup.get(result.id);
    if (!document) return false;
    const haystack = searchableDocumentText(document);
    return phrases.every(function (phrase) {
      return haystack.includes(foldTurkish(phrase).replace(/\s+/g, ' ').trim());
    });
  }

  const TYPE_PRIORITY = {
    'makale': 1,
    'karar-haritasi': 2,
    'ictihat': 3,
    'karar-corpus': 4
  };

  function mergeResultSets(sets, hasExactDecisionRef) {
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
      if (!hasExactDecisionRef) {
        const priorityA = TYPE_PRIORITY[a.type] || 5;
        const priorityB = TYPE_PRIORITY[b.type] || 5;
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
      }
      return b.score - a.score;
    });
  }

  function performSearch(rawQuery) {
    if (!engine) return [];
    const phrases = exactPhrases(rawQuery);
    const query = queryWithoutQuotes(rawQuery);
    if (!query) return [];

    const parsedDecision = parseDecisionQuery(rawQuery);
    const strictResults = engine.search(query, searchOptions('AND'));
    const sets = [{ results: strictResults, factor: 1 }];
    const exactDecision = exactDecisionResults(query);

    if (exactDecision.length) {
      sets.push({ results: exactDecision, factor: 1 });
    }

    if (strictResults.length < 5) {
      sets.push({ results: engine.search(query, searchOptions('OR')), factor: 0.55 });
    }

    const expansions = expandedQueries(query);
    expansions.forEach(function (expanded) {
      const combine = expanded.query.trim().includes(' ') ? 'AND' : 'OR';
      sets.push({ results: engine.search(expanded.query, searchOptions(combine)), factor: expanded.factor });
    });

    const merged = mergeResultSets(sets, parsedDecision.hasDecisionReference);
    return phrases.length
      ? merged.filter(function (result) { return matchesExactPhrases(result, phrases); })
      : merged;
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
    if (activeFilter === 'judgments') {
      return allResults.filter(function (result) {
        return result.type === 'ictihat' || result.type === 'karar-corpus';
      });
    }
    return allResults.filter(function (result) { return result.type === activeFilter; });
  }

  function renderFilters() {
    const types = [
      ['all', 'Tümü'],
      ['karar-haritasi', 'Karar Haritaları'],
      ['judgments', 'Yargı Kararları'],
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

      return '<a class="search-result" href="' + escapeHtml(result.url || result.id) + '">' +
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

  async function loadOntology() {
    try {
      const response = await fetch('/assets/legal-search-ontology.json', { cache: 'force-cache' });
      if (!response.ok) throw new Error('legal-search-ontology.json yüklenemedi');
      const loaded = await response.json();
      return Object.assign({}, EMPTY_ONTOLOGY, loaded || {});
    } catch (error) {
      console.warn('Hukuk sözlüğü yüklenemedi; temel arama ile devam ediliyor.', error);
      return EMPTY_ONTOLOGY;
    }
  }

  async function init() {
    if (typeof window.MiniSearch === 'undefined') {
      status.textContent = 'Arama motoru yüklenemedi. Sayfayı yenileyip tekrar deneyin.';
      return;
    }

    status.textContent = 'Arama indeksi hazırlanıyor…';

    try {
      const responses = await Promise.all([
        fetch('/search-index.json', { cache: 'no-store' }),
        loadOntology()
      ]);
      const response = responses[0];
      ontology = responses[1];

      if (!response.ok) throw new Error('search-index.json yüklenemedi');
      const documents = await response.json();

      const preparedDocuments = documents.map(function (doc) {
        return Object.assign({}, doc, {
          legal_terms_text: Array.isArray(doc.legal_terms) ? doc.legal_terms.join(' ') : String(doc.legal_terms || ''),
          topics_text: Array.isArray(doc.topics) ? doc.topics.join(' ') : String(doc.topics || ''),
          headings_text: Array.isArray(doc.headings) ? doc.headings.join(' ') : String(doc.headings || ''),
          court_terms_text: Array.isArray(doc.court_terms) ? doc.court_terms.join(' ') : String(doc.court_terms || ''),
          decision_refs_text: Array.isArray(doc.decision_refs) ? doc.decision_refs.join(' ') : String(doc.decision_refs || '')
        });
      });

      documentLookup = new Map(preparedDocuments.map(function (document) { return [document.id, document]; }));

      engine = new window.MiniSearch({
        fields: [
          'title',
          'summary',
          'legal_terms_text',
          'category',
          'headings_text',
          'topics_text',
          'court_terms_text',
          'decision_refs_text',
          'esas',
          'karar'
        ],
        storeFields: [
          'title',
          'type',
          'category',
          'summary',
          'area',
          'topics',
          'court',
          'chamber',
          'court_code',
          'esas',
          'karar',
          'year'
        ],
        processTerm: processTerm,
        searchOptions: searchOptions('OR')
      });
      engine.addAll(preparedDocuments);

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
