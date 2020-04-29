##### Requirements
- Docker - https://docs.docker.com/get-docker/
- Docker Compose - https://docs.docker.com/compose/install/
- EE License should be copied manually to `mattermost-cypress-docker/mattermost-e2e/app/mm-license.txt` (or comment out step in ``Makefile`` if none)

##### Setting server configuration
Config that can't be modified during testing should be declared as environment variables.  Otherwise, it may be set at `Makefile` or ``mattermost-e2e/app/entrypoint.sh``. 

##### Running E2E testing
1. `make up` so spin up test server and start Cypress testing
2. `make stop` to stop dependencies
3. `make app-stop` to stop Mattermost server
4. `make clean` to remove dependencies. In most cases, you may need first to initiate `make app-stop` and `make webhook-stop`.

Note: See ``Makefile`` for other essential commands and ``docker`` / ``docker-compose`` for direct commands