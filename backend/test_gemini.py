from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key loaded: {api_key[:10]}...")

client = genai.Client(api_key=api_key)

# Try gemini-2.0-flash (stable)
try:
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Say hello"
    )
    print("Success with gemini-2.0-flash!")
    print("Response:", response.text)
except Exception as e:
    print(f"Error with gemini-2.0-flash: {e}")
    
    # Fallback to gemini-2.5-flash
    print("\nTrying gemini-2.5-flash...")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say hello"
    )
    print("Success with gemini-2.5-flash!")
    print("Response:", response.text)