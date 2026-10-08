# Nightly rate in the Beds24 booking summary

For each property, open Booking Engine > Property Booking Page > Developers.
Append the following to the existing Advanced HTML Settings (do not replace existing content):

```html
<script src="https://villadelaroca.com/beds24-nightly-breakdown.js" defer></script>
```

Properties: Villa de La Roca (316599) and Villa la Roca 5 Bedsroom (318544).

This adds the average rate per accommodation per night × nights (× quantity when multiple accommodations are selected) = accommodation subtotal. It reads the actual Beds24 checkout fields and leaves all prices, taxes and payment fields unchanged. Average nightly rate is used because rates can vary by date. English and Spanish labels follow the booking language.

Verify in the public booking engine up to the guest details screen, without submitting a reservation: one suite, entire villa, two and three nights, and two suites. Confirm the calculation matches the existing accommodation subtotal.

Activation requires access to the Beds24 account. Publishing this file alone does not change the cross-origin Beds24 iframe.
