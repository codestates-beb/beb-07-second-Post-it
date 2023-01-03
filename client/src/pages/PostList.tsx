import axios from "axios";
import { useEffect, useState } from "react";
import test from "../PostListTest.json";
import test2 from "../PostListTest2.json";


interface propsType {
        pageNum : number   
}

interface postListType {
        id : number,
        user_id : number,
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
                            <p>{item.id}</p>
                            <a><h3>{item.title}</h3></a>
                            <p>Creator: {item.user_id}</p>
                            <p>Created At : {item.created_at}</p>
                            <p>Views : {item.views}</p>
                        </div>
                        
                    )
                })
            }
            
            {/* <section>
                    <h3>포스트 리스트 입니다1</h3>
            </section>
            <section>
                    <h3>포스트 리스트 입니다2</h3>
            </section>
            <section>
                    <h3>포스트 리스트 입니다3</h3>
            </section>
            <section>
                    <h3>포스트 리스트 입니다4</h3>
            </section>
            <section>
                    <h3>포스트 리스트 입니다5</h3>
            </section>
            <section>
                    <h3>포스트 리스트 입니다6</h3>
            </section>
            <section>
                    <h3>포스트 리스트 입니다7</h3>
            </section>
            <section>
                    <h3>포스트 리스트 입니다8</h3>
            </section>
            <section>
                    <h3>포스트 리스트 입니다9</h3>
            </section>
            <section>
                    <h3>포스트 리스트 입니다10</h3>
            </section> */}
        </div>
    )
}

export default PostList;