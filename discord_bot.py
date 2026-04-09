import requests
from discord import Intents, Message
from discord.ext import commands

DISCORD_BOT_TOKEN = "YOUR_TOKEN_HERE"
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mehis"

SYSTEM_PROMPT = "You are Mehis, a helpful ADHD coaching assistant for parents."

def ask_ollama(prompt):
    full = f"{SYSTEM_PROMPT}\n\nUser: {prompt}\nMehis:"
    try:
        r = requests.post(OLLAMA_URL, json={"model": MODEL_NAME, "prompt": full, "stream": False}, timeout=120)
        return r.json().get("response", "Error") if r.ok else "Error"
    except:
        return "Error"

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
        await message.reply(ask_ollama(message.content))

bot.run(DISCORD_BOT_TOKEN)
