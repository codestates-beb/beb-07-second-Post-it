import {Contract} from 'web3-eth-contract';
import Web3 from "web3";

class erc721Contract {
    _contract : Contract;
    _web3 : Web3;
    constructor(Contract : Contract) {
        this._contract = Contract
        let provider  = process.env.PROVIDER_URI || "http://127.0.0.1:7545";
        this._web3 = new Web3(provider);
    }

    async mintNFT(from_address : string, token_uri : string, serverAddress : string) {

        const mintData = this._contract.methods.mintNFT(from_address, token_uri).encodeABI();

        const tx = {
            from: serverAddress,
            to: process.env.CONTRACT721_ADDRESS,
            gas: 5000000,
            data: mintData,
        };

        const signTx = await this._web3.eth.accounts.signTransaction(tx, String(process.env.SERVER_PRIVATE_KEY));
        if(signTx.rawTransaction) {
            const signedTx = await this._web3.eth.sendSignedTransaction(signTx.rawTransaction);
            return signedTx.transactionHash
        }

        return "";
    }

    async getTokenId(tokenURI : string) {
        const token_id = this._contract.methods.getTokenId(tokenURI).call();
        return token_id;
    }
}

export default(
    erc721Contract
)