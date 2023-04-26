const {createBot, createProvider, createFlow, addKeyword} = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MongoAdapter = require('@bot-whatsapp/database/mongo')

/**
 * Declaramos las conexiones de Mongo
 */

const MONGO_DB_URI = 'mongodb+srv://root:root@cluster0.dj1bs.gcp.mongodb.net/?retryWrites=true&w=majority'
const MONGO_DB_NAME = 'DB_BOT'

/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)

const flowPrinciple = addKeyword('¿Me enviarían más detalles de la cuna funcional Viena?')
    .addAction(async (ctx,{flowDynamic}) => {
        var name = ctx.pushName;

        return flowDynamic(`Buen día ${name}, cómo estas? 😊`)
    })
    .addAnswer(
        [
            'Te envío el link a nuestra tienda con más info y precio de la cuna funcional Viena.',
            '👉🏼 https://www.faraonkids.com/search/?q=funcional+viena',
            '👉🏼 Podés llevar el modelo que más te guste "en combo." Este incluye:',
            '• Cuna • Colchón • Juego de sábanas • Almohadón de regalo 💖'
        ])
    .addAnswer(
        [
            '💳 Podés abonar en hasta en 3 cuotas sin interés con tarjetas de crédito bancarias.',
            '💰 Efectivo: 20% OFF',
            '💸 Transf/depósito:10% OFF'
        ])
    .addAnswer('⚡📦 Hacemos envíos a todo el país! Podés cotizar el mismo directamente desde nuestra página ingresando tu código postal.')
    .addAnswer('📍Nos encontrás en 3 de Febrero 2962. Caseros, Buenos Aires.')
    .addAnswer(
        [
            'Ante cualquier duda, estamos a tu disposición. 😊👑'
        ],
        null,
        null,
        [flowDocs, flowGracias, flowTuto, flowDiscord]
    )

const main = async () => {
    const adapterDB = new MongoAdapter({
        dbUri: MONGO_DB_URI,
        dbName: MONGO_DB_NAME,
    })
    const adapterFlow = createFlow([flowPrinciple])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
