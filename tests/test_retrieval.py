from src.chatbot.retail_context import retrieve


def test_return_window_finds_returns_policy():
    assert any("30 days" in s for s in retrieve("What is your return window?"))


def test_order_id_lookup():
    assert "In transit" in retrieve("where is ORD-1002")[0]


def test_shipping_question():
    assert any("Shipping policy" in s for s in retrieve("how long does shipping take"))
