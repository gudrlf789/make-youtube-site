import React, { useEffect } from 'react'
import Axios from 'axios'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        
        let variable = { userTo: props.userTo };

        Axios.get('/api/subscribe/subscribeNumber', variable)
            .then(res => {
                if(res.data.success){
                    setSubscribeNumber(res.data.SubscribeNumber)
                }else{
                    alert('구독자 수 정보를 받오지 못함')
                }
            })
        
        let subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }

        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(res => {
                if(res.data.success){
                    setSubscribed(res.data.subscribed)
                }else{
                    alert('정보를 받아오지 못함')
                }
            })

    }, [])

    const onSubscribe = () => {

        let subscribedVariable = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }

        if(Subscribed){
            
            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
                .then(res => {
                    if(res.data.success){
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    }else{
                        alert('구독 취소 실패')
                    }
                })
        }else{

            Axios.post('/api/subscribe/subscribe', subscribedVariable)
                .then(res => {
                    if(res.data.success){
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(Subscribed)
                    }else{
                        alert('구독하는데 실패')
                    }
                })
        }
    }

    return (
        <div>
            <button
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAA' : '#CC0000'}`, borderRadius: '4px',
                    color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
