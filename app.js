const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MongoAdapter = require("@bot-whatsapp/database/mongo");

const MONGO_DB_URI =
    "mongodb+srv://root:root@cluster0.dj1bs.gcp.mongodb.net/?retryWrites=true&w=majority";
const MONGO_DB_NAME = "DB_BOT";

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

const productAnswers = (productUrl) => {
    return [
        [
            "Te envío el link a nuestra tienda con más info y precio del producto.",
            `👉🏼 ${productUrl}`,
            "👉🏼 Podés llevar el modelo que más te guste \"en combo.\" Este incluye:",
            "• Cuna • Colchón • Juego de sábanas • Almohadón de regalo 💖",
        ],
        [
            "💳 Podés abonar en hasta en 3 cuotas sin interés con tarjetas de crédito bancarias.",
            "💰 Efectivo: 20% OFF",
            "💸 Transf/depósito:10% OFF",
        ],
        "⚡📦 Hacemos envíos a todo el país! Podés cotizar el mismo directamente desde nuestra página ingresando tu código postal.",
        "📍Nos encontrás en 3 de Febrero 2962. Caseros, Buenos Aires.",
        ["Ante cualquier duda, estamos a tu disposición. 😊👑"],
    ];
};

const createProductFlow = (keyword, productUrl) => {
    const flow = addKeyword(keyword).addAction(greetingAction);
    productAnswers(productUrl).forEach((answer) => flow.addAnswer(answer));
    return flow;
};

const flowViena = createProductFlow(
    "¿Me enviarían más detalles de la cuna funcional Viena?",
    "https://www.faraonkids.com/search/?q=funcional+viena"
).addAnswer(null, null, null, [flowThanks]);

const flowParis = createProductFlow(
    "¿Me enviarían más detalles de la cuna colecho Paris?",
    "https://www.faraonkids.com/search/?q=colecho+paris"
).addAnswer(null, null, null, [flowThanks]);

const flowMilan = createProductFlow(
    "¿Me enviarían más detalles de la cuna colecho Milan?",
    "https://www.faraonkids.com/search/?q=colecho+milan"
).addAnswer(null, null, null, [flowThanks]);

const main = async () => {
    const adapterDB = new MongoAdapter({
        dbUri: MONGO_DB_URI,
        dbName: MONGO_DB_NAME,
    });
    const adapterFlow = createFlow([flowViena, flowParis, flowMilan]);
    const adapterProvider = createProvider(BaileysProvider);
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
    QRPortalWeb();
};

main();
