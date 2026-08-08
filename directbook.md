# Direct-book backup

Temporary change made on 2026-08-08 while migrating reservations to Beds24.

## Header Book Now / Reserve ahora button

Source file: `src/components/site/Header.astro`

Previous generated href:

```text
https://direct-book.com/properties/gub5966?locale=${bookingLocale}&items[0][adults]=2&items[0][children]=0&items[0][infants]=0&currency=MXN&checkInDate=2022-11-25&checkOutDate=2022-11-26&trackPage=yes
```

Previous labels:

```text
English: Book Now!
Spanish: Reserve ahora
```

Previous Astro values:

```astro
const bookLabel = isSpanish ? "Reserve ahora" : "Book Now!";
const bookingLocale = isSpanish ? "es" : "en";
```

## Home reservation engines

Source files:

```text
src/raw-pages/index.html
src/raw-pages/es/index.html
```

Previous form action:

```text
https://direct-book.com/properties/gub5966
```

Previous method and target:

```html
<form action="https://direct-book.com/properties/gub5966" method="get" target="_blank">
```

English button label:

```text
Reserve
```

Spanish button label:

```text
Reserva
```

Hidden fields:

```text
hidden_field_1=hidden_value_1
hidden_field_2=hidden_value_2
hidden_field_3=hidden_value_3
hidden_field_4=hidden_value_4
```

## Room/rates content CTA href

```text
https://direct-book.com/properties/gub5966?locale=en
```
