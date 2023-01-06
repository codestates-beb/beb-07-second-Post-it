import web3 from "./config/web3";
import AppDataSource from "./db/data-source";
import user from "./entity/user";
import bytecode from "./erc20byte";

async function create_server () {
    const accounts = await web3.eth.getAccounts();
    const serverAddress = accounts[0];
    let eth_amount = await web3.eth.getBalance(serverAddress);
    const abi721 = require("./erc20abi.json");

    const users = await AppDataSource
        .getRepository(user)
        .createQueryBuilder()
        .select()
        .where("address = :address", {address:serverAddress})
        .getOne()

    if(users) {
        console.log("서버 지갑 이미 있습니다.");
        /* console.log(bytecode); */
    }
    else {
        var test = new web3.eth.Contract(abi721).deploy(bytecode).send({
            from: serverAddress, 
            gas: 4700000
        })

        const contractAddress = (await test).options.address;
        const testContract = new web3.eth.Contract(abi721, contractAddress);
        let erc20amount = await testContract.methods.balanceOf(serverAddress).call();

        const info = {
            nickname : "server",
            password : "secret",
            address : serverAddress,
            token_amount : "0", //서버계정으로 token배포하고 배포한 토큰수만큼 가져오기
            eth_amount : String(eth_amount),
        }

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