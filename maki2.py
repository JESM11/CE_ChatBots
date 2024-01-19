import os
import telebot
import yt_dlp

bot = telebot.TeleBot("6404421351:AAE_BhZUNcLS3Y3FRhwVfsN7Qsno2IwzuDk")

ruta = os.getcwd() + "/salida/"

@bot.message_handler(commands=["start" , "help"])
def enviar(message):
    bot.reply_to(message, "Bienvenido al bot de descarga de videos de YouTube.\nPara descargar un video clickea la opcion /Descargar o solo escribe en el teclado el comando")

@bot.message_handler(commands=["Descargar"])
def enviar(message):
    bot.reply_to(message, "Ingrese la direccion del video (URL) que quiera descargar y la calidad (360p, 480p, 720p, audio): ")
    a = message.text
    print(a)
    if a == "/Descargar":
        @bot.message_handler(func=lambda message:True)
        def Descargar(message):
            bot.reply_to(message, "Su video se esta descargando, espere...")
            direccion, calidad = message.text.split()
            mess = message.chat.id
            print(direccion, calidad, mess)
            if calidad == "audio":
                ydl_opts = {
                    'outtmpl': '%(title)s.%(ext)s',
                    'format': 'bestaudio',
                }
            else:
                ydl_opts = {
                    'outtmpl': '%(title)s.%(ext)s',
                    'format': f'best[height<={calidad}]',
                }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([direccion])
            p = ydl.prepare_filename(ydl.extract_info(direccion, download=False))
            video = open(p,"rb")
            bot.send_video(mess, video)
        
bot.infinity_polling()

