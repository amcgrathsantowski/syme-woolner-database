# Syme-Woolner Full-Stack App

## Setup

### Install Node.js

Go to the Node.js website at https://nodejs.org/en/download

Find the latest subversion from **Version 16**.

Download the latest subversion from **Version 16**, it is important to use **V16** since the Sequelize ORM is not compatible with later versions of _Node.js_

Run the installer and follow the instructions to install Node.js.

### Install MySQL and Workbench

Go to the MySQL website at https://dev.mysql.com/downloads/workbench/

Select your operating system and download the appropriate installer.

Run the installer and follow the instructions to install MySQL and Workbench.

For Linux Users you can install `mysql-server` using your distribution package manager.

Debian/Ubuntu (.deb):

```bash
sudo apt-get install mysql
```

RedHat/Fedora (.rpm):

```bash
sudo dnf install mysql-community-server
```

Upon successful installation, create a novel database user other than the default `root` account, then proceed to log into the **MySQL** database either through the terminal or **Workbench** and execute the following script:

```sql
CREATE DATABASE symewoolner;
```

### Install Dependencies

Navigate to the project directory and run the following command in your terminal window:

```bash
npm install
```

This will install all the necessary dependencies for the server and client applications.

### Setting Up (.env)

Make use of `.env.example` as a template to provide the necessary environment variables. It is important to note that instructions related to the input of the variables have been specified alongside each variable name within `.env.example`.

### Generating Token Secrets

To generate **Access**, **Refresh** and **Password** token secrets, follow these commands in your terminal:

1. Launch Node.js using the following command in the terminal:

```bash
node
```

2. Run the following command **THREE (3)** times to generate the secrets:

```javascript
console.log(require('crypto').randomBytes(64).toString('hex'));
```

3. Paste the 3 generated random hex strings into `.env`. Use `.env.example` for reference.

### Initializing Dev Environment

#### WARNING!!!: Be advised that the following section is intended strictly for developer purposes. It is imperative to note that under no circumstances should the `db-setup` script be executed within a production environment, as it will result in the complete erasure of all records present within the database. An execution guard is implemented which will terminate the process if an attempt to run this script is made outside development mode. Proceed with caution and exercise your own discretion.

To setup the database and generate fake data for development testing, run the following command in your terminal window.

```bash
npm run db-setup <number-of-records-to-create>
```

In the event that the above script fails to run, you may need to open **MySQL** from the terminal or using **Workbench** and run the following script:

```sql
DROP DATABASE symewoolner;
CREATE DATABASE symewoolner;
```

The script itself is designed to generate a specified number of records for each database model, which are subsequently inserted into the database. The number of records to be generated is specified as a command-line argument, and if no argument is provided, the script will default to generating 20 records for each model. The script will also generate a test user account with admin access with the following credentials:

**Email**: `test@test.com`

**Username**: `test`

**Password**: `testtest`

The server allows the user to log-in using either their email or username, and the test account is intended to demonstrate this functionality as well as all other application features that may not all appear for a normal user. The `Admin` role user has access to all features of the application and is the only user that can create new users and assign them roles. A second `Admin` role cannot be created through the application, but can be created manually through the database and requires manual password encryption.

## Available Scripts

> ```bash
> npm run dev
> ```
>
> The above script makes use of the `concurrently` module for **Node.js**, which enables the simultaneous launching of both the server and client through a single command. It is important to note that this feature is exclusively intended for developers. The script itself is designed to initiate the server and client in development mode, and additionally utilize `cors` to enable communication between the two applications during the development phase.

> ```bash
> npm run db-setup <number-of-records-to-create>
> ```
>
> It is crucial to acknowledge that the above script is dangerous carries significant risk and must strictly be employed during development stages. **Execution of this script will result in the elimination of all pre-existing tables within the database and replace them with newly generated data**, which adheres to the database models declared in `/api/database/models`. An execution guard is implemented which will terminate the process if an attempt to run this script is made outside development mode. Proceed with caution and exercise your own discretion.
>
> The script itself is designed to generate a specified number of records for each database model, which are subsequently inserted into the database. The number of records to be generated is specified as a command-line argument, and if no argument is provided, the script will default to generating 20 records for each model. The script will also generate a test user account with admin access with the following credentials:
>
> **Email**: `test@test.com`
>
> **Username**: `test`
>
> **Password**: `testtest`

> ```bash
> npm start
> ```
>
> The above script acts as the designated launcher for the application's production mode. It serves as the program's entry point and subsequently acts as the starting mechanism for the application. Prior to launching this script, it is essential to ensure that `npm run build` has been executed to guarantee the most recent production build of the **React** client application. It is essential to note that `cors` is no longer utilized with the current script, and any attempts to communicate with the server from a development phase application will be rejected. This security measure is in place to safeguard the application and enforce its security protocols, as well as allow for the use of secure cookies.

> ```bash
> npm run build
> ```
>
> When the above script is executed, the **React** application will be compiled into a production-ready format. This involves the generation of optimized and minified files that are better suited for efficient distribution and execution in a production environment. This command is especially useful when preparing to deploy an application to a web server or hosting platform. Once executed, the script will create a `dist` directory inside the `public` directory, which will contain the necessary files and assets required to serve the client application in production mode.

> ```bash
> npm run lint
> ```
>
> Upon execution of the above script, the application's codebase will undergo a static analysis using **ESLint**. This process assists in identifying and highlighting issues within the code, such as syntax errors, coding inconsistencies, and other potential problems that could impede the code's functionality or maintainability. The **ESLint** tool helps ensure that the codebase conforms to industry-standard coding practices and is optimized for performance. It is a useful utility for detecting potential issues before they manifest into critical errors, reducing development time and minimizing the risk of encountering issues during the production stage.

> ```bash
> npm run preview
> ```
>
> The above script is dependent upon the successful execution of `npm run build`. The script utilizes the compiled **React** code to create a preview that emulates the production environment and enables the assessment of the application's appearance and functionality. The server and client run separately during preview mode, and `cors` is enabled to allow communication between the two applications.

> ```bash
> npm run test
> ```
>
> The Above script will execute all tests and show the results in the terminal. It is important to note that the script will not terminate upon completion, and will instead continue to run in watch mode. This feature is especially useful during development, as it allows for the continuous execution of tests as the codebase is modified.
