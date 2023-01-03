import axios from 'axios';
import React, { useEffect, useState } from 'react';

// user : users,
// post : posts,
// nft : nfts

function MyPage() {
    const [user, setUser] = useState({address : "", created_at : "", eth_amount : 0, nickname : "", token_amount: 0, id : 0})
    const [postList, setPostList] = useState([{id : 0, user_id : 0, title : "", content : "", created_at : "", views : 0}])
    
    useEffect(() => {
        axios.get(`http://localhost:4000/users/mypage/${sessionStorage.getItem("user_id")}`)
        .then((response) => {
            console.log(response.data)
            setPostList(response.data.post)
            setUser(response.data.user)
        })
         
        console.log("마이페이지 요청")
    }, [])

    return(
        <main>
            <h2>{user.nickname}</h2>
            <hr />
            <p>Address : {user.address}</p>
            <p>ETH : {user.eth_amount}</p>
            <p>TOKEN : {user.token_amount}</p>
            <hr />

            {postList.map((item) => {
                return (
                    <div>
                        
                        <a href={`/post/detail?id=${item.id}`}><h3>{item.title}</h3></a>        
                        <p>Created At : {item.created_at}</p>
                        <p>Views : {item.views}</p>
                    <hr />
                    
                    </div>
                )
            })}


        </main>
    )
}

export default MyPage;