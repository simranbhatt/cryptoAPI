const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();


mongoose.connect("mongodb://localhost:27017")


async function userTransactions() {
var url = 'https://api.etherscan.io/api/';

var params = { 
             module: 'account',
             action: 'txlist',
             address: '0xce94e5621a5f7068253c42558c147480f38b5e0d',
             apikey: 'M6YYM31SM782UPJREXRJSFNGXMP1HAE6RJ'
 };
const res = await axios.get(url, { params: params });
let dataArray = [];
Object.values(res.data.result).forEach((item)=>{
    dataArray.push({'transactionIndex': item.transactionIndex, 'from': item.from, 'to': item.to, 'value': item.value});
  });
  console.log(dataArray)
    
}

app.get('/userTransactions', (req, res) => {

})
userTransactions();

