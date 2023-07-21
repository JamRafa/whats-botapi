import { error } from 'console';
import parsePhoneNumber, { isValidPhoneNumber } from 'libphonenumber-js';
import { type } from 'os';
import { start } from 'repl'
import { create, Whatsapp, Message, SocketState } from "venom-bot";

export type QrCode = {
  base64Qr: string
  attempts?: number
}

class Sender {

  public client: Whatsapp;
  private connected: boolean;
  private qr: QrCode
  private session: string

  get isConnected(): boolean {
    return this.connected
  }

  get qrCode(): QrCode {
    return this.qr
  }


  constructor() {
    this.initialize()
  }

  async sendText(to: string, body: string) {


    if (!isValidPhoneNumber(to, "BR")) {
      throw new Error('esse numero nao é valido, para o Brasil')
    }

    let phoneNumber = parsePhoneNumber(to, "BR")?.format("E.164")
      .replace("+", "") as string

    phoneNumber = phoneNumber.includes("@c.us")
      ? phoneNumber :
      `${phoneNumber}@c.us`

    await this.client.sendText(phoneNumber, body)
  }

  private initialize() {

    const qr = (base64Qr: string) => {
      this.qr = { base64Qr }
    }

    const status = (statusSession: string) => {

      this.connected = ["isLogged", "qrReadSuccess", "chatsAvaliable"].includes(
        statusSession
      )
    }

    const start = (client: Whatsapp) => {
      this.client = client
      client.onStateChange((state) => {
        this.connected = state === SocketState.CONNECTED
      })

    }

    create('bot', qr, status)
      .then((client) => start(client))
      .catch((error) => console.log(error))
  }
}

export default Sender