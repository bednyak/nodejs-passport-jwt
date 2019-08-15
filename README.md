# NodeJS-JWT auth service (PassportJS)
Node.js JWT auth service via PassportJS strategy

### Deployment

Before start, install docker and docker-compose

**Prepare DB**
 - Run datasource
 ```
 $ docker-compose up --build postgresql
 ```
 - Create new database
```
$ npm run create-db
```
  - Run migrations
```
$ npm run db-migrate-up
``` 

**Run service**
 ```
 $ docker-compose up --build njs.jwt.service
 ```