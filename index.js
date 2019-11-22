const inquirer = require('inquirer');
const {exec} = require('child_process');

inquirer
  .prompt([
    {
      type: 'list',
      name: 'model',
      message: 'Which collection would you like to populate?',
      choices: ['book', 'author', 'user', 'review'],
    },
  ])
  .then(modelanswer => {
    console.info('Answer:', modelanswer.model);
    inquirer.prompt([
        {
            type: 'list',
            name: 'count',
            message: 'How many ' + modelanswer.model + "s would you like to create?",
            choices: [5,10,25,50,100,1000],
        },
    ])
    .then(countanswer => {
        console.info('Answer:', countanswer.count);
        command = '/usr/local/bin/node data/fake-' + modelanswer.model +'s.js -c ' + countanswer.count;
        exec(command, (err, out) => {
            if (err) {
              console.error(err)
            }
            else {
              console.log(out)
            }
            console.log("Output: " + out);

        })
    })
  });