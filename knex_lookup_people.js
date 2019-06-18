const settings = require("./settings"); // settings.json
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : settings.hostname,
    user : settings.user,
    password : settings.password,
    database : settings.database
  }
});

const person = process.argv[2];

knex.select('first_name', 'last_name', knex.raw('TO_CHAR(birthdate, \'yyyy-mm-dd\') AS birthdate')).from('famous_people')
  .where('first_name', '=', person)
  .orWhere('last_name', '=', person)
  .asCallback((err, rows) => {
    if (err) {
      return console.error("error running query", err);
    }

    console.log('Searching ...');
    printResults(rows);
  });

function printResults(rows) {
  const numOfPeople = rows.length;

  console.log(`Found ${numOfPeople} person(s) by the name '${person}'`);
  for (let i = 0; i < rows.length; i++) {
    console.log(`- ${i+1}: ${rows[i].first_name} ${rows[i].last_name}, born '${rows[i].birthdate}'`);
  }
}