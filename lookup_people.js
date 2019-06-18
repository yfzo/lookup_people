const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

const person = process.argv[2];

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  client.query("SELECT first_name, last_name, TO_CHAR(birthdate, 'yyyy-mm-dd') AS birthdate FROM famous_people WHERE first_name = $1 OR last_name = $1;", [person], (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }

    printResults(result);

    client.end();
  });

  console.log('Searching ...');
});

function printResults(result) {
  const numOfPeople = result.rowCount;

  console.log(`Found ${numOfPeople} person(s) by the name '${person}'`);
  for (let i = 0; i < result.rowCount; i++) {
    console.log(`- ${i+1}: ${result.rows[i].first_name} ${result.rows[i].last_name}, born '${result.rows[i].birthdate}'`);
  }
}