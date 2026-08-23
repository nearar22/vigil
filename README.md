# Vigil

### One shared flame. Every offering changes its life.

[![GenLayer](https://img.shields.io/badge/GenLayer-Intelligent_Contract-6d28d9)](https://genlayer.com)
[![Contract tests](https://img.shields.io/badge/contract_tests-8_passing-15803d)](#verification)
[![Frontend tests](https://img.shields.io/badge/frontend_tests-2_passing-15803d)](#verification)
[![State](https://img.shields.io/badge/state-single_shared_flame-f97316)](#what-the-flame-is)

> Vigil is not a feed of isolated AI scores. Every accepted judgment mutates the
> same on-chain life: nourish it, neglect it, extinguish it, or carry it into a
> new era.

**Live on GenLayer Studio.**

- App: [vigil-6mj.pages.dev](https://vigil-6mj.pages.dev)
- Contract: [`0xC632...DF84`](https://explorer-studio.genlayer.com/address/0xC6321AF4A0B3d4a479c09cbD72D8aB6E9DBDDF84)
- Deployment: [`0x5279...1119`](https://explorer-studio.genlayer.com/tx/0x5279b6eca95d3c39cad9777916621bd257494f10ed4221bf530644b639611119)

| Layer | Authority |
|---|---|
| AI Warden | Proposes verdict, magnitude, and reply |
| GenLayer validators | Audit the exact judgment against flame context and history |
| Deterministic engine | Applies decay, clamps vitality, controls streaks, death, and rekindling |
| Sealed keeper roster | Limits writes to named wallets and forces turn rotation |

There is one flame. It does not belong to one caller. A sealed roster of known
keepers alternates responsibility for it. What follows keeps the form of a
caretaker's manual: what the flame is, how to keep it alight, what kills it, and
what happens when it dies. Every rule described here is one the Intelligent
Contract already enforces on its own.

---

## What the flame is

The flame is a single shared living thing recorded on-chain. It has a
**vitality** from 0 to 100 and belongs to an **era**. Unlike a guestbook where
each visitor leaves a separate mark, here every authorized keeper changes the SAME flame.
Your offering is judged in the light of the flame's current condition and what
the last few hands did to it, not in isolation. The flame you find is the flame
others left you.

When you arrive, read it:

```
get_flame()    -> { era, vitality, status, nourishStreak, lastKeeper, tendings }
get_roster()   -> { keepers, sealed, lastKeeper }
get_stats()    -> { era, vitality, tendings, offerings, deaths, keepers }
```

## How to tend it

You tend the flame with a written offering: an act of care, described in your
own words. There is one verb.

```
tend(alias, offering)  -> { offering, flame, died, promotedEra }
```

The Warden, an injection-resistant AI running under validator consensus, first
checks whether the offering is a semantic replay of recent care, even when its
alias or wording changes. It then rules one of three things:

- **NOURISH**, a genuine, fitting act of care, with a magnitude for how strongly
  it helps.
- **PASS**, something empty or generic that barely moves the flame.
- **HARM**, neglect, mockery, or an act that works against the flame.

The Warden also gives a magnitude from 0 to 40. A semantic replay is forced by
code to `PASS` with magnitude `0`. The model never sets vitality directly.

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

This is why even a harmless tending still costs a little vitality, and why a
profound offering can pull a dying flame back. The Warden judges; the
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
- Only wallets in the one-time sealed keeper roster may tend.
- The same keeper cannot take two consecutive turns; another named keeper must act.
- An exact offering cannot be reused by any keeper, not merely the last sender.
- Validators compare meaning against recent acts; paraphrases become zero-value passes.
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
operator would privately own the only flame. Here the contract enforces the
published roster, rotation, and verdict; a static frontend renders the shared light that
brightens, dims, and reddens with its on-chain vitality.

## If something looks wrong (a caretaker's troubleshooting note)

- The flame dimmed though no one harmed it: every recorded tending pays the
  constant decay before its verdict is applied.
- Your offering "passed" though you meant well: the Warden read it as generic for
  the flame's current condition. Be specific and fit the moment.
- The era number jumped and the vitality reset to its base: the flame either died
  and was rekindled, or ascended on a sustained streak. Check `get_eras` for an
  epitaph; an epitaph means a death, its absence means an ascension.
- An AI write takes minutes: the interface follows the transaction through
  consensus and never reports `UNDETERMINED` as success.

## Live verification

The hardened lifecycle was executed on Studio with two named keepers and an
outsider. The roster was sealed in [`0x8c7d...b6ac`](https://explorer-studio.genlayer.com/tx/0x8c7d13161978ee4f5b73d2464fee285118cb9c13f3e7dedc98978ba62bffb6ac).
The outsider attempt [`0xe1e7...895e`](https://explorer-studio.genlayer.com/tx/0xe1e79525fb18b85b564ba2e11e530e50f6e377728b5726928dcfa247846b895e)
left the offering count at zero. Keeper A then tended in
[`0xbfb3...372b`](https://explorer-studio.genlayer.com/tx/0xbfb3924d701915ecdc4fcc7fa80c2157403b4182261236be263ce87c98ce372b).
A consecutive call from that same wallet in
[`0xfcc5...6161`](https://explorer-studio.genlayer.com/tx/0xfcc54f1560efd6685b28fff57a4587f4d2ba2f9a6bd101a8c02a3e58021d6161)
also left state unchanged. Keeper B submitted a paraphrase in
[`0xd687...23ae`](https://explorer-studio.genlayer.com/tx/0xd68735db06e6da6ee10a20ec9037f7a70c97a2fac376afe9912c63b07baa23ae);
validator consensus marked it non-novel, and code forced `PASS`, magnitude `0`,
so it could not farm vitality.

## Verification

```bash
gltest tests -q       # 8 contract tests
cd frontend
npm test              # 2 transaction-status tests
npm run build         # production bundle
```

The suite covers roster sealing, outsider rejection, turn rotation, global exact
replays, semantic paraphrases, weak nourishment, extinction and rekindling,
wallet-provider wiring, and fail-closed consensus statuses.
