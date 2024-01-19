const { Client, Events, GatewayIntentBits} = require("discord.js")
require("dotenv/config")
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.once(Events.ClientReady, (clientUser) => {
    console.log(`Logged in as ${clientUser.user.tag}`)
})

client.login(process.env.BOT_TOKEN)

const BOT_CHANNEL = "1197680357428965467"
const PAST_MESSAGES = 1

client.on(Events.MessageCreate, async (message) =>{
    if (message.author.bot) return
    if (message.channel.id !== BOT_CHANNEL) return

    message.channel.sendTyping()

    let messages = Array.from(await message.channel.messages.fetch({
        limit: PAST_MESSAGES,
        before: message.id
    }))
    messages = messages.map(m=>m[1])
    messages.unshift(message)

    let users = [...new Set([...messages.map(m=> m.member.displayName), client.user.username])]

    let lastUser = users.pop()

    let prompt = ``

    for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i]
        prompt += `${m.member.displayName}: ${m.content}\n`
        
    }
    
    prompt += `${client.user.username}:`
    console.log("prompt:", prompt)

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "act mean and sarcastic"
            },
            {
                role: "user",
                content: prompt
            }
        ],
        max_tokens: 1500,
    })
    
    console.log(chatCompletion)
    const responseText = chatCompletion.choices[0].message.content;

    console.log("response", responseText);
    await message.channel.send(responseText);
    
})