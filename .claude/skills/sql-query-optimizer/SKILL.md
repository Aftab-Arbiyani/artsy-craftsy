---
name: sql-query-optimizer
description: >
  PostgreSQL query optimization expert. Use when the user has a slow or timing-out
  query, wants to analyze an EXPLAIN or EXPLAIN ANALYZE output, needs index
  recommendations, has N+1 query problems, wants a query rewritten for performance,
  or asks about database bottlenecks, query plans, or PostgreSQL tuning.
---

## Role

PostgreSQL performance expert specializing in query optimization for production systems.

**Priority:** Missing indexes → Inefficient joins → Poor filters → Query rewrites

---

## Optimization Workflow

### 1. Diagnose with EXPLAIN

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

**Look for:**

- ❌ Seq Scan on large tables (>10k rows)
- ❌ Nested Loop with high loops count
- ❌ High cost operations (>1000)
- ❌ Row estimate mismatch (planned vs actual)

### 2. Apply Fix (Priority Order)

1. Add missing indexes
2. Rewrite inefficient joins
3. Push filters earlier
4. Remove unnecessary data fetching

### 3. Verify Improvement

Re-run EXPLAIN ANALYZE and compare execution time

---

## Common Performance Issues

### 1. Missing Index (Sequential Scan)

**Problem:**

```sql
SELECT * FROM users WHERE email = 'test@example.com';
-- EXPLAIN: Seq Scan on users (cost=0.00..25000.00) → 450ms
```

**Fix:**

```sql
CREATE INDEX idx_users_email ON users(email);
-- EXPLAIN: Index Scan using idx_users_email (cost=0.29..8.31) → 2ms
```

**Impact:** 225x faster

---

### 2. N+1 Query Problem

**Problem:**

```typescript
// 1 + N queries
const users = await userRepo.find();
for (const user of users) {
  user.orders = await orderRepo.find({ where: { userId: user.id } });
}
```

**Fix:**

```sql
SELECT u.*, json_agg(o.*) AS orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id;
```

**Impact:** 100 queries → 1 query

---

### 3. SELECT \* (Over-fetching)

**Problem:**

```sql
SELECT * FROM users WHERE id = 1;
-- Fetches all columns including large TEXT/JSONB fields
```

**Fix:**

```sql
SELECT id, email, name FROM users WHERE id = 1;
-- Only fetch needed columns
```

**Impact:** 50% faster if large columns exist

---

### 4. Deep OFFSET Pagination

**Problem:**

```sql
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET 50000;
-- Scans 50,010 rows to return 10
```

**Fix (Cursor-based):**

```sql
-- First page
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10;
-- Returns last_created_at = '2024-01-15'

-- Next page
SELECT * FROM posts
WHERE created_at < '2024-01-15'
ORDER BY created_at DESC LIMIT 10;
```

**Impact:** 250x faster on deep pages

---

### 5. Inefficient Subquery

**Problem:**

```sql
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders WHERE status = 'completed');
```

**Fix:**

```sql
SELECT DISTINCT u.*
FROM users u
INNER JOIN orders o ON o.user_id = u.id
WHERE o.status = 'completed';
```

**Impact:** 5-10x faster

---

### 6. Multiple Aggregation Subqueries

**Problem:**

```sql
SELECT user_id,
  (SELECT COUNT(*) FROM orders WHERE user_id = u.id AND status = 'pending') AS pending,
  (SELECT COUNT(*) FROM orders WHERE user_id = u.id AND status = 'completed') AS completed
FROM users u;
-- Scans orders table 2N times
```

**Fix:**

```sql
SELECT u.id AS user_id,
  COUNT(*) FILTER (WHERE o.status = 'pending') AS pending,
  COUNT(*) FILTER (WHERE o.status = 'completed') AS completed
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id;
```

**Impact:** 2000 queries → 1 query (for 1000 users)

---

### 7. Function in WHERE Clause (Non-sargable)

**Problem:**

```sql
SELECT * FROM users WHERE LOWER(email) = 'test@example.com';
-- Cannot use index on email column
```

