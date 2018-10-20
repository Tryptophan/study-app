#!/bin/bash

mongo -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase "admin" --eval "db.getSiblingDB('db').createUser({user:'$MONGO_API_USER', pwd:'$MONGO_API_PASS', roles:[ {role:'readWrite', db:'db'} ]}); db.getSiblingDB('db').users.insertOne({username: '$SA_USER', email: '$SA_EMAIL', role: 'superadmin'});"