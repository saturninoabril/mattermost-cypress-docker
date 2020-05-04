##### Requirements
- Docker - https://docs.docker.com/get-docker/
- Docker Compose - https://docs.docker.com/compose/install/
- EE License named ``mm-license.txt`` is expected at root folder. You may comment out steps in ``Makefile`` if none.

##### Setting server configuration
Config that can't be modified during testing should be declared as environment variables.  Otherwise, it may be set at `Makefile` or ``mattermost-e2e/app/entrypoint.sh``. 

##### Running E2E testing
1. `make build` to pull source files, copy to required directories and build docker images
1. `make up` to spin up test server and start Cypress testing
2. `make stop` to stop dependencies
3. `make clean` to remove dependencies.

Note: See ``Makefile`` for other essential commands and ``docker`` / ``docker-compose`` for direct commands