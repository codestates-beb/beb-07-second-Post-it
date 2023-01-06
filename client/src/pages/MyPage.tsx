import axios from 'axios';
import React, { useEffect, useState } from 'react';

import "./MyPage.css"

function MyPage() {
    const [user, setUser] = useState({address : "", created_at : "", eth_amount : 0, nickname : "", token_amount: 0, id : 0})
    const [postList, setPostList] = useState([{id : 0, user_id : 0, title : "", content : "", created_at : "", views : 0}])
    const [NFTList, setNFTList] = useState([])
    const [isSet, setIsSet] = useState(true)

    const [toAddress, setToAddress] = useState("")
    const [toAmount, setToAmount] = useState("")


    useEffect(() => {
        axios.get(`http://localhost:4000/users/mypage/${sessionStorage.getItem("user_id")}`)
        .then((response) => {
            console.log(response.data)
            setPostList(response.data.post)
            setUser(response.data.user)
        })
         
    }, [])

    function PostListClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        setIsSet(true)
    }

    function NFTListClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        setIsSet(false)
    }

    function ChangeAddress(e: React.ChangeEvent<HTMLInputElement>) {
        setToAddress(e.target.value)
    }

    function ChangeAmount(e: React.ChangeEvent<HTMLInputElement>) {
        setToAmount(e.target.value)
    }

    async function submitAmount() {
        axios.post("http://localhost:4000/users/send", 
        {
            to_address : toAddress,
            token_amount : toAmount,
            from_address : user.address
        })
    }

    return(
        <main>
            <h2>{user.nickname}</h2>
            <hr />
            <p>Address : {user.address}</p>
            <p>ETH : {user.eth_amount}</p>
            <p>TOKEN : {user.token_amount}
            </p>

            <div>
                <input placeholder='to address' onChange={e => ChangeAddress(e)} />
                <input placeholder='amount' onChange={e => ChangeAmount(e)}/>
                <button onClick={submitAmount}>Send</button>
            </div>
            
            <nav className='mypage_nav'>
                <ul>
                    <li>
                        <a onClick={e => PostListClick(e)}><b>POST LIST</b></a>
                    </li>
                    <li>
                        <a onClick={e => NFTListClick(e)}><i>NFT LIST</i></a>
                    </li>
                </ul>
            </nav>
            <hr />


            {isSet ? 
                postList.map((item) => {
                    return (
                        <div>
                            
                            <a href={`/post/detail?id=${item.id}`}><h3>{item.title}</h3></a>        
                            <p>Created At : {item.created_at}</p>
                            <p>Views : {item.views}</p>
                        <hr />
                        
                        </div>
                    )
                })
                :
                NFTList.map((item) => {
                    return (
                        <div>
                            {item}
                        </div>
                    )
                })
            }


        </main>
    )
}

export default MyPage;