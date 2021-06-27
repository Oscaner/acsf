# acsf
CLI tool for talking to the Acquia Site Factory API

## This directory should contain all commands of acsf-deploy.

## Help

```bash
# use --help to get more information.
$ ./bin/acsf --help
$ ./bin/acsf domain --help
$ ./bin/acsf staging --help
$ ./bin/acsf update --help
```

## Commands

### Domain setup

- Script can read domain.json file to get domain data and reset domain for all collection.
- Script can read domain.json file to get domain data and reset domain for one collection.
- Script can get domain param to add or remove some domain.

```bash
# Reset all collection domain (Need give the env from [dev, test, prod])
$ ./bin/acsf domain --env dev --all --reset
# Reset one collection domain (Need give env from [dev, test, prod] and target collection-name param.)
$ ./bin/acsf domain --env dev --target CollectionName --reset
# Add or delete one collection domain (Need give the env from [dev, test, prod] and collection-name and the domain name)
$ ./bin/acsf domain --env dev --target CollectionName --add [DOMAIN] --delete [DOMAIN]
```
