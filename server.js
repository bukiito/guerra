require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// 🔹 MongoDB Atlas bağlantısı (Bunu Render'da ekleyeceğiz)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// 🔹 Sayaç için MongoDB şeması
const CounterSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
});
const Counter = mongoose.model("Counter", CounterSchema);

// 🔹 Eğer veritabanında sayaç yoksa bir tane oluştur
async function initCounter() {
    const existingCounter = await Counter.findOne();
    if (!existingCounter) {
        await new Counter({ count: 0 }).save();
    }
}
initCounter();

// 🔹 Sayaç değerini getir
app.get("/getCount", async (req, res) => {
    const counter = await Counter.findOne();
    res.json({ count: counter.count });
});

// 🔹 Sayaç değerini artır
app.post("/increment", async (req, res) => {
    const counter = await Counter.findOne();
    counter.count += 1;
    await counter.save();
    res.json({ count: counter.count });
});

// 🔹 Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});
