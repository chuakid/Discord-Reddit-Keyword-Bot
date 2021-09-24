A discord bot for scraping reddit for keywords every hour and posts it to a channel on discord.

For the bot to work, a config.json must be provided in the root. an example config.json can be found in the repository.

## Development
To register slash commands, use 

`node deploy-commands.js`
configured with 

`command_builder_config.json`

To spin up a watch function.
```npm run dev```


## Production
To start the bot:

```npm run start```
