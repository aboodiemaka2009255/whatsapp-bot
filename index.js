const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// إنشاء العميل مع استخدام LocalAuth لحفظ الجلسة
const client = new Client({
    authStrategy: new LocalAuth()
});

// عرض QR Code عند بدء التشغيل
client.on('qr', (qr) => {
    console.log("QR Code متاح، قم بمسحه الآن:");
    qrcode.generate(qr, { small: true });
});

// تسجيل الدخول بنجاح
client.on('ready', () => {
    console.log('✅ البوت جاهز للعمل!');
});

// استقبال الرسائل
client.on('message', async (message) => {
    if (message.body.startsWith('.نشر')) {
        const chat = await message.getChat();
        let messageToSend = message.body.slice(4).trim();

        if (message.hasQuotedMsg) {
            const quotedMessage = await message.getQuotedMessage();
            messageToSend = quotedMessage.body;
        }

        client.getChats().then(chats => {
            chats.forEach(groupChat => {
                if (groupChat.isGroup) {
                    groupChat.sendMessage(messageToSend).then(() => {
                        groupChat.sendMessage('تمت يا سيدي سبيدي');
                    });
                }
            });
        });
    }
});

// بدء البوت
client.initialize();
