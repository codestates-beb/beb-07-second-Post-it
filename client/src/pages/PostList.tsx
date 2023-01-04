import axios from "axios";
import { MouseEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostDetail from "./PostDetail";

interface propsType {
        pageNum : number   
}

interface postListType {
        id : number,
        nickname : string,
        title : string,
        content : string,
        created_at : string,
        views : number
}

function PostList({pageNum} : propsType) {
    
    const [postList, setPostList] = useState([])
    
    useEffect(() => {
        axios.get("http://localhost:4000/post/postList?id=" + pageNum)

        .then((response) => {
            if(response.data) {
                setPostList(response.data)
            }
        })
    }, [pageNum]);

    return (
        <div>
            {
                postList.map((item : postListType) => {
                    
                    return (
                        <div>
                            
                            <a href={`/post/detail?id=${item.id}`}><h3>{item.title}</h3></a>        
                            <p>Creator: {item.nickname}</p>
                            <p>Created At : {item.created_at}</p>
                            <p>Views : {item.views}</p>
                            <hr />
                            
                        </div>
                        
                    )
                })
            }
            
        </div>
    )
}

export default PostList;