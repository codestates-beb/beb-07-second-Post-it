import axios from 'axios';
import React, { useEffect, useState } from 'react';

import test from "../PostListTest.json";

function Market() {
    // const [nftList, setNFTList] = useState([]);
    // useEffect(() => {
    //     axios.get("url")
    //     .then((response) => {
            
    //         setNFTList(response.data)
    //     })
    //     ;
    // }, [])

    return (
        <main>
            Market 페이지 입니다.
            <section>
                {
                    test.map((item) => {
                        return (
                            <aside>
                                <h3>{item.title}</h3>
                                <h4>{item.nickname}</h4>
                                <p><small>Created At : {item.created_at}</small></p>
                            </aside>
                        )
                    })
                }

            </section>
        </main>
    )
}

export default Market