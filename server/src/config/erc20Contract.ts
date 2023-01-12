import {Contract} from 'web3-eth-contract';
import Web3 from "web3";

class erc20Contract {
    _contract : Contract;
    _web3 : Web3;
    constructor(Contract : Contract) {
        this._contract = Contract
        let provider  = process.env.PROVIDER_URI || "http://127.0.0.1:7545";
        this._web3 = new Web3(provider);
    }

    async transfer(to : string, from : string, amount : number) {
        if (!await this.checkContract()) {
            return
        }
        await this._contract.methods.transfer(to, amount).send({from});
    }

    async balanceOf(address : string) {
        const balance = await this._contract.methods.balanceOf(address).call();
        return balance
    }

    async totalSupply() {
        return await this._contract.methods.totalSupply().call();
    }

    async checkContract() : Promise<boolean> {
        if (this._contract == undefined || this._contract == null) {
            return false;
        }
        return true;
    }

    async approve(to_address : string, from_address : string, amount : number) {
        await this._contract.methods.approve(to_address, amount).send({from : from_address})
    }
}

export default (
    erc20Contract
)