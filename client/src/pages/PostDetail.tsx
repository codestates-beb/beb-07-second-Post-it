import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PostType {
    id : number,
    nickname : string,
    title : string,
    content : string,
    created_at : string,
    views : number
}

// {
//     "id": 1,
//     "user_id": 1,
//     "title": "title test",
//     "content": "content test",
//     "created_at": "2023-01-03T05:12:07.000Z",
//     "views": 1,
//     "nickname": "aaaa"
// }

function PostDetail() {
    const location = useLocation()
    const id = location.search.split("=")[1];

    const [post, setPost] = useState({id : 0, nickname : "", title : "", content : "", created_at : "", views : 0})
    
    useEffect(() => {
        axios.get(`http://localhost:4000/post/getpost?id=${id}`)
        .then((response) => {
            setPost(response.data[0])
            console.log(response.data)
        })
    }, [])

    return (
        <main>
            Post조회 페이지 입니다.
            <h1>{post.title}</h1>
            <hr />
            <p>Creator : {post.nickname} Views : {post.views}</p>
            <p>Created At : {post.created_at}</p>
            <p>{post.content}</p>
        </main>
    )
}

export default PostDetail;