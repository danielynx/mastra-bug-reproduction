# mastra-bug-reproduction

This project demonstrates an bug in the `@mastra/qdrant:1.0.1` package, specifically in the `upsert` method, when the `ids` 
parameter is provided as a `uint64` value cast to a `string`, as required by the TypeScript definition.

## Actual behavior

In my project, business logic requires using the relational database ID (an unsigned integer) as the Qdrant point ID.

If I follow the Mastra TypeScript definition and convert numeric IDs to strings, Mastra sends the request to Qdrant with
those string values. Qdrant then returns the error shown below, because it does not accept arbitrary strings for point IDs, only 
`UUID` formatted `strings` and `uint64` values are valid, as described in the 
[Qdrant API - Upsert Endpoint](https://api.qdrant.tech/api-reference/points/upsert-points#request.body.PointsList.points.id).

    ![Qdrant error response](./readme/qdrant-error.png)

As a workaround, I ignore the TypeScript definition and provide a `uint64` value directly. In that case, everything works 
correctly, except for the TypeScript error shown in my IDE.

## Expected behavior

The `@mastra/qdrant` package should work when a `uint64` value cast to a `string` is provided as the `ids` parameter of the `upsert` method.

I verified the `@mastra/qdrant` source code and noticed that several functions convert IDs from strings to integers 
internally. However, the `upsert` method does not perform this conversion when `ids` parameter is provided.

Based on this, I assume it was an architectural decision to keep the store API consistent across different vector 
database integrations by accepting IDs as `string` and converting them internally when required by the underlying database.

Because of that, I would expect the `upsert` method to also handle this conversion.

## Environment

  System:
    OS: Linux 6.17 Ubuntu 24.04.4 LTS 24.04.4 LTS (Noble Numbat)
    CPU: (12) x64 Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz
    Memory: 6.62 GB / 15.43 GB
    Container: Yes
    Shell: 5.2.21 - /bin/bash
  Binaries:
    Node: 24.13.1 - /home/danielynx/.nvm/versions/node/v24.13.1/bin/node
    npm: 11.8.0 - /home/danielynx/.nvm/versions/node/v24.13.1/bin/npm
    pnpm: 10.30.3 - /home/danielynx/.nvm/versions/node/v24.13.1/bin/pnpm
  Browsers:
    Chrome: 145.0.7632.159
    Firefox: 148.0
    Firefox Developer Edition: 148.0
  npmPackages:
    @mastra/qdrant: 1.0.1 => 1.0.1 
    @types/node: ^25.3.3 => 25.3.3 
    dotenv: 17.3.1 => 17.3.1 
    mastra: ^1.3.5 => 1.3.5 
    typescript: ^5.9.3 => 5.9.3 
    zod: ^4.3.6 => 4.3.6 
  npmGlobalPackages:
    corepack: 0.34.6
    npm: 11.8.0
  Extra:
    Docker: 29.3.0
    Qdrant: v1.17 (fixed in docker-compose.yaml)

## Steps to reproduce

1. Intall Docker and Docker Compose. They are used to run Qdrant intance, so you can skip this step if want use another Qdrant instance.

2. Configure the `.env` file following the `.env.example`.

3. Install dependencies:

    ```shell
    pnpm install
    ```

4. Execute:

    ```shell
    npm run bug-reproduction
    ```
5. Which command or action triggers the error: 

    The error occurs during the `upsert` execution triggered by line 24 of `src/qdrant-upsert.ts`, because the `ids` 
parameter is provided as a `uint64` value cast to a `string`.