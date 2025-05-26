import React, { useState, useRef, useEffect } from "react";
import { backendHost } from "../../api-config";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import ChatWindow from "./ChatWindow";
import axios from "axios";
import { userId } from "../UserId";
import dayjs from "dayjs";

import "./ChatPopup.css";

function ChatButton(props) {
  const { items } = props;
  const [alert, setAlert] = useState();
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [socket, setSocket] = useState(null);
  const chatRef = useRef(null);
  const fromId = userId;
  const searchParams = new URLSearchParams(window.location.search);
  const docid = searchParams.get("docid");
  const [toId, setToId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [newMessage, setNewMessage] = useState(false);

  const checkChat = () => {
    // Close the previous WebSocket connection if it exists

    console.log("getid->", userId);

    axios
      .get(`${backendHost}/chat/${userId}/${props.docid}`)
      .then((res) => {
        if (res.data[0].Chat_id != null) {
          console.log("initiate");
          setChatId(res.data[0].Chat_id);
          setToId(props.docid);
          setChats(res.data);
          startWebSocket(res.data[0].Chat_id);
          // Create a new WebSocket connection
        } else {
          console.log("start");
          favouriteForm();
        }
      })
      .catch((err) => err);
  };

  const startWebSocket = (getChatId) => {
    // Close the previous WebSocket connection if it exists
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }

    // Set up WebSocket connection
    const ws = new WebSocket("wss://all-cures.com:8000");

    ws.onopen = () => {
      console.log("Connected to the Chat Server->");
      ws.send(`{"Room_No":"${getChatId}"}`);
    };

    ws.onmessage = (event) => {
      console.log("event");
      const from = event.data.split(":")[0];
      const receivedMessage = event.data.split(":").pop();
      const newChat = {
        Message: receivedMessage,
        From_id: from,
      };
      console.log("Message", from);
      setChats((prevMessages) => [...prevMessages, newChat]);
    };

    ws.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
      } else {
        console.log("[close] Connection died");
      }
    };

    setSocket(ws);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  const favouriteForm = () => {
    axios
      .post(`${backendHost}/chat/start/${userId}/${props.docid}`)
      .then((res) => {
        console.log(res.data);
        setChatId(res.data[0].Chat_id);
        setToId(props.docid);
        setChats([]);
        startWebSocket(res.data[0].Chat_id);
      })
      .catch((err) => console.log(err));
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket && socket.readyState === WebSocket.OPEN) {
      const newChat = {
        Message: message,
        From_id: userId,
      };
      setNewMessage(true);
      setChats((prevMessages) => [...prevMessages, newChat]);
      const toId = props.docid;
      const ChatId = chatId;
      const newMessage = `${fromId}:${toId}:${ChatId}:${message}`;
      console.log(newMessage);
      socket.send(newMessage);
      setMessage("");
    } else {
      console.log("WebSocket connection not available.");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isOpen) {
      console.log("checkchat");
      checkChat();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="favouriteForm">
        <div className={`chat-box-container ${isOpen ? "open" : ""}`}>
          <button
            className="toggle-button"
            onClick={toggleChatBox}
            style={{ marginTop: -290, width: 400 }}
          >
            <div className="d-flex align-items-center">
              <div className="mr-2">
                {props.imageURL && (
                  <img
                    src={`https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-180,h-230,f-webp${props.imageURL}`}
                    alt="Chat Icon"
                    style={{ width: "20px", marginRight: "10px" }}
                  />
                )}
                {props.dummy && (
                  <div
                    style={{
                      width: "20px",
                      fontSize: "5px",
                      marginRight: "10px",
                    }}
                  >
                    <i class="fas fa-user-md fa-6x"></i>
                  </div>
                )}
              </div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                {" "}
                {items.prefix} {items.firstName} {items.middleName}{" "}
                {items.lastName}
              </div>
            </div>
          </button>
          <div className="chat-box">
            <div
              className="chat-list"
              ref={chatRef}
              style={{ flex: 1, overflowY: "auto" }}
            >
              {chats.map((message, index) => {
                const isSender = message.From_id === userId;
                const messageClass = isSender
                  ? "sender-message"
                  : "receiver-message";

                return (
                  <div key={index} className={`message-item ${messageClass}`}>
                    <p
                      className="message-text"
                      style={{
                        color: message.From_id === userId ? "#fff" : "#000",
                      }}
                    >
                      {message.Message}
                      <span
                        className="message-time"
                        style={{
                          color: message.From_id === userId ? "#fff" : "#000",
                        }}
                      >
                          {dayjs(message.Time).format("h:mm A")}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="chat-footer">
              <form onSubmit={sendMessage}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button type="submit">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChatButton;
