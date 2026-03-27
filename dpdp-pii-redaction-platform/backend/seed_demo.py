import requests
import time
import os

BASE_URL = "http://127.0.0.1:8000/api/v1"

def seed():
    print("Initializing Demo Data Seed...")
    try:
        res = requests.post(f"{BASE_URL}/auth/register", json={
            "email": "admin@dpdpshield.com",
            "full_name": "Admin User",
            "password": "password123"
        })
    except Exception:
        pass # Already exists or backend down

    res = requests.post(f"{BASE_URL}/auth/login", data={
        "username": "admin@dpdpshield.com",
        "password": "password123"
    })
    
    if res.status_code != 200:
        print("Failed to login as admin, skipping seed.")
        return
        
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    docs = [
        {"name": "employee_onboarding_form.txt", "content": "Welcome to the team! Your employee ID is EMP-9921. Please ensure your Aadhaar (1234 5678 9012) and PAN (ABCDE1234F) are submitted to HR by Friday. Contact hr@company.com for inquiries."},
        {"name": "customer_support_transcript.txt", "content": "Agent: How can I help you today? Customer: Hi, I'm calling about my account. My phone number is +91-9876543210 and my email is customer@gmail.com."},
        {"name": "financial_audit_q3.txt", "content": "Q3 Audit Report. High risk transactions identified from user 4921. Bank account number 4921 8421 9921 1121 must be verified. Tax ID: ABCD1234E."}
    ]
    
    import tempfile
    for doc in docs:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write(doc["content"])
            f.flush()
            temp_path = f.name
            
        with open(temp_path, "rb") as f:
            upload_res = requests.post(
                f"{BASE_URL}/upload/", 
                headers=headers, 
                files={"file": (doc["name"], f, "text/plain")}
            )
        
        os.remove(temp_path)
        
        if upload_res.status_code == 200:
            doc_id = upload_res.json()["id"]
            print(f"Uploaded {doc['name']} with ID {doc_id}")
            requests.post(f"{BASE_URL}/scan/{doc_id}", headers=headers)
            print(f"Scanned {doc['name']}")
            time.sleep(1)
            requests.post(f"{BASE_URL}/redact/{doc_id}?mode=FULL_MASK", headers=headers)
            print(f"Redacted {doc['name']}")
        else:
            print(f"Failed to upload {doc['name']}: {upload_res.text}")

    print("Demo Data Seed Complete. Login with admin@dpdpshield.com / password123")

if __name__ == "__main__":
    seed()
