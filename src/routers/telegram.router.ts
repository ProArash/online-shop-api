import { Request, Response } from "express";
import { PORT, TELEGRAM_TOKEN, WEBHOOK_URL } from "../utils/constants";
import { router } from "../utils/import-router";
import TelegramBot, { Message, Update } from "node-telegram-bot-api";

export const telegramRouter = router;

const bot = new TelegramBot(TELEGRAM_TOKEN, {
    polling: false,
    webHook: true,
});

bot.setWebHook(`${WEBHOOK_URL}/bot${TELEGRAM_TOKEN}`);

router.post(`/bot${TELEGRAM_TOKEN}`, async (req: Request, res: Response) => {
    bot.processUpdate(req.body);
    res.status(200).send("ok");
});

bot.on("message", async (update: TelegramBot.Message) => {
    let msg = update.text;
    let chatId = update.chat.id;
    await bot.sendMessage(chatId, msg!);
});
