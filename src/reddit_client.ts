const Snoowrap = require("snoowrap");
import Config from "./interfaces/config";
const config: Config = require("../config.json");

export default new Snoowrap({
    userAgent: config.user_agent,
    clientId: config.reddit_id,
    clientSecret: config.reddit_secret,
    username: config.reddit_username,
    password: config.reddit_password

});