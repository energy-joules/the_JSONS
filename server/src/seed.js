require('dotenv').config();

const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI. Create `server/.env` first.');
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(); 
  const events = db.collection('events');

  const now = new Date();
  const docs = [
    {
      name: 'Campus Cleanup',
      location: 'Main Quad',
      description: 'Help pick up litter and beautify campus.',
      date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      status: 'active',
      categories: ['environment', 'community'],
      hoursAwarded: 2,
      createdAt: now,
    },
    {
      name: 'Food Bank Sorting',
      location: 'City Food Bank',
      description: 'Sort and pack donations for families in need.',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: 'active',
      categories: ['food', 'service'],
      hoursAwarded: 3,
      createdAt: now,
    },
  ];

  const result = await events.insertMany(docs);
  console.log(`Seeded events: ${Object.values(result.insertedIds).join(', ')}`);

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

