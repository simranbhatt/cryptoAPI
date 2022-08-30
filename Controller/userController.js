const PORT = 8000

const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../Model/userEntity.js');

const app = express();
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
//const uri = process.env.MONGODB_URI;
const uri = 'mongodb+srv://herokuapp1:qazwsxedc@sharedcluster.rctpodh.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri);


async function userTransactions(userAddress) {
var url = 'https://api.etherscan.io/api/';

var params = { 
             module: 'account',
             action: 'txlist',
             address: '0xce94e5621a5f7068253c42558c147480f38b5e0d',
             apikey: 'M6YYM31SM782UPJREXRJSFNGXMP1HAE6RJ'
 };
 console.log(params);
const res = await axios.get(url, { params: params });

/*
//returning summarized transaction data

var dataArray = [];

Object.values(res.data.result).forEach((item)=>{
    dataArray.push({'transactionIndex': item.transactionIndex, 'from': item.from, 'to': item.to, 'value': item.value});
  });
*/

return res.data.result;
    
}

app.get('/allUserTransactions/:address', (req, res) => {
    const userAddress = req.params.address;
    (async () => {
      try {
        const dataArray = await userTransactions(userAddress);
        const user = new User({'address': userAddress, 'transactionData': dataArray});
        user.save();
        res.json(user);
      } catch (err) {
        console.log(err);
      }

    })();
})

