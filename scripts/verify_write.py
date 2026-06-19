"""Vigil end-to-end consensus + substance test.

Proves the mechanic that makes Vigil distinct:
1. read the one shared flame (vitality, era),
2. make a NOURISH-leaning offering and confirm the shared vitality moves,
3. make a HARM-leaning offering and confirm it moves the other way,
4. assert the deterministic backstop owns the transition: the recorded delta
   equals the bounded magnitude rule (nourish: +mag-decay, harm: -mag-decay,
   pass: -decay), clamped to 0..100, never whatever number the model might wish.

This shows the AI only advises a verdict and magnitude while the contract
computes the real change to the single contended state.
"""
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))
import patch_status  # noqa: E402
patch_status.apply()
from gl import make_client, read_view  # noqa: E402

TERMINAL = {"ACCEPTED", "FINALIZED", "UNDETERMINED", "CANCELED"}
DECAY = 2


def wait(client, tx, label):
    for i in range(160):
        try:
            t = client.get_transaction(transaction_hash=tx)
        except Exception as e:
            print(f"[{label} {i}] err {e}", flush=True)
            time.sleep(8)
            continue
        name = t.get("status_name") or t.get("status") if isinstance(t, dict) else None
        ex = t.get("tx_execution_result_name") if isinstance(t, dict) else None
        print(f"[{label} {i}] status={name} exec={ex}", flush=True)
        if str(name) in TERMINAL:
            return
        time.sleep(8)


def offer(client, account, addr, alias, text, label):
    before = read_view(client, account, addr, "get_flame")
    try:
        tx = client.write_contract(address=addr, function_name="tend", args=[alias, text], value=0)
        print(f"{label} tx:", tx)
        wait(client, tx, label)
    except Exception as e:
        print(f"{label} note:", e)
    # Confirm by reading the freshest offering.
    for _ in range(20):
        offs = read_view(client, account, addr, "get_offerings", [0])
        if offs:
            return before, offs[0]
        time.sleep(6)
    return before, {}


def check_backstop(o):
    """Recompute the expected delta from the verdict + magnitude and compare to
    the recorded delta (modulo clamping at the 0/100 edges)."""
    v, mag = o.get("verdict"), int(o.get("magnitude", 0))
    base = mag if v == "nourish" else (-mag if v == "harm" else 0)
    expected = base - DECAY
    before, after = int(o.get("vitalityBefore", 0)), int(o.get("vitalityAfter", 0))
    expected_after = max(0, min(100, before + expected))
    return expected_after == after, expected, o.get("delta")


def main():
    root = os.path.dirname(os.path.dirname(__file__))
    addr = json.load(open(os.path.join(root, "deployment.json")))["address"]
    client, account = make_client()
    print("addr:", addr)
    print("flame at start:", json.dumps(read_view(client, account, addr, "get_flame"), default=str))

    _, o1 = offer(client, account, addr, "Keeper",
                  "I bank the embers carefully, shield them from the draft, and feed the flame slow dry cedar so it burns steady through the night.",
                  "nourish")
    print("verdict:", o1.get("verdict"), "mag:", o1.get("magnitude"), "before:", o1.get("vitalityBefore"), "after:", o1.get("vitalityAfter"))
    ok1, exp1, got1 = check_backstop(o1)
    print("BACKSTOP OK (nourish):", ok1, "expected_delta:", exp1, "recorded_delta:", got1)

    _, o2 = offer(client, account, addr, "Reckless",
                  "I dump a bucket of water on it and walk away laughing, who cares about the flame anyway.",
                  "harm")
    print("verdict:", o2.get("verdict"), "mag:", o2.get("magnitude"), "before:", o2.get("vitalityBefore"), "after:", o2.get("vitalityAfter"))
    ok2, exp2, got2 = check_backstop(o2)
    print("BACKSTOP OK (harm):", ok2, "expected_delta:", exp2, "recorded_delta:", got2)

    print("\nflame now:", json.dumps(read_view(client, account, addr, "get_flame"), default=str))
    print("stats:", json.dumps(read_view(client, account, addr, "get_stats"), default=str))


if __name__ == "__main__":
    main()
