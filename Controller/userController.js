const PORT = 8000

const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const app = express();
const User = require('../Model/userEntity.js').User;
const Balance = require('../Model/balanceEntity.js').Balance;
const { Ether } = require('../Model/etherEntity');

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
//const uri = process.env.MONGODB_URI;
const uri = 'mongodb+srv://testUser:QViusmy7WuvhteVr@sharedcluster.rctpodh.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri);

//function to get user transactions from etherscan api 
async function userTransactions(userAddress) {
  var url = 'https://api.etherscan.io/api/';

  var params = {
    module: 'account',
    action: 'txlist',
    address: '0xce94e5621a5f7068253c42558c147480f38b5e0d',
    apikey: 'M6YYM31SM782UPJREXRJSFNGXMP1HAE6RJ'
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
    const ether = new Ether({ valueInINR: inrValue });
    ether.save();
    return inrValue;
  } catch (err) {
    console.log(err);
  }
};

//saving the current value of Ethereum to the database every 10 minutes
var refresh = setInterval(ethereumValue, 600000);

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

