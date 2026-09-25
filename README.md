# JAGAA's Munchies — Website

A static homepage for JAGAA's Munchies. Menu, prices and ordering policy come from the official snack menu poster (`images/menu-poster.jpg`).

## Run locally
Open `index.html`, or serve the folder:

```
python3 -m http.server 8000
```

## Structure
- `index.html` — page markup
- `css/styles.css` — styles (amber/brown/cream palette; Playfair Display, Inter and Dancing Script fonts)
- `js/main.js` — menu data and prices (`MENU`), tabs, cart, order-by-text, carousel, lightbox
- `images/` — photos

## Updating
- **Prices / items:** edit the `MENU` array in `js/main.js`, plus the price text in the "Fresh Out of the Pan" and "Daddies" sections of `index.html`.
- **Phone number:** search for `0766189177`.
- **Reviews:** the four reviews in `index.html` are samples. Replace them with real customer feedback before launch.

## How ordering works
The cart has no payment backend. "Send Order by Text" opens the customer's SMS app with the order and total already filled in, addressed to 0766189177. This matches the poster: food is made only after the order is placed and paid for, and delivery is arranged directly with the customer.
