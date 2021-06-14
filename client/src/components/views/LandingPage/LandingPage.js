import React, {useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import {Title, Row, Avatar} from 'antd';
import Meta from 'antd/lib/card/Meta';
import moment from 'moment';
import Axios from 'axios';

function LandingPage() {

    const [Video, setVideo] = useState([])

    useEffect(() => {

        Axios.get('/api/video/getVideos')
            .then(res => {
                if(res.data.success){
                    setVideo(res.data.videos)
                }else{
                    alert('비디오 가져오기 실패')
                }
            })

    }, [])

    const renderCards = Video.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - (minutes * 60)));

        return (
            <Col key={index} lg={6} md={8} xs={24}>
                    <a href={`/video/post/${video._id}`}>
                        <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                        <div className="duration">
                            <span>{minutes} : {seconds}</span>
                        </div>
                    </a>
                    <br />
                    <Meta 
                        avatar={
                            <Avatar src={video.writer.image} />
                        }
                        title={video.title}
                        description=""
                    />
                    <span>{video.writer.name}</span>
                    <span style={{ marginLeft: '3rem' }}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
                </Col>
        )
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}>Recommended</Title>
            <hr />
            <Row gutter={[32,16]}>
                
            </Row>
        </div>
    )
}

export default LandingPage
