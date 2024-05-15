import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'

const cliente = new MercadoPagoConfig({
  accessToken: process.env.TOKENMERCADOPAGO
})

const PagosMercadopago = new Payment(cliente)

const Mercadopago = new Preference(cliente)

export { Mercadopago, PagosMercadopago }
