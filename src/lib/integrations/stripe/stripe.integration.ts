import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { getConfigs } from '@app/lib/config.validator.js'
import Stripe from 'stripe'
import { singleton } from 'tsyringe'

enum WORKSPACE_SUBSCRIPTION_STATUS {
  active,
  paused,
  unpaid,
  trialing,
  canceled,
  past_due,
  incomplete,
  incomplete_expired,
}

interface IWorkspaceSubscriptionInfo {
  status: keyof typeof WORKSPACE_SUBSCRIPTION_STATUS
  currency: string
  trial_end_date?: string
  trial_start_date?: string
  will_be_cancelled_at?: string
  canceled_at?: string
  ended_at?: string
  current_period_end: string
  current_period_start: string
  amount: string
  email: string
  card?: {
    last4: string
    exp_month: number
    exp_year: number
    brand: string
  }
}

@singleton()
export default class StripeService {
  private stripe!: Stripe
  constructor() {
    this.initiateStripe()
  }
  private repo = getRepo()

  private initiateStripe = async () => {
    this.stripe = new Stripe(getConfigs().STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  }

  public validateEvent = (event: string | Buffer, sig: string | Buffer | string[], secret: string) => {
    return this.stripe.webhooks.constructEvent(event, sig, secret)
  }

  public updateProduct = async (id: string, params: Stripe.ProductUpdateParams) => {
    return await this.stripe.products.update(id, params)
  }

  public getProductPrices = async (product: string) => {
    return await this.stripe.prices.list({ product })
  }

  public getCustomer = async (stripe_cus_id: string) => {
    return await this.stripe.customers.retrieve(stripe_cus_id)
  }

  public getPaymentMethod = async (stripe_pm_id: string) => {
    return await this.stripe.paymentMethods.retrieve(stripe_pm_id)
  }

  public addCustomer = async (name: string, email: string, workspace_id: number) => {
    const customer = await this.stripe.customers.create({
      name: name,
      email,
      metadata: { workspace_id },
    })

    return customer
  }

  public updateCustomer = async (stripe_cus_id: string, params: Stripe.CustomerUpdateParams) => {
    const customer = await this.stripe.customers.update(stripe_cus_id, params)
    return customer
  }

  public addTestCardToCostumer = async (stripe_cus_id: string, workspace_id: number) => {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 9,
        exp_year: 2022,
        cvc: '314',
      },
      metadata: { workspace_id: workspace_id },
    })

    const customer = await this.stripe.paymentMethods.attach(paymentMethod.id, {
      customer: stripe_cus_id,
    })

    await this.repo.workspace.updateInfo(workspace_id, {
      default_payment_method: 'card',
      payment_methods: {
        upsert: {
          update: { stripe_pm_id: paymentMethod.id },
          create: { stripe_pm_id: paymentMethod.id },
        },
      },
    })

    return customer
  }

  public createSetupIntent = async (stripe_cus_id: string, workspace_id: number) => {
    const intent = await this.stripe.setupIntents.create({
      customer: stripe_cus_id,
      metadata: { workspace_id: workspace_id },
    })

    return intent
  }

  public getSubscription = async (stripe_sub_id: string) => {
    return await this.stripe.subscriptions.retrieve(stripe_sub_id)
  }

  public getSubscriptions = async (stripe_cus_id: string, status: Stripe.SubscriptionListParams.Status) => {
    return await this.stripe.subscriptions.list({ customer: stripe_cus_id, status })
  }

  public getSubscriptionPreview = async (
    stripe_sub_id: string,
    stripe_si_id: string,
    newItem: {
      stripe_price_id: string
      quantity: number
    },
  ) => {
    const invoice = await this.stripe.invoices.retrieveUpcoming({
      subscription: stripe_sub_id,
      subscription_items: [
        {
          id: stripe_si_id,
          price: newItem.stripe_price_id,
          quantity: newItem.quantity,
        },
      ],
      subscription_proration_date: Math.floor(Date.now() / 1000),
    })

    return invoice
  }

  public createSubscription = async (params: Stripe.SubscriptionCreateParams) => {
    const subscription = await this.stripe.subscriptions.create(params)
    return subscription
  }

  public updateSubscription = async (stripe_sub_id: string, params: Stripe.SubscriptionUpdateParams) => {
    const subscription = await this.stripe.subscriptions.update(stripe_sub_id, params)
    return subscription
  }

  public cancelSubscription = async (stripe_sub_id: string) => {
    return await this.stripe.subscriptions.cancel(stripe_sub_id)
  }

  public createInvoiceItem = async (stripe_cus_id: string, stripe_price_id: string, quantity: number) => {
    return await this.stripe.invoiceItems.create({
      customer: stripe_cus_id,
      price: stripe_price_id,
      quantity: quantity,
    })
  }

  public getAllInvoices = async (stripe_cus_id: string, limit: number) => {
    return await this.stripe.invoices.list({
      customer: stripe_cus_id,
      limit,
    })
  }

  public createInvoice = async (
    stripe_cus_id: string,
    workspace_id: number,
    collection_method: Stripe.InvoiceCreateParams.CollectionMethod,
  ) => {
    return await this.stripe.invoices.create({
      customer: stripe_cus_id,
      auto_advance: true,
      collection_method,
      days_until_due: collection_method === 'send_invoice' ? 4 : undefined,
      metadata: { workspace_id: workspace_id },
      expand: ['payment_intent'],
    })
  }

  public createSubscriptionCheckoutSession = async (
    customer_id: string,
    price_id: string,
    success_url: string,
    cancel_url: string,
  ) => {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      customer: customer_id,
      success_url,
      cancel_url,
    })
    return session.url as string
  }

  public createLoginLink = async (customer_id: string, return_url: string) => {
    const session = await this.stripe.billingPortal.sessions.create({ customer: customer_id, return_url })
    return session.url
  }

  public getCharges = async (customer_id: string) => {
    const charges = await this.stripe.charges.list({
      customer: customer_id,
      expand: ['data.invoice'],
    })
    const transactions: {
      amount: string
      currency: string
      receipt_url: string
      description: string
      paid: boolean
      status: Stripe.Charge.Status
      created_at: string
      price_id?: string
    }[] = []

    for (const charge of charges.data) {
      charge.invoice = charge.invoice as Stripe.Invoice
      const created_at = this.getIsoDateFromValidTimeStamp(charge.invoice.created) as string
      const futureItem = this.getNonNegativeItemFromInvoice(charge.invoice)
      transactions.push({
        amount: this.getDecimalFixedAmount(charge.amount),
        currency: charge.currency,
        receipt_url: charge.receipt_url as string,
        description: charge.description || 'Unknown',
        paid: charge.paid,
        status: charge.status,
        created_at,
        price_id: futureItem?.price?.id,
      })
    }

    return transactions
  }

  public payInvoice = async (stripe_in_id: string) => {
    return await this.stripe.invoices.pay(stripe_in_id)
  }

  public getPaymentIntent = async (pi_id: string) => {
    return await this.stripe.paymentIntents.retrieve(pi_id)
  }

  public getCustomerSubscriptionInfo = async (customer_id: string) => {
    const subscription = await this.getMostImportantSubscription(customer_id)
    const customer = await this.getCustomerFromSubscription(subscription)
    if (!subscription.items.data[0]) throw new Error('No subscription item found')
    const response: IWorkspaceSubscriptionInfo & { plan_id: string } = {
      status: subscription.status,
      currency: subscription.currency,
      plan_id: subscription.items.data[0].plan.id,
      amount: this.getDecimalFixedAmount(subscription.items.data[0].price.unit_amount as number),
      email: customer.email as string,
      ...this.getAvailableDatesFromSubscription(subscription),
    }
    await this.addCardToSubscriptionInfoResponse(subscription, response)
    return response
  }

  private getCustomerFromSubscription = async (subscription: Stripe.Subscription) => {
    const customer =
      typeof subscription.customer === 'string'
        ? await this.stripe.customers.retrieve(subscription.customer)
        : subscription.customer
    if (!customer || customer.deleted) throw new Error('Customer not found')
    return customer
  }

  private getAvailableDatesFromSubscription = (subscription: Stripe.Subscription) => {
    return {
      trial_end_date: this.getIsoDateFromValidTimeStamp(subscription.trial_end),
      trial_start_date: this.getIsoDateFromValidTimeStamp(subscription.trial_start),
      canceled_at: this.getIsoDateFromValidTimeStamp(subscription.canceled_at),
      will_be_cancelled_at: this.getIsoDateFromValidTimeStamp(subscription.cancel_at),
      ended_at: this.getIsoDateFromValidTimeStamp(subscription.ended_at),
      current_period_end: this.getIsoDateFromValidTimeStamp(subscription.current_period_end) as string,
      current_period_start: this.getIsoDateFromValidTimeStamp(subscription.current_period_start) as string,
    }
  }

  private addCardToSubscriptionInfoResponse = async (
    subscription: Stripe.Subscription,
    response: IWorkspaceSubscriptionInfo,
  ) => {
    let payment_method: Stripe.PaymentMethod | undefined

    if (subscription.default_payment_method) {
      payment_method =
        typeof subscription.default_payment_method === 'string'
          ? await this.stripe.paymentMethods.retrieve(subscription.default_payment_method)
          : subscription.default_payment_method
    } else if (subscription.latest_invoice) {
      payment_method = await this.getInvoicePaymentMethod(subscription.latest_invoice)
    }

    if (!payment_method?.card) return
    response.card = {
      brand: payment_method.card.brand,
      exp_month: payment_method.card.exp_month,
      exp_year: payment_method.card.exp_year,
      last4: payment_method.card.last4,
    }
  }

  private getMostImportantSubscription = async (customer_id: string) => {
    const subscriptions = await this.stripe.subscriptions.list({ customer: customer_id, status: 'all' })
    const most_important = this.findMostImportantSubscriptionFromSubList(subscriptions.data)
    return most_important
  }

  private findMostImportantSubscriptionFromSubList = (subscriptions: Stripe.Subscription[]) => {
    const priority = ['active', 'trialing', 'canceled', 'paused', 'unpaid', 'past_due', 'incomplete', 'incomplete_expired']
    const most_important = subscriptions.reduce((final: Stripe.Subscription | undefined, s) => {
      for (const status of priority) {
        if (final?.status === status) return final
        if (s.status === status) return s
      }
    }, undefined)
    if (!most_important) throw new Error('No subscription plan found')
    return most_important
  }

  private getInvoicePaymentMethod = async (invoice: string | Stripe.Invoice) => {
    const latest_invoice = typeof invoice === 'string' ? await this.stripe.invoices.retrieve(invoice) : invoice
    if (!latest_invoice.payment_intent) return
    const payment_intent =
      typeof latest_invoice.payment_intent === 'string'
        ? await this.stripe.paymentIntents.retrieve(latest_invoice.payment_intent)
        : latest_invoice.payment_intent
    if (!payment_intent) return
    const payment_method =
      typeof payment_intent.payment_method === 'string'
        ? await this.stripe.paymentMethods.retrieve(payment_intent.payment_method)
        : payment_intent.payment_method
    if (!payment_method) return
    return payment_method
  }

  private getNonNegativeItemFromInvoice(invoice: Stripe.Invoice) {
    return invoice.lines.data.find((item) => {
      return item.amount >= 0
    })
  }

  private getDecimalFixedAmount = (decimal_amount: number) => {
    return (decimal_amount / 100).toFixed(2)
  }

  private getIsoDateFromValidTimeStamp = (timestamp: number | null) => {
    if (!timestamp) return
    return new Date(timestamp * 1000).toISOString()
  }
}
