const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const app = express();
const { User } = require('../Model/userEntity.js');
const { Balance } = require('../Model/balanceEntity.js');
const { Ether } = require('../Model/etherEntity');
require('dotenv').config()

const PORT = process.env.PORT_VALUE

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

const uri = process.env.MONGODB_URI;

mongoose.connect(uri);

//function to get user transactions from etherscan api 
async function userTransactions(userAddress) {
  var url = 'https://api.etherscan.io/api/';

  var params = {
    module: 'account',
    action: 'txlist',
    address: userAddress,
    apikey: process.env.API_KEY
  };
  const response = await axios.get(url, { params: params });

  return response.data.result;
};

//function that returns the current value of Ethereum and saves it to the database 
async function ethereumValue() {
  try {
    var url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr';
    const response = await axios.get(url);
    //getting inr value of Ethereum from coingecko API response
    const inrValueString = Object.values(response.data).map((item) => { return item.inr });
    const inrValue = parseFloat(inrValueString);
    return inrValue;
  } catch (err) {
    console.log(err);
  }
};

//saving the current value of Ethereum to the database every 10 minutes
setInterval(async () => {
  try { const etherValue = await ethereumValue();
    const ether = new Ether({ valueInINR: etherValue });
    ether.save();
  } catch(err) { console.log(err) };

}, 600000);

//API to get all user transactions based on the provided user address
app.get('/allUserTransactions/:address', (req, res) => {
  const userAddress = req.params.address;
  (async () => {
    try {
      const dataArray = await userTransactions(userAddress);
      const user = new User({ 'address': userAddress, 'transactionData': dataArray });
      user.save();
      res.json(user);
    } catch (err) {
      console.log(err);
    }

  })();
});

//API to get user balance and current ethereum value 
app.get('/getBalance/:address', (req, res) => {
  const userAddress = req.params.address;
  (async () => {
    try {
      const dataArray = await userTransactions(userAddress);
      var totalValue = 0;
      //calculating balance from transaction data
      Object.values(dataArray).forEach((item) => {
        if (item.to === userAddress)
          totalValue += parseFloat(item.value);
        else if (item.from === userAddress)
          totalValue -= parseFloat(item.value);
      });
      const etherValueInINR = await ethereumValue();
      const balance = new Balance({ 'address': userAddress, 'currentBalance': totalValue, 'etherValue': parseFloat(etherValueInINR) });
      balance.save();
      res.json(balance);
    } catch (err) {
      console.log(err);
    }

  })();
})