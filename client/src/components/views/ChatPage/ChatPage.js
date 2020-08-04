import React, { Component, Fragment } from 'react'
import { Form, Icon, Input, Button, Row, Col, } from 'antd';
import io from "socket.io-client";
import { connect } from "react-redux";
import moment from "moment";
import { getChats, afterPostMessage, getPrivateChats } from "../../../_actions/chat_actions"
import { getAllUser } from "../../../_actions/user_actions"
import ChatCard from "./Sections/ChatCard"
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { css } from "@emotion/core";
import PropagateLoader from "react-spinners/PulseLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export class ChatPage extends Component {
    constructor(props) {
    super(props);
        this.state = {
            chatMessage: "",
            id: "",
            name: "",
            email: "",
            image: "",
            loading: true
        }
    }

    async componentWillMount () {
        let server = "http://localhost:5000";
        await this.props.dispatch(getChats());
        await this.props.dispatch(getAllUser());
        this.socket = io(server);        

        // this.socket.on("Output Chat Message", messageFromBackEnd => {
        //     this.props.dispatch(afterPostMessage(messageFromBackEnd));
        // })
        this.socket.on("Output Private Chat Message", messageFromBackEnd => {
            let userData= {
                sender: this.props.user.userData._id,
                receiver: this.state.id
            }
            this.props.dispatch(getPrivateChats(userData));
        })
        this.stopLoading()
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }

    hanleSearchChange = (e) => {
        this.setState({
            chatMessage: e.target.value
        })
    }

    renderCards = () =>
        this.props.chats.chats &&  this.props.user.userData
        && this.props.chats.chats.map((chat) => (
            <ChatCard key={chat._id}  {...chat} myID={this.props.user.userData._id} />
        ));

    setuserReady = async (id, name, email) => {
        let server = "http://localhost:5000";
        this.socket = io(server);

        await this.setState({
            id,
            name,
            email
        });

        this.socket.emit('join_room', { email: 'this.state.email' }  );

        let userData= {
            sender: this.props.user.userData._id,
            receiver: this.state.id
        }

        await this.props.dispatch(getPrivateChats(userData));
        this.renderCards();
    }

    setGroupState = async ()  => {
        await this.setState({
            id: "myGroup",
            name: ""
        })
        this.props.dispatch(getChats());
    }

    stopLoading = () => {
        this.setState({
            loading: false
        })
    }

    renderUsers = () => {
        const { allUser, userData } = this.props.user;
        let userMap = allUser && allUser.filter(usr => usr._id !== userData._id );
        return (   
            <Fragment>
                <h1>My Contact List</h1>
                { 
                    userMap && userMap.map((usr, index) => { return ( 
                    <h3 style={{
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid lightsteelblue'
                        }} 
                        className={ this.state.id  == usr._id ? 'selected-user' : null}
                        key={index}
                        onClick={() => {this.setuserReady(usr._id,usr.name,usr.email)}}>
                        &nbsp;&nbsp;{usr.name}
                    </h3>
                    )})
                }
                {/* <h3 style={{
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid lightsteelblue'
                    }} 
                    className={ this.state.id  == "myGroup"? 'selected-user' : null}
                    onClick={() => {this.setGroupState()}}
                        >&nbsp;&nbsp;My Group</h3> */}
            </Fragment>
        )
    }
  
    toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    onDrop = async (files) => {
        console.log(files)
        if (this.props.user.userData && !this.props.user.userData.isAuth) {
            return alert('Please Log in first');
        }

        await this.toBase64(files[0]).then(result => {
            this.setState({
                image: result
            })
        });    
        
        let userId = this.props.user.userData._id
        let userName = this.props.user.userData.name
        let recUserId = this.state.id
        let resUserName = this.state.name
        let userImage = this.state.image
        let nowTime = moment();
        let type = "VideoOrImage";
        let chatType = "private";

        await this.socket.emit('Private Image Message', {
            userId,
            userName,
            userImage,
            nowTime,
            type,
            recUserId,
            resUserName,
            chatType
        });
        this.setState({ chatMessage: "", image: "" })

        // let formData = new FormData;

        // const config = {
        //     header: { 'content-type': 'multipart/form-data' }
        // }

        // formData.append("file", files[0])

        // Axios.post('api/chat/uploadfiles', formData, config)
        //     .then(response => {
        //         if (response.data.success) {
        //             let chatMessage = response.data.url;
        //             let userId = this.props.user.userData._id
        //             let userName = this.props.user.userData.name;
        //             let userImage = this.props.user.userData.image;
        //             let nowTime = moment();
        //             let type = "VideoOrImage"

        //             this.socket.emit("Input Chat Message", {
        //                 chatMessage,
        //                 userId,
        //                 userName,
        //                 userImage,
        //                 nowTime,
        //                 type
        //             });
        //         }
        //     })
    }


    // submitChatMessage = (e) => {
    //     e.preventDefault();

    //     if (this.props.user.userData && !this.props.user.userData.isAuth) {
    //         return alert('Please Log in first');
    //     }

    //     let chatMessage = this.state.chatMessage
    //     let userId = this.props.user.userData._id
    //     let userName = this.props.user.userData.name;
    //     let userImage = this.props.user.userData.image;
    //     let nowTime = moment();
    //     let type = "Text";
    //     let chatType = "public"

    //     // this.socket.emit("Input Chat Message", {
    //     //     chatMessage,
    //     //     userId,
    //     //     userName,
    //     //     userImage,
    //     //     nowTime,
    //     //     type,
    //     //     chatType
    //     // });
    //     this.setState({ chatMessage: "" })
    // }

    submitPrivateChatMessage = async (e) => {
        console.log("callled");
        if (this.props.user.userData && !this.props.user.userData.isAuth) {
            return alert('Please Log in first');
        }

        let chatMessage = this.state.chatMessage
        let userId = this.props.user.userData._id
        let userName = this.props.user.userData.name
        let recUserId = this.state.id
        let resUserName = this.state.name
        let userImage = this.props.user.userData.image
        let nowTime = moment();
        let type = "Text";
        let chatType = "private";

        await this.socket.emit('Private Chat Message', {
            chatMessage,
            userId,
            userName,
            userImage,
            nowTime,
            type,
            recUserId,
            resUserName,
            chatType
        });
        this.setState({ chatMessage: "" })
    }

    render() {
        return (
            <React.Fragment>
                <div style={{ display: 'flex', flexDirection: 'row'}}>
                <div style={{ minWidth: '25%', padding: '0 20px', backgroundColor: 'beige'}}>
                    {this.props.user && (
                            this.renderUsers()
                    )}
                    <div className="sweet-loading">
                        <PropagateLoader
                            css={override}
                            size={20}
                            color={"#123abc"}
                            loading={this.state.loading}
                        />
                    </div>
                </div>

               <div style={{ minWidth: '75%', padding: '0 20px' }}>
                    <div className="infinite-container" style={{ height: '500px', overflowY: 'scroll' }}>
                        {this.props.chats && (
                            this.renderCards()
                        )}
                        <div
                            ref={el => {
                                this.messagesEnd = el;
                            }}
                            style={{ float: "left", clear: "both" }}
                        />
                    </div>
                    {
                        this.state.id ? 
                        <Row >
                            <Form layout="inline" onSubmit={this.submitChatMessage}>
                                <Col span={18}>
                                    <Input
                                        id="message"
                                        placeholder="Let's start talking"
                                        type="text"
                                        value={this.state.chatMessage}
                                        onChange={this.hanleSearchChange}
                                    />
                                </Col>
                                <Col span={2}>
                                    <Dropzone onDrop={this.onDrop}>
                                        {({ getRootProps, getInputProps }) => (
                                            <section>
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    <Button>
                                                        <Icon type="upload" />
                                                    </Button>
                                                </div>
                                            </section>
                                        )}
                                    </Dropzone>
                                </Col>

                                <Col span={4}>
                                    <Button 
                                        type="primary"
                                        style={{ width: '100%' }}
                                        onClick={this.submitPrivateChatMessage} htmlType="submit">
                                        <strong>Send</strong>
                                    </Button>
                                </Col>
                            </Form>
                        </Row> :
                        <p style={{ 
                            textAlign: 'center',
                            fontSize: 'large',
                            fontWeight: '800'
                        }}>Select user first</p>
                    }                    
                </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        chats: state.chat
    }
}


export default connect(mapStateToProps)(ChatPage);
