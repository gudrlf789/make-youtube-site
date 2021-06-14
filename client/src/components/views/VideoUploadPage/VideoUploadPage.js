import React, {useState} from 'react';
import Dropzone from 'react-dropzone';
import {Typography, Button, Form, message, Input, Icon, Select} from 'antd';
import Axios from 'axios';
import {useSelector} from 'react-redux';

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"},
]

const CategoryOptions = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"}
]

function VideoUploadPage(props){
    const user = useSelector(state => state.user)
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("") 
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChage = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }
    
    const onDrop = (files) => {

        let formData = new FormData;
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(res => {
                if(res.data.success){
                    
                    let variable = {
                        url: res.data.url,
                        fileName: res.data.fileName
                    }
                    
                    setFilePath(res.data.url)

                    Axios.post('/api/video/thumbnail', variable)
                        .then(res => {
                            if(res.data.success){
                                
                                setDuration(res.data.fileDuration)
                                setThumbnailPath(res.data.url)

                            }else{
                                alert('썸네일 생성 실패')
                            }
                        })
                }else{
                    alert('비디오 업로드 실패')
                }
            })
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        };

        Axios.post('/api/video/uploadVideo', variables)
            .then(res => {
                if(res.data.success){
                    message.success('업로드 성공');
                    
                    setTimeout(() => {
                        props.history.push('/')
                    }, 3000)
                }else{
                    alert('비디오 업로드 실패')
                }
            })
    }

    return(
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}> 
                    {/* Drop zone */}
                        <Dropzone
                            onDrop={onDrop}
                            multiple={false}
                            maxSize={1000000000}
                        >
                            {({ getRootProps, getInputProps}) => (
                                <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', alignItems: 'center',
                                 justifyContent: 'center'}} {...getRootProps()}>
                                     <Input {...getInputProps()} />
                                     <Icon type="plus" style={{ fontSize:'3rem' }} />
                                </div>
                            )}
                        </Dropzone>
                    {/* Thumbnail */}

                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                </div>

                <br />
                <br />

                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />

                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChage}
                    value={Description}
                />
                <br />
                <br />

                <Select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </Select>
                <br />
                <br />

                <Select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </Select>
                <br />
                <br />

                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage