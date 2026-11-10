#!/usr/bin/env python3
"""Generate and verify the pinned Classic Store Flyway migrations.

The source is read from the exact immutable Git commit below. No branch tip or
working-tree copy is accepted as the source of truth.
"""
from __future__ import annotations

import argparse
import hashlib
import re
import subprocess
import sys
from pathlib import Path

SOURCE_REPO = "mosalah00x-source/classic-store-New"
SOURCE_COMMIT = "0c6e9f1ad9614aba87e2a91b5e7f5f3c72b4ee85"
SOURCE_PATH = "db/reference/Classic_Store_Consolidated_V1-V7.sql"
EXPECTED_SOURCE_SHA256 = "a5c265bf2cda1c457dbe989994ef4314d3ff932472e65dbf190934dea0664ff8"
ROOT = Path(__file__).resolve().parents[2]
MIGRATION_DIR = ROOT / "backend/src/main/resources/db/migration"
LOCK_PATH = ROOT / "backend/db-source.lock"
NAMES = [
    "V1__baseline_types_identity.sql",
    "V2__catalog.sql",
    "V3__inventory.sql",
    "V4__cart_orders_reservations.sql",
    "V5__payments_shipping_returns_outbox.sql",
    "V6__functions_allocation.sql",
    "V7__integrity_and_reservation_hardening.sql",
]
BLOCK_RE = re.compile(r"(?:^|\n)BEGIN;\s*(.*?)\s*COMMIT;", re.DOTALL)
V7_NOTE_RE = re.compile(
    r"/\* -------------------------------------------------------------------------\n"
    r"   V7 RESULTING CONTRACT[\s\S]*?------------------------------------------------------------------------- \*/"
)

