#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Karar Corpus Pipeline v1
CLI & Core Engine for Precedent Ingestion, Verification, and Publication.
Project: ozanferhatsen.com.tr
"""

import os
import sys
import re
import json
import sqlite3
import hashlib
import argparse
import unicodedata
from collections import Counter
from datetime import datetime

REPO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA_DIR = os.path.join(REPO_DIR, "_data")
REGISTRY_FILE = os.path.join(DATA_DIR, "karar_registry.json")
RELEASES_DIR = os.path.join(DATA_DIR, "karar-releases")
META_DIR = os.path.join(DATA_DIR, "karar-meta")
FULLTEXT_DIR = os.path.join(DATA_DIR, "karar-fulltext")
DECISIONS_DIR = os.path.join(REPO_DIR, "content", "ictihat", "karar")
SEARCH_FILE = os.path.join(DATA_DIR, "kararlar_search.json")

for d in [RELEASES_DIR, META_DIR, FULLTEXT_DIR, DECISIONS_DIR]:
    os.makedirs(d, exist_ok=True)

def fold_proper(text):
    text = str(text).replace("İ", "i").replace("I", "i").replace("ı", "i").lower()
    nfkd = unicodedata.normalize("NFKD", text)
    no_comb = "".join(c for c in nfkd if not unicodedata.combining(c))
    return no_comb.replace("ı", "i")

def chamber_to_code(chamber_str):
    c = chamber_str.lower()
    if "genel kurulu" in c:
        return "hgk"
    m = re.search(r"(\d+)\.\s*hukuk", c)
    if m:
        return f"{m.group(1)}hd"
    return re.sub(r"[^a-z0-9]", "", c)

def canonical_id(court, chamber, esas, karar):
    c_code = chamber_to_code(chamber)
    e_clean = esas.replace("/", "-").strip()
    k_clean = karar.replace("/", "-").strip()
    return f"yargitay-{c_code}-{e_clean}-{k_clean}"

def extract_true_operative_decree(txt):
    m_dissent = re.search(
        r"\n\s*[-–—\"\s]*(?:K\s*A\s*R\s*Ş\s*I\s*O\s*Y|KARŞI OY|MUHALEFET ŞERHİ)[-–—\":\s]*\n",
        txt,
        re.IGNORECASE
    )
    main_text = txt[:m_dissent.start()] if m_dissent else txt
    tail = main_text[-2000:]

    karar_pos = -1
    for m in re.finditer(r"\n\s*(?:VI\.|V\.|IV\.|III\.)?\s*(?:KARAR|SONUÇ|HÜKÜM)\b|\nAçıklanan (?:sebeplerle|nedenlerle);?", tail):
        karar_pos = m.start()
    decree = tail[karar_pos:] if karar_pos != -1 else tail[-1000:]

    if re.search(r"HUKUK\s+İŞBÖLÜMÜ\s+İNCELEME\s+KURULUNA\s+GÖNDERİLMESİNE|YARGITAY\s+\w+\.\s+HUKUK\s+DAİRESİNE\s+GÖNDERİLMESİNE|ÖZEL\s+DAİREYE\s+GÖNDERİLMESİNE|GÖREVSİZLİK", decree, re.IGNORECASE):
        return "gönderme", decree
    if re.search(r"karar\s+düzeltme\s+(?:istemi|talebi|isteği|istemleri|talepleri|istekleri)[a-z\s]*REDDİNE", decree, re.IGNORECASE):
        return "karar düzeltme reddi", decree
    if re.search(r"D\s*Ü\s*Z\s*E\s*L\s*T\s*İ\s*L\s*E\s*R\s*E\s*K\s+O\s*N\s*A\s*N\s*M\s*A\s*S\s*I\s*N\s*A", decree, re.IGNORECASE):
        return "düzeltilerek onama", decree
    if re.search(r"B\s*O\s*Z\s*U\s*L\s*M\s*A\s*S\s*I\s*N\s*A", decree, re.IGNORECASE):
        return "bozma", decree
    if re.search(r"O\s*N\s*A\s*N\s*M\s*A\s*S\s*I\s*N\s*A", decree, re.IGNORECASE):
        return "onama", decree
    if re.search(r"temyiz\s+(?:istemi|talebi|dilekçesi|istemleri|talepleri)[a-z\s]*REDDİNE", decree, re.IGNORECASE):
        return "temyiz reddi", decree
    if re.search(r"K\s*A\s*R\s*A\s*R\s+V\s*E\s*R\s*İ\s*L\s*M\s*E\s*S\s*İ\s*N\s*E\s+Y\s*E\s*R\s+O\s*L\s*M\s*A\s*D\s*I\s*Ğ\s*I\s*N\s*A", decree, re.IGNORECASE):
        return "karar verilmesine yer olmadığı", decree
    if re.search(r"R\s*E\s*D\s*D\s*İ\s*N\s*E", decree, re.IGNORECASE):
        return "ret", decree

    return "belirsiz", decree

def load_registry():
    if os.path.exists(REGISTRY_FILE):
        with open(REGISTRY_FILE, "r", encoding="utf-8") as fp:
            return json.load(fp)
    return []

def save_registry(registry):
    with open(REGISTRY_FILE, "w", encoding="utf-8") as fp:
        json.dump(registry, fp, ensure_ascii=False, indent=2)

def cmd_status(args):
    reg = load_registry()
    print("==================================================")
    print("KARAR CORPUS PIPELINE V1: REGISTRY STATUS")
    print("==================================================")
    print(f"Toplam Kayıt Sayısı : {len(reg)}")

    status_counts = Counter(r.get("status", "unknown") for r in reg)
    print("\nYayın ve Yaşam Döngüsü Durumu:")
    for s, c in sorted(status_counts.items()):
        print(f"  - {s.ljust(16)}: {c}")

    batches = Counter(r.get("release_batch", "unassigned") for r in reg if r.get("release_batch"))
    print("\nRelease Batch Dağılımı:")
    for b, c in sorted(batches.items()):
        print(f"  - {b.ljust(24)}: {c}")

    v_counts = Counter(r.get("result", "bilinmiyor") for r in reg if r.get("status") == "published")
    print("\nYayınlanmış Kararlar Hüküm Dağılımı:")
    for v, c in sorted(v_counts.items()):
        print(f"  - {v.ljust(24)}: {c}")

    releases = os.listdir(RELEASES_DIR)
    print(f"\nMühürlü Release Manifestleri ({len(releases)}):")
    for rf in sorted(releases):
        if rf.endswith(".json"):
            print(f"  ✓ {rf}")
    print("==================================================")

def cmd_rebuild_search(args):
    reg = load_registry()
    published = [r for r in reg if r.get("status") == "published"]
    search_store = []
    for item in published:
        terms_combined = " ".join(item.get("legal_terms", []) + item.get("gundelik_terimler", []))
        halk_sorulari_text = " ".join(item.get("halk_sorulari", []))
        search_text = f"{item['title']} {item['summary']} {terms_combined} {halk_sorulari_text}".strip()

        search_store.append({
            "id": f"/ictihat/karar/{item['slug']}/",
            "url": f"/ictihat/karar/{item['slug']}/",
            "canonical_id": item["id"],
            "title": item["title"],
            "type": "karar-corpus",
            "category": item.get("category", ""),
            "primary_category": item.get("primary_category", ""),
            "summary": item.get("summary", ""),
            "text": search_text,
            "topics": item.get("topics", []),
            "court": item.get("court", "Yargıtay"),
            "chamber": item.get("chamber", ""),
            "esas": item.get("esas", ""),
            "karar": item.get("karar", ""),
            "year": item.get("year", 2024),
            "legal_terms": item.get("legal_terms", [])
        })

    with open(SEARCH_FILE, "w", encoding="utf-8") as fp:
        json.dump(search_store, fp, ensure_ascii=False, indent=2)
    print(f"✓ {SEARCH_FILE} başarıyla güncellendi ({len(search_store)} kayıt).")

def cmd_ingest_sqlite(args):
    db_path = args.db
    if not os.path.exists(db_path):
        print(f"HATA: Veritabanı bulunamadı: {db_path}")
        return

    print(f"SQLite veritabanından alım (ingest) başlatılıyor: {db_path}")
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='decisions';")
    if not cur.fetchone():
        print("HATA: 'decisions' tablosu bulunamadı.")
        conn.close()
        return

    cur.execute("SELECT id, daire, esas_no, karar_no, karar_tarihi, plain_text FROM decisions WHERE plain_text IS NOT NULL;")
    rows = cur.fetchall()
    print(f"Toplam taranacak karar sayısı: {len(rows)}")

    reg = load_registry()
    existing_ids = {r["id"] for r in reg}
    existing_hashes = {r["source_sha256"] for r in reg}

    added = 0
    skipped_id = 0
    skipped_hash = 0

    for r_id, daire, esas_no, karar_no, karar_tarihi, plain_text in rows:
        if not plain_text or len(plain_text.strip()) < 100:
            continue
        if not esas_no or not karar_no or not daire:
            continue

        cid = canonical_id("Yargıtay", daire, esas_no, karar_no)
        if cid in existing_ids:
            skipped_id += 1
            continue

        raw_text = plain_text.strip()
        t_hash = hashlib.sha256(raw_text.encode("utf-8")).hexdigest()
        if t_hash in existing_hashes:
            skipped_hash += 1
            continue

        fulltext_path = os.path.join(FULLTEXT_DIR, f"{cid}.txt")
        with open(fulltext_path, "w", encoding="utf-8") as fp:
            fp.write(raw_text)

        verdict, _ = extract_true_operative_decree(raw_text)
        year_match = re.search(r"(\d{4})", karar_tarihi or "")
        year = int(year_match.group(1)) if year_match else 2024

        c_code = chamber_to_code(daire)
        e_clean = esas_no.replace("/", "-")
        k_clean = karar_no.replace("/", "-")
        page_slug = f"yargitay-{daire.lower().replace(' ', '-').replace('.', '')}-{e_clean}-e-{k_clean}-k"

        new_entry = {
            "id": cid,
            "slug": page_slug,
            "court": "Yargıtay",
            "chamber": daire,
            "chamber_code": c_code,
            "esas": esas_no,
            "karar": karar_no,
            "date": karar_tarihi,
            "year": year,
            "source_sha256": t_hash,
            "status": "staged",
            "release_batch": None,
            "level": 1,
            "technical_status": "UNVERIFIED",
            "legal_status": "UNVERIFIED",
            "result": verdict,
            "title": f"Yargıtay {daire} E. {esas_no} K. {karar_no}",
            "summary": "",
            "category": "Genel Hukuk",
            "primary_category": "GENEL_HUKUK",
            "topics": [],
            "legal_terms": [],
            "halk_sorulari": [],
            "gundelik_terimler": [],
            "robots": "noindex,follow",
            "excludeFromSitemap": True
        }

        reg.append(new_entry)
        existing_ids.add(cid)
        existing_hashes.add(t_hash)
        added += 1

    conn.close()
    save_registry(reg)
    print("\nIngestion Tamamlandı:")
    print(f"  ✓ Eklenen Yeni Karar : {added}")
    print(f"  - Atlanan Mükerrer ID: {skipped_id}")
    print(f"  - Atlanan Mükerrer Metin SHA: {skipped_hash}")
    print(f"  Güncel Registry Toplamı: {len(reg)}")

def main():
    parser = argparse.ArgumentParser(description="Karar Corpus Pipeline v1 CLI")
    subparsers = parser.add_subparsers(dest="command")

    p_status = subparsers.add_parser("status", help="Registry durumunu ve metriklerini gösterir")
    p_status.set_defaults(func=cmd_status)

    p_search = subparsers.add_parser("rebuild-search", help="Yayınlanmış kararlardan arama store'unu otomatik üretir")
    p_search.set_defaults(func=cmd_rebuild_search)

    p_ingest = subparsers.add_parser("ingest-sqlite", help="SQLite veritabanından ham kararları alıp sisteme kaydeder")
    p_ingest.add_argument("--db", required=True, help="SQLite .db dosya yolu")
    p_ingest.set_defaults(func=cmd_ingest_sqlite)

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        return

    args.func(args)

if __name__ == "__main__":
    main()
