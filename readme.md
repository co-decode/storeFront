# My Lifting Store
An ecommerce mock up.

## Technologies used:
In the back end:
Database
- MongoDB and Mongoose
Server
- NodeJS, Express
GraphQL
- Apollo Server

In the front end:
Environment
- Vite and Typescript
Framework
- React, React-Router and Redux
User Interface
- Bootstrap 5.1 and CSS
GraphQL Client
- URQL

Version Control:
- Git and Github

Deployment:
Database
- MongoDB Atlas
Server
- Heroku
Client
- Github Pages

## Components and Features:
My Fitness Store manages global state with Redux, using @reduxjs/toolkit to create slices and reducers.

My Fitness Store features a _Navbar_, which is modelled on Bootstrap's navbar component.
    The Navbar is responsive:
    - At smaller screen widths, the Navbar links are condensed into a single menu button.
        Clicking the menu button reveals the links in an inline configuration, which is comfortable for users due to its space efficiency and minimal impact on the layout.
    - At larger screen widths, the Navbar fonts scale up to ensure that the text is readable even on 4K screens.

My Fitness Store features six pages:
- Home
- Shop
- Cart
- Login
- Profile
- About

### The Home Page:
The home page features:
- Text that is responsive to the screen width, and to changes in screen width.
- A responsive background JPEG image.

Below screen widths of 576px, parts of the home page text are removed by way of a CSS media query.
This ensures that the text layout does not clash with the background image.

Above screen widths of 1660px, the home page text is scaled up so that the layout is functional and aesthetic for 4K screens.

The background image is scaled down from its original quality to ensure reasonable data size for performance.
It responds to portrait and landscape orientations and never breaks due to CSS media queries and its 1 to 1 aspect ratio.

### The Shop Page:
The shop page features:
- Shop items that arrange themselves in a fully responsive manner based on variable GraphQL database queries.
- Quantity options and Add to Cart functionality, which updates an Order Details object for submission as a database mutation.
- A pagination bar that is fully responsive to the number of pages needed to display all items.
- A Go to Cart button that appears only when there are items in the cart.
- An 'Added to Cart' toast which confirms to the user that their actions are effective.

Shop items are fully responsive to changes in number of items per row;
eg. If the screen is wide enough to fit 4 items per row, the query will request a total of 8 items to display on the page.
    If the screen can fit 3 items, the query will only request 6 items.

Shop items are also responsive to larger screen sizes. Font and image sizes all scale up at the 1660px screen width mark.

Upon changing screen sizes, the page number is maintained. However, if the the screen size is increasing and the page number is too high, the page number will reset back to the first page to ensure that users are not stuck on page 6 when there are only 2 pages for their screen size.

For smaller screen size, the layout of the pagination bar and the Go to Cart button lie on the same row to make more efficient use of space. The confirmation toast also changes position to ensure that it is not in the way.

### The Cart Page: