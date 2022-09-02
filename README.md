# cryptoAPI
An API to fetch Ethereum user transactions and save them to a database.

## Prerequisite data

Get an API key from https://docs.etherscan.io/getting-started/viewing-api-usage-statistics

Get MongoDB URI for your Cluster on MongoDB Atlas from Database Cluster -> Connect -> Connect your application

## Installation

git clone https://github.com/simranbhatt/cryptoAPI.git

cd CrpytoAPI

npm install

Create .env file based on .env_template

npm start

## To Use

On Postman/Browser:

GET localhost:{PORT}/allUserTransactions/{useraddress} 

GET localhost:{PORT}/getBalance/{useraddress} 



