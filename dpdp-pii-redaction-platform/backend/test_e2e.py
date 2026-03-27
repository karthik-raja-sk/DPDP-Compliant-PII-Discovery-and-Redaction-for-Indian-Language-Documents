import os
import requests
import time
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

def run_tests():
    print("Testing Auth...")
    email = f"test_{int(time.time())}@example.com"
    pwd = "password123"
    
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "full_name": "Test User",
        "password": pwd
    })
    
    assert res.status_code == 200, f"Register failed: {res.text}"
    
    res = requests.post(f"{BASE_URL}/auth/login", data={
        "username": email,
        "password": pwd
    })
    
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    print("Testing Upload...")
    import fitz  # PyMuPDF
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), "Hello, my Aadhaar is 1234 5678 9012 and my PAN is ABCDE1234F. Stay safe.")
    test_pdf_path = "test_document.pdf"
    doc.save(test_pdf_path)
    doc.close()
    
    with open(test_pdf_path, "rb") as f:
        res = requests.post(f"{BASE_URL}/upload/", headers=headers, files={"file": ("test_document.pdf", f, "application/pdf")})
    
    assert res.status_code == 200, f"Upload failed: {res.text}"
    doc_id = res.json()["id"]
    print(f"Uploaded doc ID: {doc_id}")
    
    print("Testing Scan...")
    res = requests.post(f"{BASE_URL}/scan/{doc_id}", headers=headers)
    assert res.status_code == 200, f"Scan start failed: {res.text}"
    
    # Wait a bit for scan to finish since we might be in fallback mode
    time.sleep(2)
    
    print("Testing Entities Fetch...")
    res = requests.get(f"{BASE_URL}/scan/{doc_id}/entities", headers=headers)
    assert res.status_code == 200, f"Entities fetch failed: {res.text}"
    entities = res.json()
    print(f"Entities found: {len(entities)}")
    
    print("Testing Pagination...")
    res = requests.get(f"{BASE_URL}/upload/?page=1&limit=5", headers=headers)
    assert res.status_code == 200, f"Pagination failed: {res.text}"
    assert "total" in res.json(), "Pagination metadata missing"
    
    print("Testing Redaction API...")
    res = requests.post(f"{BASE_URL}/redact/{doc_id}?mode=FULL_MASK", headers=headers)
    assert res.status_code == 200, f"Redact failed: {res.text}"
    
    print("Testing Original Download Endpoint...")
    res = requests.get(f"{BASE_URL}/upload/{doc_id}/original?token={token}")
    assert res.status_code == 200, f"Original download failed: {res.status_code}"
    assert len(res.content) > 0
    
    print("Testing Redacted Download Endpoint...")
    res = requests.get(f"{BASE_URL}/upload/{doc_id}/redacted?token={token}")
    assert res.status_code == 200, f"Redacted download failed: {res.text}"
    assert len(res.content) > 0
    
    print("All tests passed!")
    
if __name__ == "__main__":
    run_tests()
