import json
import sqlite3

class KVStore:
    def __init__(self):
        self.connection = sqlite3.connect("kvstore.db")
        # self.cursor = self.connection.cursor()
        self.connection.execute('''
            CREATE TABLE IF NOT EXISTS kvstore (
                key TEXT PRIMARY KEY,
                value TEXT,
                last_updated TIMESTAMP
            )
        ''')
        self.connection.commit()

    async def set(self, key, value):
        now = sqlite3.datetime.datetime.now()
        json_value = json.dumps(value)
        self.connection.execute('''
            INSERT INTO kvstore (key, value, last_updated) 
            VALUES (?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET 
                value=excluded.value,
                last_updated=excluded.last_updated
        ''', (key, json_value, now))
        self.connection.commit()

    async def get(self, key):
        cursor = self.connection.execute('SELECT value FROM kvstore WHERE key = ?', (key,))
        row = cursor.fetchone()
        return row[0] if row else None
    