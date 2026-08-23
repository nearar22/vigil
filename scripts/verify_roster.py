"""Studio proof for Vigil roster, rotation, and semantic novelty."""
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))
import patch_status  # noqa: E402
patch_status.apply()
from gl import make_client, read_view, load_secondary_pk  # noqa: E402
from genlayer_py import create_client, create_account  # noqa: E402
from genlayer_py.chains import studionet  # noqa: E402

TERMINAL = {"ACCEPTED", "FINALIZED", "UNDETERMINED", "CANCELED"}


def wait_tx(client, tx_hash, label):
    for attempt in range(120):
        tx = client.get_transaction(transaction_hash=tx_hash)
        status = str(tx.get("status_name") or tx.get("status") or "")
        print(f"[{label} {attempt}] {status}", flush=True)
        if status in TERMINAL:
            return {"hash": tx_hash, "status": status}
        time.sleep(6)
    raise TimeoutError(label)


def write(client, address, method, args, label):
    tx_hash = client.write_contract(address=address, function_name=method, args=args, value=0)
    print(label + ":", tx_hash, flush=True)
    return wait_tx(client, tx_hash, label)


def wait_offerings(client, account, address, count, tries=100):
    for attempt in range(tries):
        stats = read_view(client, account, address, "get_stats")
        if int(stats["offerings"]) >= count:
            return read_view(client, account, address, "get_offerings", [0])
        print(f"[offerings {attempt}] {stats['offerings']}/{count}", flush=True)
        time.sleep(5)
    raise TimeoutError("offering did not land")


def main():
    root = os.path.dirname(os.path.dirname(__file__))
    deployment = json.load(open(os.path.join(root, "deployment.json"), encoding="utf-8"))
    address = deployment["address"]
    primary_client, primary = make_client()
    secondary = create_account(account_private_key=load_secondary_pk())
    secondary_client = create_client(chain=studionet, account=secondary)
    outsider = create_account()
    outsider_client = create_client(chain=studionet, account=outsider)
    proof = {"contract": address, "deployment": deployment["tx"], "wallets": {
        "keeperA": primary.address, "keeperB": secondary.address, "outsider": outsider.address,
    }, "transactions": {}}

    roster = json.dumps([primary.address, secondary.address])
    proof["transactions"]["configureRoster"] = write(primary_client, address, "configure_roster", [roster], "configure-roster")
    live_roster = read_view(primary_client, primary, address, "get_roster")
    assert live_roster["sealed"] and len(live_roster["keepers"]) == 2

    try:
        proof["transactions"]["outsider"] = write(
            outsider_client, address, "tend",
            ["Outsider", "I carefully shield the flame with a glass lantern against the wind."],
            "outsider",
        )
    except Exception as error:
        proof["transactions"]["outsider"] = {"rejectedBeforeSubmission": str(error)}
    assert int(read_view(primary_client, primary, address, "get_stats")["offerings"]) == 0

    first_text = "I trim the wick, add dry cedar slowly, and shield the flame from the cold night wind."
    proof["transactions"]["keeperA"] = write(primary_client, address, "tend", ["Keeper A", first_text], "keeper-a")
    first = wait_offerings(primary_client, primary, address, 1)[0]

    try:
        proof["transactions"]["repeatTurn"] = write(
            primary_client, address, "tend",
            ["Keeper A", "I place another measured piece of dry cedar beside the protected flame."],
            "repeat-turn",
        )
    except Exception as error:
        proof["transactions"]["repeatTurn"] = {"rejectedBeforeSubmission": str(error)}
    assert int(read_view(primary_client, primary, address, "get_stats")["offerings"]) == 1

    paraphrase = "I guard the fire from the cold wind and feed it dry cedar after carefully trimming its wick."
    proof["transactions"]["semanticReplay"] = write(secondary_client, address, "tend", ["Keeper B", paraphrase], "semantic-replay")
    recent = wait_offerings(primary_client, primary, address, 2)
    second = recent[0]
    assert second["by"].lower() == secondary.address.lower()
    assert second["novel"] is False and second["verdict"] == "pass" and int(second["magnitude"]) == 0

    proof["assertions"] = {
        "sealedTwoKeeperRoster": True,
        "outsiderCannotTend": True,
        "sameWalletCannotTakeConsecutiveTurns": True,
        "semanticParaphraseDetected": True,
        "semanticReplayCannotIncreaseVitality": int(second["vitalityAfter"]) < int(second["vitalityBefore"]),
        "firstOfferingAudited": first["validatorAudit"]["semanticNovelty"] == "checked",
    }
    assert all(proof["assertions"].values()), proof["assertions"]
    with open(os.path.join(root, "scripts", "live_verification.json"), "w", encoding="utf-8") as handle:
        json.dump(proof, handle, indent=2, default=str)
    print(json.dumps(proof, indent=2, default=str))


if __name__ == "__main__":
    main()
