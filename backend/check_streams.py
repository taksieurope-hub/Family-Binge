import asyncio
from services.iptv_service import get_channels_by_category

async def main():
    for cat in ['news', 'sports', 'kids', 'documentary']:
        channels = await get_channels_by_category(cat)
        print(f'\n=== {cat.upper()} ===')
        for ch in channels[:5]:
            print(ch['name'] + ': ' + ch['stream_url'])

asyncio.run(main())
