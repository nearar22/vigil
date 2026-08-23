import json
import sys


def address(value):
    if hasattr(value, "as_hex"):
        return value.as_hex
    if isinstance(value, (bytes, bytearray)):
        return "0x" + bytes(value).hex()
    return str(value)


def deploy(direct_vm, direct_deploy, owner, other):
    direct_vm.sender = owner
    contract = direct_deploy("contracts/contract.py")
    contract.configure_roster(json.dumps([address(owner), address(other)]))
    return contract


def enable_template(contract, monkeypatch):
    module = sys.modules[contract.__class__.__module__]

    def studio_compatible(fn, **_kwargs):
        produced = fn()
        assert isinstance(produced, str)
        return produced

    monkeypatch.setattr(module.gl.eq_principle, "prompt_non_comparative", studio_compatible)


def mock_judgment(direct_vm, verdict, magnitude, reply="The warden records the tending.", novel=True, similar_to=""):
    direct_vm.mock_llm("WARDEN of a single shared FLAME", json.dumps({
        "verdict": verdict, "magnitude": magnitude, "novel": novel,
        "similarTo": similar_to, "reply": reply,
    }))


def test_roster_is_owner_configured_once(direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie):
    direct_vm.sender = direct_alice
    contract = direct_deploy("contracts/contract.py")
    direct_vm.sender = direct_bob
    with direct_vm.expect_revert("Only the owner"):
        contract.configure_roster(json.dumps([address(direct_alice), address(direct_bob)]))
    direct_vm.sender = direct_alice
    assert contract.configure_roster(json.dumps([address(direct_alice), address(direct_bob)]))["sealed"] is True
    with direct_vm.expect_revert("already sealed"):
        contract.configure_roster(json.dumps([address(direct_alice), address(direct_charlie)]))


def test_outsider_cannot_tend(direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie):
    contract = deploy(direct_vm, direct_deploy, direct_alice, direct_bob)
    direct_vm.sender = direct_charlie
    with direct_vm.expect_revert("not an authorized keeper"):
        contract.tend("Outsider", "I carefully shield the flame from the cold wind.")


def test_offering_must_match_contract_minimum(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = deploy(direct_vm, direct_deploy, direct_alice, direct_bob)
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("at least 12 characters"):
        contract.tend("Ash", "kind")


def test_keeper_rotation_blocks_single_wallet_farming(direct_vm, direct_deploy, direct_alice, direct_bob, monkeypatch):
    contract = deploy(direct_vm, direct_deploy, direct_alice, direct_bob)
    enable_template(contract, monkeypatch)
    direct_vm.sender = direct_alice
    mock_judgment(direct_vm, "nourish", 12)
    contract.tend("Keeper A", "I trim the wick and place a clean glass shield around it.")
    direct_vm.clear_mocks()
    with direct_vm.expect_revert("Another keeper must tend"):
        contract.tend("Keeper A", "I bank dry cedar beside the flame for the night.")


def test_exact_replay_is_global_across_wallets(direct_vm, direct_deploy, direct_alice, direct_bob, monkeypatch):
    contract = deploy(direct_vm, direct_deploy, direct_alice, direct_bob)
    enable_template(contract, monkeypatch)
    offering = "I protect the flame with a steady glass lantern through the rain."
    direct_vm.sender = direct_alice
    mock_judgment(direct_vm, "nourish", 10)
    contract.tend("Keeper A", offering)
    direct_vm.clear_mocks()
    direct_vm.sender = direct_bob
    with direct_vm.expect_revert("exact offering was already recorded"):
        contract.tend("Keeper B", offering)


def test_semantic_paraphrase_is_forced_to_zero_value_pass(direct_vm, direct_deploy, direct_alice, direct_bob, monkeypatch):
    contract = deploy(direct_vm, direct_deploy, direct_alice, direct_bob)
    enable_template(contract, monkeypatch)
    direct_vm.sender = direct_alice
    mock_judgment(direct_vm, "nourish", 14)
    first = contract.tend("Keeper A", "I place a glass wind shield around the flame during the rain.")
    direct_vm.clear_mocks()
    direct_vm.sender = direct_bob
    mock_judgment(direct_vm, "nourish", 20, novel=False, similar_to=first["offering"]["id"])
    replay = contract.tend("Keeper B", "I guard the fire from rain and wind beneath a clear glass cover.")
    assert replay["offering"]["novel"] is False
    assert replay["offering"]["verdict"] == "pass"
    assert replay["offering"]["magnitude"] == 0
    assert replay["offering"]["delta"] == -2


def test_weak_nourish_cannot_advance_streak(direct_vm, direct_deploy, direct_alice, direct_bob, monkeypatch):
    contract = deploy(direct_vm, direct_deploy, direct_alice, direct_bob)
    enable_template(contract, monkeypatch)
    direct_vm.sender = direct_alice
    mock_judgment(direct_vm, "nourish", 2)
    result = contract.tend("Keeper", "I shelter the flame from a passing cold wind.")
    assert result["flame"]["vitality"] == 60
    assert result["flame"]["nourishStreak"] == 0
    assert result["offering"]["effectiveNourish"] is False


def test_death_seals_era_and_rekindles(direct_vm, direct_deploy, direct_alice, direct_bob, monkeypatch):
    contract = deploy(direct_vm, direct_deploy, direct_alice, direct_bob)
    enable_template(contract, monkeypatch)
    direct_vm.sender = direct_alice
    mock_judgment(direct_vm, "harm", 40, "The offering smothers the shared flame.")
    contract.tend("Saboteur", "I pour cold water directly over the flame and scatter the embers.")
    direct_vm.clear_mocks()
    direct_vm.sender = direct_bob
    mock_judgment(direct_vm, "harm", 40, "The final ember is deliberately crushed.")
    result = contract.tend("Breaker", "I crush every remaining ember beneath a wet iron cover.")
    assert result["died"] is True
    assert result["flame"]["era"] == 2
    assert result["flame"]["vitality"] == 60
    assert contract.get_stats()["deaths"] == 1
