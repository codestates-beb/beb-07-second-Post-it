import Web3 from "web3";
require("dotenv").config()

const provider : string = process.env.PROVIDER_URI || "";

const web3 : Web3 = new Web3(provider);

export default web3;