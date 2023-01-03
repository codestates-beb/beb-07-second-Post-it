import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PostList from "./PostList";

function MainPage() {
    
    const [pagination, setPagination] = useState(0);
    // const [nfts, setNfts] = useState({});

    useEffect(() => {
        console.log(pagination)
        // axios.get("http://localhost:4000/post/postList?id=" + pagination)
        // .then((response) => {
        //     console.log(response.data)
        // })
      }, [pagination]);
    function Prev(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void {
        setPagination((pageNum) => {
            if (pageNum <= 0) {
                return 0;
            } else {
                return pageNum - 1
            }
        })
    }

    function Next(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void {
        setPagination((pageNum) => {
            return pageNum+1;
        })
    }

    return (
        <main>
            <PostList />
            <p>
                <a onClick={e => Prev(e)}>
                    <i>prev</i>
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a onClick={e => Next(e)}>
                    <b>next</b>
                </a>

            </p>
        </main>
    )
}

export default MainPage;