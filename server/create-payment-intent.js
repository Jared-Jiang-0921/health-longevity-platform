/**
 * 最小示例：创建 Stripe PaymentIntent（需在项目外或单独服务中运行）
 * 使用方式：node server/create-payment-intent.js
 * 依赖：npm install stripe express cors
 *
 * 或使用 Stripe CLI 转发 webhook、或部署到 Vercel/Netlify 等作为 serverless
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

app.post('/create-payment-intent', async (req, res) => {
  const { amount = 1999, currency = 'usd' } = req.body || {}
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    })
    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

const port = process.env.PORT || 4242
app.listen(port, () => console.log(`PaymentIntent API: http://localhost:${port}`))
