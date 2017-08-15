/* eslint-env node, es6, mocha */
const Auth = require("../helpers/Auth");
const PluginManager = require("../PluginManager");

const EventEmitter = require("events");
class TelegramBot extends EventEmitter {
    constructor() {
        super();
        this.i = 0;
        this.date = Math.floor(new Date() / 1000);
    }

    pushMessage(message, type = "text") {
        message.message_id = this.i++;
        message.from = {
            id: 12345678,
            first_name: 'Foobar',
            username: 'foo_bar'
        };
        message.chat = {
            id: -123456789,
            title: 'Test group',
            type: 'group',
            all_members_are_administrators: false
        };
        message.date = this.date++;
        this.emit(type, message);
    }
    sendMessage(chatId, text, options) {
        this.emit("_debug_message", {
            chatId,
            text,
            options
        });
    }
}

describe("Ping", function() {
    const bot = new TelegramBot();
    const pluginManager = new PluginManager(bot);
    pluginManager.loadPlugins(["Ping"]);
    Auth.init();
    it("should reply to /ping", function(done) {
        bot.pushMessage({text: "ping"}, "text");
        bot.once("_debug_message", function() {
            done();
        });
    });
});