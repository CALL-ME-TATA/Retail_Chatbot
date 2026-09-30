from src.sentiment.predict import predict


def test_polarity():  # downloads the model on first run
    assert predict("This is terrible, I hate it")["label"] == "negative"
    assert predict("I love this, wonderful!")["label"] == "positive"
