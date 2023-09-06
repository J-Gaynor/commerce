# NewBay API Documentation

## Introduction

Welcome to the NewBay API documentation. This API allows you to perform various functionalities on the NewBay e-commerce site. This document provides an overview of available endpoints and usage instructions.

## SwaggerUI Documentation

For detailed information about available endpoints, request/response formats, and interactive testing, refer to the [SwaggerUI documentation](https://app.swaggerhub.com/apis-docs/JOSEPHGAYNOR12/NewBay/1.0.0).

## API Endpoints

The following is a list of some common available API endpoints:

- **Get All Listings**: Retrieve a list of all listings on NewBay.
  - Endpoint: `/`
  - Method: GET
  - Usage: `/` 
  
- **Get Categorised Listings**: Retrieve a list of all listings on NewBay that are of a certain category.
  - Endpoint: `/{category}`
  - Method: GET
  - Usage: `/books`
  - Valid Categories:
    - books
    - clothes
    - education
    - electronics
    - fashion
    - games
    - gardening
    - sports
    - trading_cards
    - video_games

- **Get User Information**: Retrieve user details.
  - Endpoint: `/users/{username}`
  - Method: GET
  - Usage: `/users/{username}`

## User and Listing Routes

Some routes require specifying a user or a listing:

- To specify a user, use the route: `/users/{username}`
- To specify a listing, use the route: `/listing/{listing_id}`

Consider including the username in URLs for better user experience.

## Authentication

Routes related to users, such as purchasing, viewing carts, and viewing orders, may require login information to protect sensitive data. Refer to the SwaggerUI documentation for authentication details.

## License

This API is provided under the MIT License. For full details, please refer to the [MIT License](link-to-license).

Please note that this API is intended for personal use and has no use outside of being a personal project.
