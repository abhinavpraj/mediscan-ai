from app.services.clinical_summary import ClinicalSummaryGenerator
from app.services.report_parser import MedicalReportParser
from app.services.risk_engine import ClinicalRiskEngine


def test_report_parser() -> None:
    text = """
    Patient Name: Alice Smith
    Hb: 10.5
    Glucose: 150 mg/dL
    Cholesterol: 220
    Blood Pressure: 130/85
    """
    parser = MedicalReportParser()
    res = parser.parse(text)

    assert res["hemoglobin"] == 10.5
    assert res["glucose"] == 150.0
    assert res["cholesterol"] == 220.0
    assert res["blood_pressure"] == "130/85"


def test_risk_engine_normal() -> None:
    engine = ClinicalRiskEngine()
    evals = engine.evaluate_all(hb=14.0, glucose=90.0, cholesterol=180.0, bp="115/75")

    assert evals["overall_risk"] == "Low"
    assert len(evals["abnormal_parameters"]) == 0
    assert evals["confidence"] == 0.99


def test_risk_engine_abnormal() -> None:
    engine = ClinicalRiskEngine()

    # Low Hb and high glucose
    evals1 = engine.evaluate_all(hb=10.0, glucose=110.0, cholesterol=180.0, bp="115/75")
    assert evals1["overall_risk"] == "High"  # Glucose status High makes it High
    assert len(evals1["abnormal_parameters"]) == 2

    # Critical glucose
    evals2 = engine.evaluate_all(hb=14.0, glucose=130.0, cholesterol=180.0, bp="115/75")
    assert evals2["overall_risk"] == "Critical"
    assert len(evals2["abnormal_parameters"]) == 1

    # Moderate/Low risk (Low Hemoglobin only)
    evals3 = engine.evaluate_all(hb=11.0, glucose=90.0, cholesterol=180.0, bp="115/75")
    assert evals3["overall_risk"] == "Moderate"
    assert len(evals3["abnormal_parameters"]) == 1


def test_clinical_summary_generation() -> None:
    engine = ClinicalRiskEngine()
    summary_gen = ClinicalSummaryGenerator()

    # Normal case
    evals_normal = engine.evaluate_all(hb=14.0, glucose=90.0, cholesterol=180.0, bp="115/75")
    res_normal = summary_gen.generate(evals_normal, "all normal")
    assert "All evaluated" in res_normal["clinical_summary"][0]
    assert len(res_normal["recommendations"]) == 1

    # Abnormal case
    evals_abnormal = engine.evaluate_all(hb=10.2, glucose=162.0, cholesterol=250.0, bp="145/95")
    res_abnormal = summary_gen.generate(evals_abnormal, "multiple abnormal parameters")

    assert res_abnormal["overall_risk"] == "Critical"
    assert len(res_abnormal["clinical_summary"]) > 1
    # Check that recommendations for hb, glucose, cholesterol, and BP are mapped
    assert any("Complete Blood Count" in r for r in res_abnormal["recommendations"])
    assert any("fasting blood glucose" in r for r in res_abnormal["recommendations"])
    assert any("dietary lipid" in r for r in res_abnormal["recommendations"])
    assert any("blood pressure" in r for r in res_abnormal["recommendations"])
