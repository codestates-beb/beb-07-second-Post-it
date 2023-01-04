import web3 from "./config/web3";

async function create_server () {
    
    console.log("서버만들기 들어갑니다");
    const accounts = await web3.eth.getAccounts();
    const serverAddress = accounts[0];
    const eth_amount = await web3.eth.getBalance(serverAddress);
    console.log(eth_amount)
    
    // const users = await AppDataSource
    //     .getRepository(user)
    //     .createQueryBuilder()
    //     .select()
    //     .where("address = :address", {address:serverAddress})
    //     .getOne()

    // if(users) {
    //     console.log("서버 지갑 이미 있습니다.");
    // }
    // else { //서버 지갑이 없으면 새로 insert해줘야함
    //     const info = {
    //         nickname : "server",
    //         password : "secret", //그냥 password  OR  private_key
    //         address : serverAddress,
    //         token_amount : 1111111, //서버계정으로 token배포하고 배포한 토큰수만큼 가져오기
    //         eth_amount : 222222, //eth양을 가져오는 함수
    //     }
    //     const userRepo = AppDataSource.getRepository(user);
    //     const userss = userRepo.create(info);
    
    //     await userRepo
    //     .save(userss)
    //     .then((data) => {
    //         console.log(data);
    //     })
    //     .catch((err) => console.log(err));
    //     console.log("서버계정을 생성해주었습니다.!");
    // }
}

export default create_server;