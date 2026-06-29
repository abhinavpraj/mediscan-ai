from app.services.extractor import MedicalExtractor


def test_extracts_blood_report_risk_flags() -> None:
    text = """
    Patient: John Doe
    Age: 45
    Gender: Male
    Hemoglobin: 11.2 g/dL
    Glucose: 132 mg/dL
    Cholesterol: 230
    Blood Pressure: 140/90
    """

    report = MedicalExtractor().extract(text)

    assert report.patient_name == "John Doe"
    assert report.age == 45
    assert report.gender == "Male"
    assert report.report_type == "Blood Report"
    assert "Possible Anemia" in report.risk_flags
    assert "High Glucose" in report.risk_flags
    assert "High Cholesterol" in report.risk_flags
    assert "Elevated Blood Pressure" in report.risk_flags


def test_classifies_prescription() -> None:
    report = MedicalExtractor().extract("Name: Mira Shah\nRx Tablet Metformin 500mg\nAge: 61\nSex: F")

    assert report.report_type == "Prescription"
    assert report.gender == "Female"
    assert report.medications == ["Metformin 500mg"]
