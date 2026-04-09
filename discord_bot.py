import requests
from discord import Intents, Message
from discord.ext import commands

DISCORD_BOT_TOKEN = "token"
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mehis"

intents = Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"🤖 Mehis ready: {bot.user}")

@bot.event
async def on_message(message: Message):
    if message.author.bot or not message.content.strip():
        return
    async with message.channel.typing():
        await message.reply(requests.post(OLLAMA_URL, json={"model": MODEL_NAME, "prompt": f"You are Mehis, helpful ADHD coach.\n\nUser: {message.content}\nMehis:", "stream": False}, timeout=120).json().get("response", "Error"))

bot.run(DISCORD_BOT_TOKEN)
