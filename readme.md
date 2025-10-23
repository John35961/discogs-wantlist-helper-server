# Discogs Wantlist Helper Server

API wrapper for the Discogs API, exposing relevant endpoints for the [Discogs Wantlist Helper](https://github.com/John35961/discogs-wantlist-helper) Chrome extension.
To make calls, you'll need to create a [Discogs API V2 application](https://www.discogs.com/settings/developers) to get your `CONSUMER_KEY` and `CONSUMER_SECRET`.

## Tools

* [Express.js](https://expressjs.com/) as an API wrapper

* [Render](https://render.com/) to host the service

## dependencies

* express
* cors
* dotenv
* oauth-1.0a
* crypto-js

## Run locally

1. Clone the repo with `git clone git@github.com:John35961/discogs-wantlist-helper-server.git` then `cd discogs-helper-server`

2. Install dependencies with `npm install`

3. Start the server with `npm start`

4. Server is running at `http://localhost:3000/discogs/api/v1`
