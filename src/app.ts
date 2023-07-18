import { Message } from 'venom-bot';
import "dotenv/config.js";
import express, { Request, Response } from "express";
import Sender from "./venom";
import cors from 'cors'
const sender = new Sender()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors<Request>());
app.get('/status', (req: Request, res: Response) => {
    return res.send({
        qr_code: sender.qrCode,
        connected: sender.isConnected
    })
}
)
app.post('/send', async (req: Request, res: Response) => {
    const { number, message } = req.body
    console.log(message)
    try {
        await sender.sendText(number, message)
        return res.status(200).json()
    } catch (error) {
        res.status(500).json({ satus: "error", message: error })
    }
})

const port = process.env.PORT ? Number(process.env.PORT) : 5000

app.listen(port, () => {
    console.log('rodando')
})

export default app