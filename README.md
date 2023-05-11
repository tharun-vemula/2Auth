# auth

## Setup

- Use `docker compose up` to initialize the app.

> Prisma needs to perform transactions, which requires the MongoDB server to be run as a replica set. This is a case of multi-document transaction. Prisma cannot create a namespace in multi-document transaction. So, we have to manually create collections `User`, `AuthorizationCode`.

- Use `docker compose exec mongo-primary mongo -u "<user>" -p "<password>"` to interact with the mongodb shell.
- Instantiate the replica set as follows,
  - `rs.initiate({"_id" : "authapp","members" : [{"_id" : 0,"host" : "mongo-primary:27017"},{"_id" : 1,"host" : "mongo-worker-1:27017"},{"_id" : 2,"host" : "mongo-worker-2:27017"},{"_id" : 3,"host" : "mongo-worker-3:27017"}]});`
  - Set the priority of the master over the other nodes, <br>
    `conf = rs.config();` <br>
    `conf.members[0].priority = 2;` <br>
    `rs.reconfig(conf);`
- Use `use <dbname>;` to switch to the required db, `auth`.
- Use `db.createCollection('User');` to create a collection, `User`.
- Use `db.createCollection('AuthorizationCode');` to create a collection, `AuthorizationCode`.

Setup is complete.
