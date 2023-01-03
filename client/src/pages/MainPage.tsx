import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PostList from "./PostList";

import './MainPage.css';

function MainPage() {
    
    const [pagination, setPagination] = useState(0);


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
            <a className='write__post' href='/post'>게시글 작성</a>
            <hr />
            <PostList pageNum={pagination}/>
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