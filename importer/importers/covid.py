import asyncio


class CovidImporter:
    def __init__(self):
        self._in_progress = False

    async def import_stats(self):
        self._in_progress = True
        print("starting fetch covid19")
        await asyncio.sleep(10)
        print("finishing fetch covid19")
        self._in_progress = False

    @property
    def in_progress(self):
        return self._in_progress
