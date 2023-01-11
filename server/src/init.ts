import { json } from "stream/consumers";
import web3 from "./config/web3";
import AppDataSource from "./db/data-source";
import user from "./entity/user";
import erc20byte from "./erc20byte";
import erc721byte from "./erc721byte";
const abi20 = require("./erc20abi.json");
const abi721 = require("./erc721abi.json");
require("dotenv").config()
// import contractAddress from "./config/addressConfig";

async function create_server () {
    const accounts = await web3.eth.getAccounts();
    const serverAddress = accounts[0];
    let eth_amount = await web3.eth.getBalance(serverAddress);
    const users = await AppDataSource
        .getRepository(user)
        .createQueryBuilder()
        .select()
        .where("address = :address", {address:serverAddress})
        .getOne()
        
    if(users) {
        console.log("서버 지갑 이미 있습니다.");
    } else {
        
        let erc20Deploy = await new web3.eth.Contract(abi20).deploy(erc20byte).send({
            from: serverAddress, 
            gas: 4700000
        })


        process.env.CONTRACT20_ADDRESS = erc20Deploy.options.address;
        console.log("erc20 ::" + process.env.CONTRACT20_ADDRESS)
        

        const erc20Contract = new web3.eth.Contract(abi20, process.env.CONTRACT20_ADDRESS);

        const getTokenAmount = await erc20Contract.methods.balanceOf(serverAddress).call();

        const info = {
            nickname : "server",
            password : "secret",
            address : serverAddress,
            token_amount : getTokenAmount,
            eth_amount : String(eth_amount),
        }

        let erc721Deploy = await new web3.eth.Contract(abi721).deploy(erc721byte).send({
            from: serverAddress,
            gas: 4700000
        })
        
        process.env.CONTRACT721_ADDRESS = erc721Deploy.options.address;
        console.log("erc271 :: " + process.env.CONTRACT721_ADDRESS)
        const erc721Contract = new web3.eth.Contract(abi721, process.env.CONTRACT721_ADDRESS);

        const data = erc721Contract.methods.setToken(process.env.CONTRACT721_ADDRESS).encodeABI();
        console.log(process.env.CONTRACT721_ADDRESS)
        const setSignTokenTx = await web3.eth.accounts.signTransaction({

            from : serverAddress,
            to : process.env.CONTRACT721_ADDRESS,
            gas : 500000,
            data : data

        }, String(process.env.SERVER_PRIVATE_KEY));

        if (setSignTokenTx.rawTransaction) {
            await web3.eth.sendSignedTransaction(setSignTokenTx.rawTransaction);
        }

        // 디비에 저장
        const userRepo = AppDataSource.getRepository(user);
        const userss = userRepo.create(info);
    
        await userRepo
        .save(userss)
        .then((data) => {
            console.log("서버계정을 생성해주었습니다.!");
        })
        .catch((err) => console.log(err));
    }
}
export default create_server;
