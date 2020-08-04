import React from "react";
import moment from 'moment';
import { Comment, Tooltip, Avatar } from 'antd';
import ReactEmoji from 'react-emoji';
import { Twemoji } from 'react-emoji-render';

function ChatCard(props) {

    const date = new Date(props.updatedAt)
    
    return (
        <div style={{ width: '100%' }} >
            <Comment
                className={ props.myID == props.sender._id ? 'my-message' : null }
                author={props.sender.name}
                avatar={
                    <Avatar
                        src={props.sender.image} alt={props.sender.name}
                    />
                }
                content={
                    props.type === "VideoOrImage" ?
                        <img
                            style={{ maxWidth: '200px' }}
                            src={props.image}
                            alt="img"
                        />
                        :
                        <p>
                            <Twemoji text={props.message} />
                            {/* {ReactEmoji.emojify(props.message)} */}
                        </p>
                }
                datetime={
                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{date.toString().slice(0,24)}</span>
                    </Tooltip>
                }
            />
        </div>
    )
}

export default ChatCard;