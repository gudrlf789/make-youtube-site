import React, { useState } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
    const videoId = props.postId
    const user = useSelector(state => state.user)
    const [commentValue, setCommentValue] = useState("")

    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();
        
        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(res => {
                if(res.data.success){
                    setCommentValue("")
                    props.refreshFunction(res.data.result)
                }else{
                    alert('댓글을 저장하지 못했습니다.')
                }
            })
    }

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/* Coment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => {
                (!comment.responseTo &&
                    <>
                        <SingleComment refreshFunction={refreshFunction} comment={comment} postId={videoId} />
                        <ReplyComment refreshFunction={refreshFunction} parentCommentId={comment._id} videoId={videoId} commentLists={props.commentLists} />
                    </>
                ) 
            })}

            {/* Root Comment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea 
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default Comment
