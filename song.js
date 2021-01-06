const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const client = new Discord.Client();
const config = require("./config.json");
const queue = new Map();


client.once("ready", () => {
  console.log("Bot ligado!!");

client.once("reconnecting", () => {
  console.log("Queda de conexão..Reconectando!");
});

client.once("disconnect", () => {
  console.log("Disconectado!");
});

const status = [
  {
        type: 'STREAMING',
        message: 'Status 1',
        url: 'https://www.twitch.tv/sla'
      },
    ]
  
    function cs() {
      const random = status[Math.floor(Math.random() * status.length)];
      client.user.setActivity(random.message, { type: random.type, url: random.url });
    }
  
    setInterval(cs, 1000)
  
  });
  client.on('message', message => {
if (message.content === `<@!${client.user.id}>`) {
			if (message.author.bot) return;
	      const embed = new Discord.MessageEmbed()
      .setColor("#51FF00")
      .setTitle("MINHAS INFO!")
      .addField("Meu prefixo:", "r!")
      .addField("Linguagem que fui feito", "JS (JavaScript)")
      .addField("Meus modulos:", "Discord.js(v12), YTDL-CORE, FFMpeg")
      .addField("Minha host", "<Sua host>")
      .setThumbnail("https://media2.giphy.com/media/Lm6q69kcAy8Gv0wj2p/giphy.gif")
message.channel.send('<a:carregando:745424904035500139> Aguarde...').then(msg => setTimeout(() => msg.edit(embed), 3000 ))
      
    }
    })


client.on("message", async message => {

  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;
  const serverQueue = queue.get(message.guild.id);
  
  if (message.content.startsWith(`${config.prefix}play`)) {
    execute(message, serverQueue);
    const args = message.content.split(" ");
    if (!args[0]) return message.reply('Poura vei quer que eu toque uma musica que nem sei qual eh?!')
  } else if (message.content.startsWith(`${config.prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${config.prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send("<a:musica:745424980099072001> Para tocar uma musica você precisa dar `r!play <link da musica>`, caso queira que a musica pare basta dar `r!stop`, caso queira adicionar na lista digite `r!play <link da musica>`, caso queira que a musica seja skipada digite `r!skip`");
  }


async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send("Krl vei é serio? Você quer que eu toque sozinho? Ai nn né");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "Preciso das permissões para entrar e falar no seu canal de voz!"
    );
  }
  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
		
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
		author: songInfo.videoDetails.author.name,
		formats: songInfo.formats[1].container,
		qualidade: songInfo.formats[1].qualityLabel,
		like: songInfo.videoDetails.likes,
		deslikes: songInfo.videoDetails.dislikes,
		data: songInfo.videoDetails.publishDate,
		inscritos: songInfo.videoDetails.author.subscriber_count

  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      let connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    message.channel.send(`<a:tocadisket:745300441604161589> Foi adicionado no setor 4 de transmissao ${song.title} <a:tocadisket:745300441604161589>`);
    console.log(`Uma musica foi adicionada lista Musica: ${song.title}`)
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Krl vei é serio? Você quer que eu toque sozinho? Ai nn né"
    );
  if (!serverQueue)
    return message.channel.send("Você quer pular uma musica que nem ta na lista?");
  serverQueue.connection.dispatcher.end();
}//S

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Você tem que tar no canal para parar eu!!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
			message.channel.send(`<a:tocadisket:745300441604161589> ${message.author} A musica ${song.title} acabou! <a:pensando:745424938365878282>`)
    })
		
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
function kFormatter(num) {
  if(Math.abs(num) > 999999999) return Math.sign(num) * ((Math.abs(num) / 100000000).toFixed(1)) + " BI"
  if(Math.abs(num) > 999999) return Math.sign(num) * ((Math.abs(num) / 100000).toFixed(1)) + ' MI'
  if(Math.abs(num) > 999) return Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + ' Mil' 
  if(Math.abs(num) <= 999) return Math.sign(num) * Math.abs(num)

}
let likeformatado = kFormatter(song.like)
let deslikeformatado = kFormatter(song.deslikes)
	const embed = new Discord.MessageEmbed()
	.setColor("#00FEDB")
	.setTitle('LM-RADIO')
	.addField("<a:tocadisket:745300441604161589> Nome da musica" , `${song.title}`)
	.addField("Autor da musica/video", `${song.author}`)
	.addField("Formato do video", `${song.formats}`)
	.addField("Música publicada em", `${song.data}`)
	.addField("Qualidade", `${song.qualidade}`)
	.addField("FeedBack", `👍 ${likeformatado} 👎 ${deslikeformatado}`)
	.addField("<a:cachorro:759215798329278536>  Tocando no", "YouTube")
	.setThumbnail('https://media2.giphy.com/media/13Nc3xlO1kGg3S/200.gif')
  serverQueue.textChannel.send(embed);
}

})
client.login(config.token);