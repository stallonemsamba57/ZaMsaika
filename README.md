# ZaMsika — Buy • Sell • Transport

A front-end prototype of **ZaMsika**, a digital marketplace for Malawi that connects farmers, traders, suppliers, retailers and transporters in one place. It is plain HTML, CSS and JavaScript, with no build step and no backend.

## Project structure

```
zamsika/
├── index.html   # Page markup: landing page + platform dashboard + cart/checkout modals
├── style.css    # All styling (responsive breakpoints at 1100px, 900px and 700px)
├── script.js    # All behaviour (sector navigation, listings, cart, checkout, chat)
└── README.md
```

## Getting started

1. Unzip the folder.
2. Open `index.html` in a browser, or serve it locally:

   ```bash
   python3 -m http.server 8000
   # then visit http://localhost:8000
   ```

An internet connection is needed for icons (see *External resources*).

## What's inside

**Landing page**: hero section, featured products, About section and a contact footer. The header search sends you to the matching sector (for example "truck" opens Logistics, "phone" opens Retail).

**Platform dashboard** with six sectors, each with its own sub-tabs:

| Sector | Highlights |
|---|---|
| Agriculture | Product listings, pricing, market, price negotiation |
| Retail | Shop, products, sellers, orders |
| Logistics | Fleet, shipment tracking, booking |
| Supply chain | Suppliers, inventory, procurement, pricing |
| Payments | Wallet, transactions, overview |
| AI chat | Main assistant with quick prompts |

**Marketplace features**
- Add your own Agriculture and Retail listings, and search and filter products.
- Shopping cart with a cart count in the header, a cart view and checkout.
- Payment methods shown at checkout: Airtel Money, TNM Mpamba and Bank Transfer.
- Unified price tool that pushes one price across Agriculture, Logistics and Retail.

## Data and storage

Everything is stored in the visitor's own browser using `localStorage`:

| Key | Contents |
|---|---|
| `zamsika_agri_products` | Agriculture listings |
| `zamsika_retail_products` | Retail listings |
| `zamsika_cart` | Cart items |

Clearing the browser's site data resets the site to the built-in sample listings.

## Prototype limitations

- **Payments are simulated.** Checkout only shows a confirmation message; no money moves.
- **The chat assistant gives placeholder replies**, and the logistics tracking, supplier and wallet figures are sample data.
- **`sendPrompt(...)` buttons.** Many dashboard buttons call `sendPrompt(...)`, which only exists inside Claude's widget environment. `script.js` includes a small fallback that sends those prompts to the built-in chat assistant instead.
- **No user accounts or server.** Listings are not shared between visitors.

## Next steps to make it real

- Add a backend (for example Node/Express, Django or Firebase) with user accounts and a database for listings, orders and shipments.
- Integrate the Airtel Money and TNM Mpamba payment APIs, and a bank gateway.
- Replace `reply()` and the `botReplies` placeholders in `script.js` with a real AI service called from your server. Never put API keys in front-end code.
- Move icons and images to local files if you need the site to work offline.

## External resources

- [Tabler Icons](https://tabler.io/icons) (webfont, loaded from jsDelivr): dashboard icons
- [Simple Icons](https://simpleicons.org) (loaded from cdn.simpleicons.org): social and payment logos

## Deploying

Upload the folder to any static host (GitHub Pages, Netlify, Vercel or cPanel hosting) with `index.html` at the root.

## Customising

- Colours: the `:root` variables at the top of `style.css` (`--blue`, `--green`, `--dark`, and so on).
- Sample products: `defaultAgriProducts` and `defaultRetailProducts` in `script.js`.
- Contact details and footer links: the footer section of `index.html`.
