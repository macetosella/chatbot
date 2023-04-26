const config = require("./config");

const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MongoAdapter = require("@bot-whatsapp/database/mongo");

const flowThanks = addKeyword("gracias").addAnswer("❤️");

const getGreeting = () => {
    const currentDate = new Date();
    const argentinaDate = new Date(
        currentDate.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })
    );
    const currentHour = argentinaDate.getHours();

    if (currentHour >= 6 && currentHour < 13) {
        return "Buen día";
    } else if (currentHour >= 13 && currentHour < 20) {
        return "Buenas tardes";
    } else {
        return "Buenas noches";
    }
};

const greetingAction = async (ctx, { flowDynamic }) => {
    const name = ctx.pushName;
    const greeting = getGreeting();
    return flowDynamic(`${greeting} ${name}, cómo estás? 😊`);
};

const productAnswers = (productName, productUrl) => {
    return [
        [
            `Te envío el link a nuestra tienda con más info y precio de la ${productName}.`,
            `👉🏼 ${productUrl}`,
            "👉🏼 Podés llevar el modelo que más te guste \"en combo.\" Este incluye:",
            "• Cuna • Colchón • Juego de sábanas • Almohadón de regalo 💖",
        ],
        [
            "💳 Podés abonar en hasta en 3 cuotas sin interés con tarjetas de crédito bancarias.",
            "💰 Efectivo: 20% OFF",
            "💸 Transf/depósito:10% OFF",
        ],
        [
            "⚡📦 Hacemos envíos a todo el país! Podés cotizar el mismo directamente desde nuestra página ingresando tu código postal."
        ],
        [
            "📍Nos encontrás en 3 de Febrero 2962. Caseros, Buenos Aires."
        ],
        [
            "Ante cualquier duda, estamos a tu disposición. 😊👑"
        ]
    ]
};

const configureFlowAnswers = (flow, productName, productUrl) => {
    productAnswers(productName, productUrl).forEach((answer) => flow.addAnswer(answer));
    flow.addAnswer(null, null, null, [flowThanks]);
};

const createProductFlow = ({ keyword, name, url }) => {
    const flow = addKeyword(keyword).addAction(greetingAction);
    configureFlowAnswers(flow, name, url);
    return flow;
};

const main = async () => {
    const adapterDB = new MongoAdapter({
        dbUri: config.database.uri,
        dbName: config.database.name,
    });
    const adapterFlow = createFlow(config.products.map(createProductFlow));
    const adapterProvider = createProvider(BaileysProvider);
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
    QRPortalWeb();
};

main();
