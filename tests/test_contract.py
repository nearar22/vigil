import json
import sys


def deploy(direct_deploy):
    return direct_deploy("contracts/contract.py")


def enable_template(contract, monkeypatch):
    module = sys.modules[contract.__class__.__module__]
    monkeypatch.setattr(
        module.gl.eq_principle, "prompt_non_comparative", lambda fn, **_kwargs: fn()
    )


def mock_judgment(direct_vm, verdict, magnitude, reply="The warden records the tending."):
    direct_vm.mock_llm("WARDEN of a single shared FLAME", json.dumps({
        "verdict": verdict, "magnitude": magnitude, "reply": reply,
    }))


def test_offering_must_be_substantive(direct_vm, direct_deploy):
    contract = deploy(direct_deploy)
    with direct_vm.expect_revert("at least 12 characters"):
        contract.tend("Ash", "kind")


def test_weak_nourish_cannot_advance_streak(direct_vm, direct_deploy, monkeypatch):
    contract = deploy(direct_deploy)
    enable_template(contract, monkeypatch)
    mock_judgment(direct_vm, "nourish", 2)

    result = contract.tend("Keeper", "I shelter the flame from a passing cold wind.")

    assert result["flame"]["vitality"] == 60
    assert result["flame"]["nourishStreak"] == 0
    assert result["offering"]["effectiveNourish"] is False
    assert result["offering"]["streakAdvanced"] is False


def test_same_tender_cannot_farm_consecutive_streak_steps(
    direct_vm, direct_deploy, monkeypatch
):
    contract = deploy(direct_deploy)
    enable_template(contract, monkeypatch)
    mock_judgment(direct_vm, "nourish", 12)
    first = contract.tend("Keeper", "I trim the wick and place a clean glass shield around it.")
    direct_vm.clear_mocks()
    mock_judgment(direct_vm, "nourish", 12)
    second = contract.tend("Keeper", "I add dry cedar slowly so the flame remains steady and clear.")

    assert first["flame"]["nourishStreak"] == 1
    assert second["flame"]["nourishStreak"] == 1
    assert second["offering"]["streakAdvanced"] is False
    assert second["offering"]["validatorAudit"]["exactMagnitude"] == "checked"


def test_identical_consecutive_offering_is_rejected(direct_vm, direct_deploy, monkeypatch):
    contract = deploy(direct_deploy)
    enable_template(contract, monkeypatch)
    offering = "I protect the flame with a steady glass lantern through the rain."
    mock_judgment(direct_vm, "nourish", 10)
    contract.tend("Keeper", offering)
    direct_vm.clear_mocks()

    with direct_vm.expect_revert("Do not repeat the same offering"):
        contract.tend("Keeper", offering)


def test_death_seals_era_and_rekindles(
    direct_vm, direct_deploy, direct_alice, direct_bob, monkeypatch
):
    direct_vm.sender = direct_alice
    contract = deploy(direct_deploy)
    enable_template(contract, monkeypatch)
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
    assert contract.get_eras(0)[0]["era"] == 1
