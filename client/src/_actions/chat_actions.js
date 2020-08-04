import axios from 'axios';
import {
    GET_CHATS,
    AFTER_POST_MESSAGE,
    GET_PRIVATE_CHATS
} from './types';
import { CHAT_SERVER } from '../components/Config.js';

export function getChats(){
    const request = axios.get(`${CHAT_SERVER}/getChats`)
        .then(response => response.data);
    
    return {
        type: GET_CHATS,
        payload: request
    }
}

export function getPrivateChats(userData){
    const request = axios.post(`${CHAT_SERVER}/getPrivateChats`, userData)
        .then(response => response.data);
    
    return {
        type: GET_PRIVATE_CHATS,
        payload: request
    }
}

export function afterPostMessage(data){

    return {
        type: AFTER_POST_MESSAGE,
        payload: data
    }
}

