import requests
import time

def check():
    try:
        r = requests.get("http://localhost:8000/")
        print(f"Index: {r.status_code} - {r.json()}")
        r = requests.get("http://localhost:8000/api/v1/live/status")
        print(f"Status: {r.status_code} - {r.json()}")
    except Exception as e:
        print(f"Error connecting to backend: {e}")

if __name__ == "__main__":
    check()
