##### Requirements
- Docker - https://docs.docker.com/get-docker/
- Docker Compose - https://docs.docker.com/compose/install/
- EE License - as ``mm-license.txt`` at the root folder (comment out step in ``Makefile`` if none)

##### Running E2E testing
1. `make up` so spin up test server and start Cypress testing
2. `make stop` to stop dependencies
3. `make clean` to remove dependecies
4. `make app-stop` to stop Mattermost server

Note: See `Makefile` for other essential commands