import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import database from './db.config.js';
import {
  Employee,
  Organization,
  Client,
  HarmReduction,
  Meal,
  CoreActivity,
  ProjectActivity,
  Referral,
  SpecialEvent,
  ProjectActivityParticipants,
  CoreActivityParticipants
} from './models/index.js';
import {
  GENDER,
  RELATIONSHIP,
  MEAL_TYPE,
  PROJECT_ACTIVITY,
  SPECIAL_EVENT,
  CORE_ACTIVITY,
  HARM_REDUCTION_KIT
} from './enum-constants.js';
import {getAge } from '../utils/index.js';


// Database Table Associations
import './associations.js';
import './hooks.js';

faker.setLocale('en_CA');

async function setupUser() {
  const org = await Organization.create({
    name: 'Syme Woolner',
    location: 'Toronto, ON'
  });

  await Employee.create({
    first_name: 'test',
    last_name: 'test',
    username: 'test',
    email: 'test@test.com',
    password: bcrypt.hashSync('testtest'),
    role: 'Admin',
    org: org.id
  });
}

async function generateClients(size) {
  const client_ids = [];
  for (; size > 0; --size) {
    const client_bday = faker.date.between(
      '1940-01-01T00:00:00.000Z',
      '2022-12-31T23:59:59.999Z'
    );
    const client = await Client.create({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      date_of_birth: client_bday,
      age: getAge(client_bday),
      gender: GENDER[Math.floor(Math.random() * GENDER.length)],
      address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()}`,
      postal_code: faker.address.zipCode('?#?#?#'),
      number_of_children: Math.floor(Math.random() * 5),
      number_of_adults: Math.floor(Math.random() * 5),
      total_family_members: Math.floor(Math.random() * 10),
      contact_number: faker.phone.number('##########'),
      emergency_contact_number: faker.phone.number('##########'),
      emergency_contact_relationship:
        RELATIONSHIP[Math.floor(Math.random() * RELATIONSHIP.length)]
    });
    client_ids.push(client.id);
  }
  return client_ids;
}

const createRandomDate = () =>
  faker.date.between('2020-01-01T00:00:00.000Z', '2023-12-31T00:00:00.000Z');

async function generateFakeData(size) {
  const CLIENT_IDS = await generateClients(size);

  for (; size > 0; --size) {
    let created = null;

    // Meal Records
    let service_date = createRandomDate();
    await Meal.create({
      date: service_date,
      type: MEAL_TYPE[Math.floor(Math.random() * MEAL_TYPE.length)],
      number_of_clients: Math.floor(Math.random() * 100 + 20)
    });

    // Referral Records
    service_date = createRandomDate();
    await Referral.create({
      date: service_date,
      description: faker.random.words(5),
      shelter_count: math.floor(math.random.random()*100),
      housing_count: math.floor(math.random.random()*100),
      mental_health_count: math.floor(math.random.random()*100),
      medical_services_count: math.floor(math.random.random()*100),
      income_support_count: math.floor(math.random.random()*100),
      legal_services_count: math.floor(math.random.random()*100),
      settlement_services_count: math.floor(math.random.random()*100),
      harm_reduction_services_count: math.floor(math.random.random()*100),
      employment_supports_count: math.floor(math.random.random()*100),
      food_bank_count: math.floor(math.random.random()*100),
      meal_service_count: math.floor(math.random.random()*100),
      id_clinic_count: math.floor(math.random.random()*100),
      other_count: math.floor(math.random.random()*100),
    });

    // Activity Records
    service_date = createRandomDate();
    created = await ProjectActivity.create({
      date: service_date,
      type: PROJECT_ACTIVITY[
        Math.floor(Math.random() * PROJECT_ACTIVITY.length)
      ],
      description: faker.random.words(5)
    });
    let ids = [...CLIENT_IDS];
    for (let i = 0; i < 5; ++i) {
      const id = ids[Math.floor(Math.random() * ids.length)];
      await ProjectActivityParticipants.create({
        project_activity_id: created.id,
        client_id: id
      });
      ids = ids.filter((client_id) => client_id !== id);
    }

    // Core Activity Records
    service_date = createRandomDate();
    created = await CoreActivity.create({
      date: service_date,
      type: CORE_ACTIVITY[Math.floor(Math.random() * CORE_ACTIVITY.length)]
    });
    ids = [...CLIENT_IDS];
    for (let i = 0; i < 5; ++i) {
      const id = ids[Math.floor(Math.random() * ids.length)];
      await CoreActivityParticipants.create({
        core_activity_id: created.id,
        client_id: id
      });
      ids = ids.filter((client_id) => client_id !== id);
    }

    // Event Records
    service_date = createRandomDate();
    await SpecialEvent.create({
      date: service_date,
      type: SPECIAL_EVENT[Math.floor(Math.random() * SPECIAL_EVENT.length)],
      number_of_clients: Math.floor(Math.random() * 100 + 20)
    });

    // Harm Reduction Records
    service_date = createRandomDate();
    await HarmReduction.create({
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      date: service_date,
      client_initials: faker.random.alpha({ count: 2, casing: 'upper' }),
      year_of_birth: faker.date
        .between('1940-01-01T00:00:00.000Z', '1999-12-31T23:59:59.999Z')
        .getFullYear(),
      gender: GENDER[Math.floor(Math.random() * GENDER.length)],
      collection_for: faker.random.words(5),
      kit_type:
        HARM_REDUCTION_KIT[
          Math.floor(Math.random() * HARM_REDUCTION_KIT.length)
        ],
      client_id: CLIENT_IDS[Math.floor(Math.random() * CLIENT_IDS.length)]
    });
  }
}

async function setup(size) {
  // await database.sync({ force: true });
  await setupUser();
  // await generateFakeData(size);
}

config();
if (process.env.NODE_ENV !== 'development') {
  console.error('THIS SCRIPT CAN ONLY BE RUN IN DEVELOPMENT MODE!!');
  process.exit(1);
}
let count = parseInt(process.argv[2]);
if (!count) {
  count = 20;
  console.log('Generating data with default size 20');
} else {
  console.log(`Generating data with size ${count}`);
}
setup(count);
console.log(`Generated ${count} records for each table successfully.`);
