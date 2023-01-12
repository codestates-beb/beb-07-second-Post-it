import Web3 from "web3";

require("dotenv").config()

import {AbiItem} from 'web3-utils';
import erc20Contract from "./erc20Contract";
import erc721Contract from "./erc721Contract";

// declare let provider: string;
// declare let  : Web3;
class Web3Connect {
    _web3 : Web3;
    constructor() {
        // const provider = ;
        this._web3 = new Web3("http://127.0.0.1:7545");
    }

    async getServerAddress() {
        const accountList = await this._web3.eth.getAccounts();
        return accountList[0]
    }

    async createAddress(password : string) {
        return await this._web3.eth.personal.newAccount(password);
    }

    async getBalance(address: string) : Promise<string> {
        const balance = await this._web3.eth.getBalance(address);
        return balance;
    }

    async getERC20Contract(abi :AbiItem, contract_address : string)  {
        const contract = new this._web3.eth.Contract(abi, contract_address);

        const ConnContract = new erc20Contract(contract)

        return ConnContract;
    }

    async getERC721Contract(abi :AbiItem, contract_address : string){
        const contract = new this._web3.eth.Contract(abi, contract_address);

        const ConnContract = new erc721Contract(contract)

        return ConnContract;
    }
    async createSignTx(to_address : string, from_address :string, value : string) {
        // 트랜잭션 서명
        const signTx = await this._web3.eth.accounts.signTransaction({
            to: to_address,
            from : from_address,
            value: value,
            gas: 21000,
        }, String(process.env.SERVER_PRIVATE_KEY) || "")
        
        if (signTx.rawTransaction) {
            // 서명 후 전송
            await this._web3.eth.sendSignedTransaction(signTx.rawTransaction)
        }
    }

    async unlockAccount(address:string, password: string, unlockDuration :number) {
        await this._web3.eth.personal.unlockAccount(address, password, unlockDuration);
    }

    async sendEth(userAddress : string) {
        await this.createSignTx(userAddress, "", "1000000000000000000")
    }

}

export default (
    // web3,
    Web3Connect
);