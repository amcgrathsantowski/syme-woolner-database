import database from './db.config.js';
import bcrypt from 'bcryptjs';
import prompt from 'prompt';
import { Employee, Organization } from './models/index.js';

// start the prompt
prompt.start();

// define properties schema
const schema = {
  properties: {
    first_name: {
      description: 'First Name',
      pattern: /^[a-zA-Z'\-\s]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true
    },
    last_name: {
      description: 'Last Name',
      pattern: /^[a-zA-Z'\-\s]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true
    },
    username: {
      description: 'Username',
      pattern: /^[a-zA-Z0-9]+$/,
      message: 'Username must be only letters or numbers',
      required: true
    },
    email: {
      description: 'Email',
      pattern: /^\S+@\S+\.\S+$/,
      message: 'Email must be a valid email address',
      required: true
    },
    password: {
      description: 'Password',
      pattern: /^.{8,}$/,
      message: 'Password must be at least 8 characters',
      hidden: true,
      replace: '*'
    },
    confirm_password: {
      description: 'Confirm Password',
      hidden: true,
      replace: '*',
      conform: function (value) {
        const password = prompt.history('password').value;
        return value === password;
      },
      message: 'Passwords do not match'
    }
  }
};

async function setupUser(user) {
  await database.sync();

  let org;

  try {
    org = await Organization.create({
      name: 'Syme Woolner',
      location: 'Toronto, ON'
    });
  } catch {
    org = await Organization.findOne({ where: { name: 'Syme Woolner' } });
  }

  await Employee.create({
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    email: user.email,
    password: bcrypt.hashSync(user.password),
    role: 'Admin',
    org: org.id
  });

  database.close();

  console.log('Admin created successfully');
}
// ask the user for the input

prompt.get(schema, (err, result) => {
  if (err) {
    throw err;
  }
  delete result.confirm_password;
  setupUser(result);
});
