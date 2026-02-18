import httpx
import asyncio
import time

async def test_rate_limit():
    url = "http://localhost:8000/consultar/sri/1234567890"
    print(f"Testing Rate Limit on: {url}")
    
    async with httpx.AsyncClient() as client:
        for i in range(1, 6):
            start = time.time()
            try:
                response = await client.get(url)
                print(f"Request {i}: Status Code {response.status_code}")
                if response.status_code == 429:
                    print("✅ Rate limit triggered successfully!")
                elif response.status_code == 200:
                    print("Status 200: Request allowed.")
                else:
                    print(f"Unexpected status: {response.text}")
            except Exception as e:
                print(f"Request {i}: Error {e}")
            
            # Sleep briefly to ensure requests aren't *too* simulateous to cause other network errors, 
            # but usually rate limiters handle concurrent fine.
            # time.sleep(0.1) 

if __name__ == "__main__":
    asyncio.run(test_rate_limit())
