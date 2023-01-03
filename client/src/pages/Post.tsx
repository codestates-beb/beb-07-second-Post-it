import axios from "axios";
import { ChangeEvent, useState } from "react";
import "./Post.css"

function WritePost() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    function TitleChange(e: ChangeEvent<HTMLInputElement>): void {
        setTitle(e.target.value)
    }

    function ContentChange(e: ChangeEvent<HTMLTextAreaElement>): void {
        setContent(e.target.value)
    }

    async function submit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        axios.post("http://localhost:4000/post/wpost", {
            title : title,
            content : content
        })
        .then((response) => {
            console.log(response.data)
        })
    }

    console.log(title);
    console.log(content);

    return (
        <main>
            <section>
                <blockquote>
                    <h1>Create Post</h1>
                    <input placeholder="Title" onChange={e => TitleChange(e)} />
                    <textarea placeholder="Content" onChange={e => ContentChange(e)} >
                    </textarea>
                    <button onClick={e => submit(e)}><b>Create</b></button>
                </blockquote>
            </section>
        </main>
    )
}

export default WritePost;