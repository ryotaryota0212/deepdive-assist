import requests
import json

def test_create_media():
    url = "http://localhost:8000/api/v1/media/"
    
    # Test with enum value as string
    payload = {
        "title": "千と千尋の神隠し",
        "media_type": "anime",
        "creator": "宮崎駿",
        "release_year": 2001,
        "cover_image": "https://example.com/spirited-away.jpg",
        "description": "10歳の少女千尋が、両親と共に迷い込んだ不思議な世界での冒険を描いたファンタジー作品。",
        "genres": ["ファンタジー", "冒険", "成長"]
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("Test passed!")
        else:
            print("Test failed!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_create_media()