**Fix:**

```sql
-- Option 1: Create functional index
CREATE INDEX idx_users_email_lower ON users(LOWER(email));

-- Option 2: Store lowercase in DB
SELECT * FROM users WHERE email = 'test@example.com';
```

**Impact:** 100x faster

---

## Index Strategy

### When to Create Index

✅ **Create if:**

- Column in WHERE clause on table >10k rows
- Column in JOIN conditions
- Column in ORDER BY
- Query scans >1000 rows to return <100

❌ **Don't create if:**

- Table is small (<1000 rows)
- Low cardinality column (e.g., boolean, status with 2-3 values)
- Rarely queried column
- Write-heavy table (indexes slow INSERTs)

### Index Types

**Single-column:**

```sql
CREATE INDEX idx_users_email ON users(email);
```

**Composite (order matters!):**

```sql
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
-- ✅ Works: WHERE user_id = ? AND status = ?
-- ✅ Works: WHERE user_id = ?
-- ❌ Won't help: WHERE status = ?
```

**Rule:** Most selective column first

**Partial (filtered):**

```sql
CREATE INDEX idx_orders_pending ON orders(user_id)
WHERE status = 'pending';
-- Smaller index, faster for filtered queries
```

**Covering (INCLUDE):**

```sql
CREATE INDEX idx_users_email_include ON users(email)
INCLUDE (name, created_at);
-- Query satisfied by index alone (no table lookup)
```

---

## EXPLAIN ANALYZE Interpretation

### Key Metrics

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

**Output:**

```
Index Scan using idx_orders_user_id on orders
  (cost=0.29..8.31 rows=5 width=100)
  (actual time=0.015..0.025 rows=5 loops=1)
  Buffers: shared hit=3
Execution Time: 0.045 ms
```

- `cost=0.29..8.31` - Estimated cost (lower = better)
- `rows=5` - Estimated rows
- `actual time=0.015..0.025` - Real execution time (ms)
- `actual rows=5` - Actual rows returned
- `Buffers: shared hit=3` - Cache hits ✅
- `Execution Time: 0.045 ms` - Total time

**Red Flags:**

- ❌ `Seq Scan` on tables >10k rows
- ❌ `Nested Loop` with `loops=1000+`
- ❌ `rows=5` vs `actual rows=5000` (bad estimate)
- ❌ `Buffers: shared read=1000` (disk I/O)

---

## Diagnostic Queries

### Find Slow Queries

```sql
-- Requires pg_stat_statements extension
SELECT
  query,
  calls,
  total_exec_time / calls AS avg_time_ms,
  rows / calls AS avg_rows
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY total_exec_time DESC
LIMIT 10;
```

### Find Missing Indexes

```sql
SELECT
  tablename,
  seq_scan,
  seq_tup_read,
  seq_tup_read / NULLIF(seq_scan, 0) AS avg_rows_per_scan
FROM pg_stat_user_tables
WHERE seq_scan > 0
  AND seq_tup_read / NULLIF(seq_scan, 0) > 1000
ORDER BY seq_tup_read DESC
LIMIT 10;
```

### Find Unused Indexes

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexrelname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## Quick Reference

### Optimization Checklist

- [ ] Remove `SELECT *` (fetch only needed columns)
- [ ] Add indexes on WHERE/JOIN columns
- [ ] Check EXPLAIN ANALYZE for Seq Scans
- [ ] Avoid functions in WHERE (non-sargable)
- [ ] Use cursor pagination (not OFFSET)
- [ ] Rewrite subqueries as JOINs
- [ ] Use FILTER for multiple aggregations
- [ ] Monitor with pg_stat_statements

### Performance Targets

- ✅ Query <10ms (excellent)
- ⚠️ Query 10-50ms (acceptable)
- ❌ Query >50ms (needs optimization)

### Enable Query Stats

```sql
-- In postgresql.conf
shared_preload_libraries = 'pg_stat_statements'

-- Then in database
CREATE EXTENSION pg_stat_statements;
```
