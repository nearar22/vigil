# Vigil

*A caretaker's manual for the shared flame.*

There is one flame. It does not belong to you. It belongs to everyone who has
ever tended it and everyone who will. This manual explains what the flame is,
how to keep it alight, what kills it, and what happens when it dies. The flame
lives inside an Intelligent Contract on GenLayer Bradbury; this manual only
describes the rules the contract already enforces.

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

A leader proposes the verdict and magnitude; every validator re-reads the same
offering in the same flame condition. They must agree on the verdict exactly and
on the magnitude within a bounded tolerance, after which the deterministic
backstop above turns the agreed judgment into the one shared state change.

```python
def validator_fn(leaders_res):
    if not isinstance(leaders_res, gl.vm.Return):
        return _handle_leader_error(leaders_res, leader_fn)
    mine = leader_fn()
    theirs = leaders_res.calldata
    if not isinstance(theirs, dict):
        return False
    if mine["verdict"] != theirs.get("verdict"):          # nourish / pass / harm must match
        return False
    return abs(mine["magnitude"] - _coerce_magnitude(theirs.get("magnitude"))) <= 12

return gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
```

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

Nothing is wagered. There are no deposits and no value transfer; you pay only
the network fee to make an offering. The flame is essential to GenLayer because
its life depends on a subjective judgment (is this offering genuine care?) that
many independent validators must reproduce and agree on before the one shared
state moves. A single server with an AI could rate offerings, but then one
operator would privately own the only flame. Here no one does. The contract
holds it; a static frontend renders it as a single living light in the dark that
brightens, dims, and reddens with its on-chain vitality.

---

The flame burns on-chain at
[`0x73be85B98c3b7a0a4a25696E85A6ca410E95632E`](https://explorer-bradbury.genlayer.com/address/0x73be85B98c3b7a0a4a25696E85A6ca410E95632E),
first kindled in transaction
[`0x267df19bebaa845781691da0511edaf7d313d0ce8300a5fc8d88eed7db7143f6`](https://explorer-bradbury.genlayer.com/tx/0x267df19bebaa845781691da0511edaf7d313d0ce8300a5fc8d88eed7db7143f6).
The rules as the contract truly keeps them are in `contracts/contract.py`.
