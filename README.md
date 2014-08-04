Simple node app which adds a ton of users to Tableau. Uses REST API. 

- Make sure REST API has been enabled on your box
- May go faster if you temporarily add an extra app server process or two

This script loaded slightly under 1K users / minute for me on a single core i7 with 32 GB of RAM running remotely. It did slightly more than 2K users / minute when run locally on the Tableau Server itself

Setup: 

- Node.JS installed
- Unzip this sucker somewhere
- run "npm update" from the command line while sitting in <somewhere> to update modules
- run node app.js to execute the script

