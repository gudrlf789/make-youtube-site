import React, { useEffect } from 'react'
import { Tooltip, Icon } from 'antd'
import Axios from 'axios'

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [Dislikes, setDislikes] = useState(0)
    const [DislikeAction, setDislikeAction] = useState(null)

    let variable = {}

    if(props.video){
        variable = { videoId: props.videoId, userId: props.userId}
    }else{
        variable = { commentId: props.commentId, userId: props.userId}
    }

    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
            .then(res => {
                if(res.data.success){
                    setLikes(res.data.likes.length)

                    res.data.likes.map(like => {
                        if(like.userId === props.userId){
                           setLikeAction('liked')
                        }
                    })
                }else{
                    alert('Likes에서 정보를 가져오지 못했습니다.')
                }
            })

        Axios.post('/api/like/getDislikes', variable)
            .then(res => {
                if(res.data.success){
                    setDislikes(res.data.disLikes.length)

                    res.data.disLikes.map(like => {
                        if(like.userId === props.userId){
                            setDislikeAction('disLiked')
                        }
                    })
                }else{
                    alert('Dislikes에서 정보를 가져오지 못했습니다.')
                }
            })
    },[])

    const onLike = () => {

        if(LikeAction === null){
            
            Axios.post('/api/like/upLike', variable)
                .then(res => {
                    if(res.data.success){
                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        if(DislikeAction !== null){
                            setDislikeAction(null)
                            setDislikes(Dislikes - 1)
                        }
                    }else{
                        alert('Like를 올리지 못하였습니다')
                    }
                })
        }else{

            Axios.post('/api/like/unLike', variable)
                .then(res => {
                    if(res.data.success){
                        setLikes(Likes - 1)
                        setLikeAction(null)
                    }else{
                        alert('Like를 내리지 못하였습니다')
                    }
                })
        }
    }

    const onDislike = () => {

        if(DisLikeAction !== null){

            Axios.post('/api/like/unDislike', variable)
                .then(res => {
                    if(res.data.success){
                        setDislikes(Dislikes - 1)
                        setDislikeAction(null)
                    }else{
                        alert('dislike을 지우지 못했습니다.')
                    }
                })
        }else{
            Axios.post('/api/like/upDislike', variable)
                .then(res => {
                    if(res.data.success){
                        setDislikes(DisLikeAction + 1)
                        setDislikeAction('disLiked')

                        if(LikeAction !== null){
                            setLikeAction(null)
                            setLikes(Likes - 1)
                        }
                    }else{
                        alert('like을 지우지 못했습니다.')
                    }
                })
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like" 
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike" 
                        theme={DislikeAction === 'disLiked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>
            </span>
        </div>
    )
}

export default LikeDislikes
