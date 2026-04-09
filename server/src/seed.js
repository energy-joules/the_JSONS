require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./db');
const Event = require('./models/event');

async function main() {
  await connectDB();

  const now = new Date();
  const fakeOrgId = new mongoose.Types.ObjectId();

  const docs = [
    {
      organizationID: fakeOrgId,
      name: 'Campus Cleanup',
      description: 'Help pick up litter and beautify the UF campus.',
      latitude: 29.6492,
      longitude: -82.3443,
      address: '1555 Inner Rd, Gainesville, FL 32611',
      date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      duration: 2,
      status: true,
    },
    {
      organizationID: fakeOrgId,
      name: 'Food Bank Sorting',
      description: 'Sort and pack donations for families in need.',
      latitude: 29.6516,
      longitude: -82.3248,
      address: '111 SE 1st Ave, Gainesville, FL 32601',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      duration: 3,
      status: true,
    },
    {
      organizationID: new mongoose.Types.ObjectId(),
      name: 'Depot Park Tree Planting',
      description: 'Plant native trees and restore green spaces at Depot Park.',
      latitude: 29.6433,
      longitude: -82.3194,
      address: '874 SE 4th St, Gainesville, FL 32601',
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      duration: 4,
      status: true,
    },
    {
      organizationID: new mongoose.Types.ObjectId(),
      name: 'Westside Park Youth Tutoring',
      description: 'Tutor local middle-school students in math and reading.',
      latitude: 29.6580,
      longitude: -82.3460,
      address: '1001 NW 34th St, Gainesville, FL 32605',
      date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      duration: 2,
      status: true,
    },
    {
      organizationID: fakeOrgId,
      name: 'Humane Society Dog Walking',
      description: 'Walk and socialize shelter dogs to improve adoption chances.',
      latitude: 29.6270,
      longitude: -82.3712,
      address: '3870 NW 17th Pl, Gainesville, FL 32605',
      date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      duration: 1.5,
      status: true,
    },
  ];

  const result = await Event.insertMany(docs);
  console.log(`Seeded ${result.length} events:`);
  result.forEach((e) => console.log(`  ${e._id} — ${e.name}`));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