def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def load_pinned_source() -> bytes:
    spec = f"{SOURCE_COMMIT}:{SOURCE_PATH}"
    result = subprocess.run(
        ["git", "show", spec],
        cwd=ROOT,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return result.stdout

def classify_comments(source: str, blocks: list[str]) -> list[list[str]]:
    tables: dict[str, int] = {}
    functions: dict[str, int] = {}
    types: dict[str, int] = {}
    for version, block in enumerate(blocks, start=1):
        for name in re.findall(r"CREATE\s+TABLE\s+store\.([a-z_]+)", block, re.I):
            tables[name] = version
        for name in re.findall(
            r"CREATE(?:\s+OR\s+REPLACE)?\s+FUNCTION\s+store\.([a-z_]+)\s*\(",
            block,
            re.I,
        ):
            functions[name] = version
        for name in re.findall(r"CREATE\s+TYPE\s+store\.([a-z_]+)", block, re.I):
            types[name] = version

    assigned: list[list[str]] = [[] for _ in range(7)]
    comments = [
        line for line in source.splitlines()
        if line.lstrip().startswith("COMMENT ON ")
    ]
    for line in comments:
        version = None
        match = re.match(r"COMMENT ON SCHEMA store\b", line, re.I)
        if match:
            version = 1
        elif re.match(r"COMMENT ON EXTENSION (pgcrypto|citext|btree_gist)\b", line, re.I):
            version = 1
        elif match := re.match(r"COMMENT ON TYPE store\.([a-z_]+)", line, re.I):
            version = types.get(match.group(1))
        elif match := re.match(r"COMMENT ON TABLE store\.([a-z_]+)", line, re.I):
            version = tables.get(match.group(1))
        elif match := re.match(r"COMMENT ON COLUMN store\.([a-z_]+)\.([a-z_]+)", line, re.I):
            version = tables.get(match.group(1))
        elif match := re.match(r"COMMENT ON FUNCTION store\.([a-z_]+)\s*\(", line, re.I):
            version = functions.get(match.group(1))

        if version is None:
            raise ValueError(f"Unmapped COMMENT statement: {line}")
        assigned[version - 1].append(line)

    expected_counts = [60, 63, 32, 81, 59, 5, 3]
    actual_counts = [len(group) for group in assigned]
    if len(comments) != 303 or actual_counts != expected_counts:
        raise ValueError(
            f"COMMENT distribution changed: total={len(comments)}, "
            f"versions={actual_counts}, expected total=303/{expected_counts}"
        )
    return assigned

def generate() -> tuple[dict[str, str], str, dict[str, str]]:
    source_bytes = load_pinned_source()
    source_hash = sha256(source_bytes)
    if source_hash != EXPECTED_SOURCE_SHA256:
        raise ValueError(
            "Pinned source SHA-256 mismatch: "
            f"expected {EXPECTED_SOURCE_SHA256}, got {source_hash}"
        )
    source = source_bytes.decode("utf-8")
    blocks = [match.strip() for match in BLOCK_RE.findall(source)]
    if len(blocks) != 7:
        raise ValueError(f"Expected exactly 7 BEGIN/COMMIT blocks, found {len(blocks)}")

    schema_lines = re.findall(
        r"(?m)^\s*CREATE SCHEMA IF NOT EXISTS store;\s*$", source
    )
    if len(schema_lines) != 1:
        raise ValueError("Expected exactly one standalone CREATE SCHEMA statement")

    # All source text outside the seven transaction blocks must be comments,
    # the one schema statement, or COMMENT ON statements.
    outside = BLOCK_RE.sub("\n", source)
    outside = re.sub(
        r"(?m)^\s*CREATE SCHEMA IF NOT EXISTS store;\s*$", "", outside
    )
    outside = re.sub(r"(?m)^\s*COMMENT ON .*;\s*$", "", outside)
    outside = re.sub(r"/\*.*?\*/", "", outside, flags=re.DOTALL)
    outside = re.sub(r"(?m)^\s*--.*$", "", outside)
    if outside.strip():
        raise ValueError(f"Unexpected SQL outside approved blocks:\n{outside.strip()}")

    extension_lines = [
        line.strip()
        for line in blocks[0].splitlines()
        if re.match(r"(?i)^\s*CREATE EXTENSION IF NOT EXISTS ", line)
    ]
    expected_extensions = [
        "CREATE EXTENSION IF NOT EXISTS pgcrypto;",
        "CREATE EXTENSION IF NOT EXISTS citext SCHEMA store;",
        "CREATE EXTENSION IF NOT EXISTS btree_gist;",
    ]
    if extension_lines != expected_extensions:
        raise ValueError(
            f"Unexpected V1 extension sequence or citext schema: {extension_lines}"
        )
    first_object = re.search(
        r"(?im)^\s*CREATE\s+(?:TYPE|TABLE|FUNCTION|OR REPLACE FUNCTION)\b",
        blocks[0],
    )
    if not first_object:
        raise ValueError("V1 has no database object definitions")
    last_extension = max(
        blocks[0].lower().find(line.lower()) for line in expected_extensions
    )
    if last_extension < 0 or last_extension > first_object.start():
        raise ValueError("An extension appears after a V1 database object")

    assigned = classify_comments(source, blocks)
    note_match = V7_NOTE_RE.search(source)
    if not note_match:
        raise ValueError("The V7 resulting-contract note was not found")
    v7_note = note_match.group(0)

    migrations: dict[str, str] = {}
    for index, name in enumerate(NAMES):
        content = (
            "CREATE SCHEMA IF NOT EXISTS store;\n\n" if index == 0 else ""
        ) + blocks[index] + "\n"
        if index == 6:
            content += "\n" + v7_note + "\n"
        if assigned[index]:
            content += "\n" + "\n".join(assigned[index]) + "\n"
        if re.search(r"(?im)^\s*(BEGIN|COMMIT);\s*$", content):
            raise ValueError(f"Transaction wrapper leaked into {name}")
        migrations[name] = content

    if not migrations[NAMES[0]].startswith(
        "CREATE SCHEMA IF NOT EXISTS store;\n\nCREATE EXTENSION IF NOT EXISTS pgcrypto;"
    ):
        raise ValueError("V1 must start with schema, then extensions, before objects")

    hashes = {
        name: sha256(content.encode("utf-8"))
        for name, content in migrations.items()
    }
    lock_lines = [
        "schema_version: 1",
        f"source_repo: {SOURCE_REPO}",
        f"source_commit: {SOURCE_COMMIT}",
        f"source_path: {SOURCE_PATH}",
        f"source_sha256: {source_hash}",
        "migration_count: 7",
        "migrations:",
        *[f"  {name}: {hashes[name]}" for name in NAMES],
    ]
    lock = "\n".join(lock_lines) + "\n"
    return migrations, lock, hashes

def verify_hashes(migrations: dict[str, str], expected: dict[str, str]) -> None:
    for name, content in migrations.items():
        actual = sha256(content.encode("utf-8"))
        if actual != expected[name]:
            raise ValueError(f"SHA-256 mismatch for {name}: {actual} != {expected[name]}")

def write_outputs(migrations: dict[str, str], lock: str) -> None:
    MIGRATION_DIR.mkdir(parents=True, exist_ok=True)
    existing = {path.name for path in MIGRATION_DIR.glob("V*.sql")}
    unexpected = existing - set(NAMES)
    if unexpected:
        raise ValueError(f"Refusing to overwrite with unexpected migrations: {sorted(unexpected)}")
    for name, content in migrations.items():
        (MIGRATION_DIR / name).write_text(content, encoding="utf-8", newline="\n")
    LOCK_PATH.parent.mkdir(parents=True, exist_ok=True)
    LOCK_PATH.write_text(lock, encoding="utf-8", newline="\n")

def check_outputs(migrations: dict[str, str], lock: str) -> None:
    actual_names = sorted(path.name for path in MIGRATION_DIR.glob("V*.sql"))
    if actual_names != sorted(NAMES):
        raise ValueError(f"Expected exactly 7 migration files; found {actual_names}")
    for name, expected in migrations.items():
        path = MIGRATION_DIR / name
        actual = path.read_text(encoding="utf-8")
        if actual != expected:
            raise ValueError(f"Generated migration differs from pinned source: {path}")
    if not LOCK_PATH.exists() or LOCK_PATH.read_text(encoding="utf-8") != lock:
        raise ValueError("backend/db-source.lock does not match regenerated source and migration hashes")
    print("Verified pinned source and all 7 migration SHA-256 values.")

def run_self_test(migrations: dict[str, str], hashes: dict[str, str]) -> None:
    tampered = dict(migrations)
    first = NAMES[0]
    tampered[first] = tampered[first].replace(
        "CREATE SCHEMA", "CREATE XCHEMA", 1
    )
    try:
        verify_hashes(tampered, hashes)
    except ValueError:
        print("Tamper self-test passed: a one-character source change is rejected.")
        return
    raise AssertionError("Tamper self-test failed: modified migration was accepted")

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="verify checked-in migrations and lock")
    parser.add_argument("--self-test", action="store_true", help="prove a changed migration fails hash verification")
    args = parser.parse_args()
    try:
        migrations, lock, hashes = generate()
        if args.check:
            check_outputs(migrations, lock)
        else:
            write_outputs(migrations, lock)
            print("Generated 7 Flyway migrations and backend/db-source.lock.")
        if args.self_test:
            run_self_test(migrations, hashes)
    except (OSError, subprocess.CalledProcessError, UnicodeError, ValueError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
