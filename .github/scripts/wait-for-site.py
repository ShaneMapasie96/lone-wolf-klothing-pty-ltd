"""Wait for the exact release over HTTPS, without accepting an older site."""
import os
import time
import urllib.error
import urllib.request

base_url = os.environ["SITE_URL"].rstrip("/")
expected = os.environ["DEPLOY_ID"]
deadline = time.monotonic() + 600
while time.monotonic() < deadline:
    url = f"{base_url}/deployment-version.txt?release={expected}&t={time.time_ns()}"
    try:
        request = urllib.request.Request(url, headers={"Cache-Control": "no-cache"})
        with urllib.request.urlopen(request, timeout=15) as response:
            actual = response.read().decode("utf-8").strip()
        if actual == expected:
            print(f"Confirmed release {expected} at {base_url}")
            break
        print("Waiting for the requested release to become visible...")
    except (urllib.error.URLError, TimeoutError, OSError) as error:
        print(f"Waiting for HTTPS deployment: {error}")
    time.sleep(10)
else:
    raise SystemExit(f"Requested release did not appear at {base_url} within 10 minutes")
