# Mehis Payment Integration Research

## Overview
We need a payment processor to accept subscriptions for Mehis Premium and Family plans.

## Options Compared

### Paddle (Recommended for EU)
- **Best for:** European customers, VAT handling
- **Pros:** Handles EU VAT/sales tax automatically, integrated billing
- **Cons:** Higher fees than Stripe
- **Website:** https://paddle.com
- **Pricing:** 5% + 50c per transaction

### Stripe
- **Best for:** US customers, more payment methods
- **Pros:** More integrations, widely used
- **Cons:** You handle tax compliance
- **Website:** https://stripe.com
- **Pricing:** 2.9% + 30c per transaction

---

## Recommendation: Paddle (for now)
Since Taavi is in Estonia (EU), Paddle is better because:
1. Automatic VAT handling for EU
2. Built-in subscription management
3. Easier regulatory compliance

---

## Integration Steps (Paddle)

### 1. Sign Up
- Go to https://paddle.com
- Create account (vendor)
- Complete verification

### 2. Create Products
In Paddle Dashboard:
- **Free** (€0) - No payment needed
- **Premium Monthly** - €9.99/mo
- **Premium Annual** - €99/yr
- **Family Monthly** - €19.99/mo
- **Family Annual** - €199/yr

### 3. Get API Keys
- Paddle Client Token (for frontend)
- Paddle API Key (for webhooks)

### 4. Add to Website

**Option A: Overlay Checkout (Easiest)**
```html
<script src="https://cdn.paddle.com/paddle/paddle.js"></script>
<script>
    Paddle.Setup({ vendor: YOUR_VENDOR_ID });
    
    function openCheckout(productId) {
        Paddle.Checkout.open({
            product: productId,
            successURL: 'https://yoursite.com/success.html',
            cancelURL: 'https://yoursite.com/cancel.html'
        });
    }
</script>
```

**Option B: Link (Simplest)**
```html
<a href="https://checkout.paddle.com/link/YOUR_LINK_ID">
    Subscribe Now
</a>
```

### 5. Webhook Setup
- Create endpoint: `https://yourdomain.com/webhook`
- Handle events: `subscription_created`, `subscription_updated`, `subscription_cancelled`
- Update user tier in database

---

## Integration Steps (Stripe - Alternative)

### 1. Sign Up
- Go to https://stripe.com
- Create account

### 2. Create Products
In Stripe Dashboard:
- Create API products for each plan
- Get Price IDs

### 3. Add to Website
```html
<script src="https://js.stripe.com/v3/"></script>
<script>
    const stripe = Stripe('YOUR_PUBLISHABLE_KEY');
    
    // Redirect to Stripe Checkout
    stripe.redirectToCheckout({
        lineItems: [{ price: 'PRICE_ID', quantity: 1 }],
        mode: 'subscription',
        successUrl: 'https://yoursite.com/success',
        cancelUrl: 'https://yoursite.com/cancel'
    });
</script>
```

### 4. Webhook
- Handle `checkout.session.completed`
- Handle `customer.subscription.updated`
- Handle `customer.subscription.deleted`

---

## Current Status (April 11, 2026)

- [ ] Sign up for Paddle account
- [ ] Verify account
- [ ] Create products in Paddle
- [ ] Get API keys
- [ ] Update checkout.html with real payment
- [ ] Test payment flow
- [ ] Set up webhook to update user tier

---

## Files to Update
- `website/checkout.html` - Add Paddle integration
- `website/success.html` - Payment success page
- `website/cancel.html` - Payment cancel page
- Bot code - Handle webhook events

---

## References
- Paddle Docs: https://developer.paddle.com
- Stripe Docs: https://docs.stripe.com