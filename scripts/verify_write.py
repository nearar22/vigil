"""Read-only verification of the deployed hardened Vigil lifecycle."""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from gl import make_client, read_view  # noqa: E402


def main():
    root = os.path.dirname(os.path.dirname(__file__))
    deployment = json.load(open(os.path.join(root, "deployment.json"), encoding="utf-8"))
    address = deployment["address"]
    client, account = make_client()
    roster = read_view(client, account, address, "get_roster")
    stats = read_view(client, account, address, "get_stats")
    offerings = read_view(client, account, address, "get_offerings", [0])
    assert roster["sealed"] is True and len(roster["keepers"]) == 2
    assert int(stats["offerings"]) >= 2 and len(offerings) >= 2
    replay = offerings[0]
    assert replay["novel"] is False
    assert replay["verdict"] == "pass" and int(replay["magnitude"]) == 0
    assert int(replay["vitalityAfter"]) < int(replay["vitalityBefore"])
    print(json.dumps({
        "contract": address,
        "roster": roster,
        "stats": stats,
        "semanticReplay": replay,
        "verified": True,
    }, indent=2, default=str))


if __name__ == "__main__":
    main()
