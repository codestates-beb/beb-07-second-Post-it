import { Contract } from "web3-eth-contract";
import web3 from "../config/web3";
import bytecode from "../erc20byte";

const abi20 = require("./erc20abi.json");
let contract: Contract;
let contract_address = process.env.CONTRACT_ADDRESS

async function Deploy() {
    console.log("배포 시작")
    const serverAddress = await getServerAddress();
    contract = await new web3.eth.Contract(abi20).deploy(bytecode).send({
        from: serverAddress, 
        gas: 4700000
    })
}

async function existsContract() {
    contract = new web3.eth.Contract(abi20, contract_address);
}

async function getServerAddress() {
    const accounts = await web3.eth.getAccounts();
    const serverAddress = accounts[0];
    return serverAddress;
}

async function getContractAddress() {
    console.log("컨트랙트 주소 뽑기")
    const contractAddress = contract.options.address;
    return contractAddress;
}

async function getContractObj() {
    const contractAddress = await getContractAddress();
    const testContract = new web3.eth.Contract(abi20, contractAddress);
    return testContract;
}

async function BalanceOf(address : string) {
    if (contract == undefined) {
        await existsContract();
    }
    let erc20amount = await contract.methods.balanceOf(address).call();
    return erc20amount;
}

// const Obj = getContractObj();

export default {
    getServerAddress,
    getContractAddress,
    BalanceOf,
    Deploy,
    getContractObj,
    // Obj
}