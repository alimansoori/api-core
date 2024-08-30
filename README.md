## Run project in development :
0. You should create a directory in this route: `src/core/keys/jwt/`
and create 2 text files named:
jwt.public.pem
jwt.private.key
you can create your own keys with OpenSSL or for sample use these:

public key:
- ----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEeE8Bnp7kN8URWALYSs+f1UkVBFEM
SD/WUDZZBj0GOLDfad/SJuyhnjHxpd+hUPY4BmdyX+ZvnYdjfVPLJEAFww==
-----END PUBLIC KEY-----

private key:
- ----BEGIN EC PRIVATE KEY-----
MHcCAQEEIMKfxi+5OBAmVdHNs3rZ7aGDJpAMqxiWjoKJXj6knUtqoAoGCCqGSM49
AwEHoUQDQgAEeE8Bnp7kN8URWALYSs+f1UkVBFEMSD/WUDZZBj0GOLDfad/SJuyh
njHxpd+hUPY4BmdyX+ZvnYdjfVPLJEAFww==
-----END EC PRIVATE KEY-----

1. Add `shared-models` from [here](https://bitbucket.org/MikeHoss/shared-models) as submodule.
2. Run `pnpm i` in project root for installing packages.
3. Run `pnpm db:gen`.
4. Create a `.env` file in the root, copy/paste the `.env.example` in it and fill the missing values with proper data.
5. Run `pnpm db:make`. ( and if db did not seeded automatically run `pnpm db:seed:up`. )
6. Run `pnpm dev` to start the app. ( If the db has reset and seeded recently, app will run a Mock Data to populate it more. Do NOT terminate the app during this process. (Or you have to reset the db again and start the app.) )

## Required Vscode Extensions :

1. [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
2. [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)
3. [Format Code Action](https://marketplace.visualstudio.com/items?itemName=rohit-gohri.format-code-action)
4. [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)

## Check circular dependencies :

`npx madge --circular --extensions ts ./src`

## Tips

- To add a new env variable, add the variable in `.env.example` and it's interface in `src/interfaces/environment/environment.ts`. Then run `schema:env:gen` for handling the env validations in future.

- When a new API added, make sure it's interface name is ended with `Api`, then run `schema:gen` to generate json-schema from their interfaces. This will take care of OpenAPI specs, request validations using ajv and serializations.

- See the [Development Docker Guidance](https://bitbucket.org/MikeHoss/api-backend/src/staging/orchestration/README.md).
