from src.chatbot.responder import is_safe

KB = "Refunds take 5 to 7 business days. Returns within 30 days. AeroRun Sneakers $89.99."


def test_grounded_reply_ok():
    assert is_safe("Refunds take 5 to 7 business days after we receive the item.", KB)


def test_invented_duration_blocked():
    assert not is_safe("You will get your money in 2 days.", KB)


def test_promise_blocked():
    assert not is_safe("I have issued a full refund for you.", KB)


def test_invented_price_blocked():
    assert not is_safe("It costs $50.", KB)
