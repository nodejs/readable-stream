# endReadableNT teardown-tick benchmarks

These two scripts measure the `process.nextTick()` teardown cascade of a
short-lived, flowing `PassThrough -> Transform` pipeline — the shape produced
by e.g. a per-request or per-file streaming stage. They exist to demonstrate
the `endReadableNT` tick-dedup change to `lib/internal/streams/readable.js`.

They are **not** published to npm (the package `files` field only ships
`lib`, `LICENSE`, `README.md`).

## `endReadable-ticks.js`

Counts the exact number of `nextTick` hops one unit incurs, broken down by
call site, so the redundant `endReadableNT()` scheduling is visible.

```
node benchmark/endReadable-ticks.js [chunksPerUnit=4]
```

Compare base vs this change (the `lib/` change is the only tracked edit, so it
stashes cleanly while the untracked `benchmark/` dir stays put):

```
git stash push -- lib/internal/streams/readable.js
node benchmark/endReadable-ticks.js   # BASE
git stash pop
node benchmark/endReadable-ticks.js   # PATCHED
```

Expected (objectMode, 4 chunks):

| | total nextTick hops | `endReadableNT()` scheduled |
|--|--|--|
| base | 15 | 5x |
| patched | 12 | 2x |

The 3 removed hops are duplicate `endReadableNT()` ticks (base schedules it 3x
from `flow()` + 2x from `resume_()`; only one ever emits `'end'`). `'end'`
still fires exactly once, on the same tick — behaviour is unchanged.

## `endReadable-cpu.js`

CPU time (from `process.cpuUsage()`, an OS counter, more stable than wall time
on a loaded machine) for a wave of `N` short-lived units.

```
node --expose-gc benchmark/endReadable-cpu.js [units=8000] [chunksPerUnit=4] [reps=15]
```

Run it on both branches as above. A paired A/B run (base and patched loaded
side-by-side in one process, alternating rep-by-rep so shared-box drift
cancels) measured a **median ~4.5–7.7% CPU reduction with the patched build
faster in the large majority of paired reps** on a 2-core machine shared with
other load. The magnitude tracks the tick reduction (~20% fewer teardown
ticks on this shape).
