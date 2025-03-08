const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// MongoDBに接続 (ローカル環境)
mongoose.connect('mongodb://localhost:27017/hitandblow', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const scoreSchema = new mongoose.Schema({
    username: String,
    score: Number
});

const Score = mongoose.model('Score', scoreSchema);

// スコアを送信
app.post('/api/scores', async (req, res) => {
    try {
        const {
            username,
            score
        } = req.body;
        const newScore = new Score({
            username,
            score
        });
        await newScore.save();
        res.status(201).send('スコア送信成功');
    } catch (error) {
        console.error('スコア送信エラー:', error);
        res.status(500).send('スコア送信エラー');
    }
});

// ランキングデータを取得
app.get('/api/scores', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const rankingData = await Score.find().sort({
            score: -1
        }).limit(limit);
        res.json(rankingData);
    } catch (error) {
        console.error('ランキング取得エラー:', error);
        res.status(500).send('ランキング取得エラー');
    }
});

app.listen(port, () => {
    console.log(`サーバー起動: http://localhost:${port}`);
});
