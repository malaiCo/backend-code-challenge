# NEO API

First nice challenge.
Will just add here my decisions and why:
- restify: i used for long and gives better performance than express;
- mongoose: typical client to connect to mongodb, nothing to add;
- raml: Has no service should go without an API i include an raml file that better describes the api.

## Command Line Tools

- make init
npm install package.json

- make start
Run docker compose file, meaning build and run both services. Press `ctr c` to quit

- make import-data
Runs a small js file that will get data from Nasa.neo api and send it to our server.
This import uses an extra enpoint, has a post to neo will create the neo ;)
[Note] This command depends on service be running so make sure you `make start` is running.

- make test
Run our test battery

### Considerations

I added enviromment variables to the docker-compose but this solution will not be properly to prod server, so let's assume this is to run a development server always.
The package.json is outside of the service folder when it shouldn't, this was just to have the packages available for the tools importer to run.
The same applies to the Dockerfile witch should be inside the service folder.
No special erro handling where added to the api i am choosing to let the erros that came be passed has a 400 always;