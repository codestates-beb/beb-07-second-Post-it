import { useState } from "react";
import test from "../PostListTest.json";
import test2 from "../PostListTest2.json";
function PostList() {
    
    const [postList, setPostList] = useState(test)

    

    return (
        <div>
            {
                test.map((item) => {
                    return (
                        <div>
                            <a><h3>{item.title}</h3></a>
                            <p>Creator: {item.nickname}</p>
                            <p>{item.id}</p>
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