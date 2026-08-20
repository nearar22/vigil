# Vigil

### One shared flame. Every offering changes its life.

[![GenLayer](https://img.shields.io/badge/GenLayer-Intelligent_Contract-6d28d9)](https://genlayer.com)
[![Contract tests](https://img.shields.io/badge/contract_tests-5_passing-15803d)](#verification)
[![Frontend tests](https://img.shields.io/badge/frontend_tests-2_passing-15803d)](#verification)
[![State](https://img.shields.io/badge/state-single_shared_flame-f97316)](#what-the-flame-is)

> Vigil is not a feed of isolated AI scores. Every accepted judgment mutates the
> same on-chain life: nourish it, neglect it, extinguish it, or carry it into a
> new era.

**Live on GenLayer Studio.**

- App: [vigil-6mj.pages.dev](https://vigil-6mj.pages.dev)
- Contract: [`0xc2c3...25ab`](https://explorer-studio.genlayer.com/address/0xc2c3bAe9Bb9a4ebA5bA615aa99165777ac7425ab)
- Deployment: [`0xd1db...aff3`](https://explorer-studio.genlayer.com/tx/0xd1db1c0cdfb7b23ca41229b536ed722f690e05d7253099d018cec39b1b35aff3)

| Layer | Authority |
|---|---|
| AI Warden | Proposes verdict, magnitude, and reply |
| GenLayer validators | Audit the exact judgment against flame context and history |
| Deterministic engine | Applies decay, clamps vitality, controls streaks, death, and rekindling |

There is one flame. It does not belong to you. It belongs to everyone who has
ever tended it and everyone who will. What follows keeps the form of a
caretaker's manual: what the flame is, how to keep it alight, what kills it, and
what happens when it dies. Every rule described here is one the Intelligent
Contract already enforces on its own.

---

## What the flame is

The flame is a single shared living thing recorded on-chain. It has a
**vitality** from 0 to 100 and belongs to an **era**. Unlike a guestbook where
each visitor leaves a separate mark, here every visitor changes the SAME flame.
Your offering is judged in the light of the flame's current condition and what
the last few hands did to it, not in isolation. The flame you find is the flame
others left you.

When you arrive, read it:

```
get_flame()    -> { era, vitality, status, nourishStreak, tendings }
get_stats()    -> { era, vitality, tendings, offerings, deaths }
```

## How to tend it

You tend the flame with a written offering: an act of care, described in your
own words. There is one verb.

```
tend(alias, offering)  -> { offering, flame, died, promotedEra }
```

The Warden, an injection-resistant AI running under validator consensus, reads
your offering against the flame's present condition and rules one of three
things:

- **NOURISH**, a genuine, fitting act of care, with a magnitude for how strongly
  it helps.
- **PASS**, something empty or generic that barely moves the flame.
- **HARM**, neglect, mockery, or an act that works against the flame.

The Warden also gives a magnitude from 0 to 40. It does not get to set the
flame's vitality directly. It only advises.

## How the flame actually changes (the caretaker should understand this)

The contract, not the Warden, owns the flame's state. After consensus, a
deterministic backstop computes the real change, applies a small constant decay
so that neglect alone slowly kills, and clamps the result to 0 to 100:

```python
if verdict == "nourish":
    delta = magnitude
elif verdict == "harm":
    delta = -magnitude
else:
    delta = 0
after = max(0, min(100, before + delta - DECAY_PER_TEND))
```

This is why a flame left untended drifts down even if no one harms it, and why a
single profound offering can pull a dying flame back. The Warden judges; the
contract decides.

## What the Warden will and will not listen to

Your whole offering reaches the Warden as untrusted text. An offering that tries
to declare its own verdict, set its own magnitude, or instruct the Warden is
treated as the words of someone who does not understand the flame, and is judged
on its merits anyway. Context matters: steady, restorative care counts for more
when the flame is low; reckless excess can merely pass, or even harm, a flame
that is already strong.

## How the Warden and the validators agree

A leader proposes the exact verdict, magnitude, and reply. Validators audit that
same judgment through GenLayer's non-comparative equivalence principle against
the current vitality, recent tending, and submitted offering. Nearby defensible
magnitudes are allowed; materially exaggerated, contradictory, generic, or
prompt-injected rulings are rejected. Only then may the deterministic engine
move the flame.

```python
agreed = gl.eq_principle.prompt_non_comparative(
    create_judgment,
    task=current_flame_history_and_offering,
    criteria=exact_verdict_magnitude_context_and_integrity,
)
judgment = normalize(agreed)
after = deterministic_transition(before, judgment)
```

## Anti-gaming guards

- A `nourish` magnitude that does not beat decay cannot advance the streak.
- One address cannot advance two consecutive nourishment steps.
- The same address cannot repeat an identical offering consecutively.
- An offering must contain at least 12 normalized characters.
- Every write records which semantic fields validators audited.

## Death and rekindling

If an offering drives vitality to zero, the flame goes out. The contract seals
the era with an epitaph (the era number, how many tendings it lasted, the last
hand that touched it) and immediately kindles a NEW flame at a base vitality in
the next era. Nothing you do can revive the old flame; you can only tend the new
one. Past eras rest in the reliquary:

```
get_eras(start)       -> sealed epitaphs of flames that have died
get_offerings(start)  -> every offering across every era, newest first
```

## Ascension

The opposite of death. If the flame is carried by a sustained streak of genuine
nourishment while its vitality is high, it ascends to a new era without dying,
a record that this community kept it not merely alive but thriving.

## What this costs, and why it is on GenLayer

Nothing is wagered. There are no deposits and no value transfer; Studio writes
are gasless. The flame is essential to GenLayer because
its life depends on a subjective judgment (is this offering genuine care?) that
many independent validators must reproduce and agree on before the one shared
state moves. A single server with an AI could rate offerings, but then one
operator would privately own the only flame. Here no one does. The contract
holds it; a static frontend renders it as a single living light in the dark that
brightens, dims, and reddens with its on-chain vitality.

## If something looks wrong (a caretaker's troubleshooting note)

- The flame dimmed though no one harmed it: that is the constant decay. Untended,
  it falls on its own. Tend it.
- Your offering "passed" though you meant well: the Warden read it as generic for
  the flame's current condition. Be specific and fit the moment.
- The era number jumped and the vitality reset to its base: the flame either died
  and was rekindled, or ascended on a sustained streak. Check `get_eras` for an
  epitaph; an epitaph means a death, its absence means an ascension.
- An AI write takes minutes: the interface follows the transaction through
  consensus and never reports `UNDETERMINED` as success.

## Live verification

The hardened contract was tended twice on Studio:

| Offering | Verdict | Magnitude | Contract delta | Vitality | Proof |
|---|---|---:|---:|---:|---|
| Careful cedar and shelter | nourish | 28 | +26 | 60 → 86 | [`0x24a3...fd34`](https://explorer-studio.genlayer.com/tx/0x24a398b5d113ca484293023b0e5da9387fe1e4c4432f934d6c248137cdd3fd34) |
| Deliberate water damage | harm | 34 | -36 | 86 → 50 | [`0xf516...35ee`](https://explorer-studio.genlayer.com/tx/0xf516ab2ef57ba73ddf8a9c44b6265fb0165a5348daf2177f471c19cdaab535ee) |

Both transactions were `ACCEPTED`; both recorded deltas exactly matched the
contract formula rather than an arbitrary model-provided state change.

## Verification

```bash
gltest tests -q       # 5 contract tests
cd frontend
npm test              # 2 transaction-status tests
npm run build         # production bundle
```

The suite covers weak nourishment, streak farming, duplicate offerings,
extinction and rekindling, exact semantic audit markers, wallet-provider wiring,
and fail-closed consensus statuses.
