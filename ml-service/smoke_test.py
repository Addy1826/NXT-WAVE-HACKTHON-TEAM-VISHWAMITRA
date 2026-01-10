from fastapi.testclient import TestClient
from main import app


def run_smoke_tests() -> None:
    client = TestClient(app)

    # GET /health
    r1 = client.get("/health")
    print("HEALTH_STATUS", r1.status_code)
    print(r1.json())

    # POST /analyze/message
    headers = {"Authorization": "Bearer test-token"}
    payload = {
        "text": "I feel hopeless and want to end it all.",
        "language": "en",
        "context": {"previous_crisis_count": 1},
        "user_id": "smoke-test-user",
    }
    r2 = client.post("/analyze/message", headers=headers, json=payload)
    print("ANALYZE_STATUS", r2.status_code)
    print(r2.json())


if __name__ == "__main__":
    run_smoke_tests()


