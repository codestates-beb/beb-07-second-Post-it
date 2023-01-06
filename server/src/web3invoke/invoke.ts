import { Contract } from "web3-eth-contract";
import web3 from "../config/web3";
import bytecode from "../erc20byte";

const abi721 = require("./erc20abi.json");
let contract: Contract;

async function Deploy() {
    const serverAddress = await getServerAddress();
    contract = await new web3.eth.Contract(abi721).deploy(bytecode).send({
        from: serverAddress, 
        gas: 4700000
    })
}

async function getServerAddress() {
    const accounts = await web3.eth.getAccounts();
    const serverAddress = accounts[0];
    return serverAddress;
}

async function getContractAddress() {
    const contractAddress = contract.options.address;
    const testContract = new web3.eth.Contract(abi721, contractAddress);
    return testContract;
}

async function BalanceOf(address : string) {
    const contractAddress = await getContractAddress()
    let erc20amount = await contractAddress.methods.balanceOf(address).call();
    return erc20amount;
}

async function makeTx(to :string, from : string) {
    // const info = {
    //     nickname : "server",
    //     password : "secret",
    //     address : serverAddress,
    //     token_amount : "0", //서버계정으로 token배포하고 배포한 토큰수만큼 가져오기
    //     eth_amount : String(eth_amount),
    // };
    // return info;
}

export default {
    getServerAddress,
    getContractAddress,
    BalanceOf,
    Deploy
}