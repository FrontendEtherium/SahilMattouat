import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { backendHost } from "../../api-config";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { userId } from "../UserId";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import ChatWindow from "../Profile/ChatWindow";
import { userAccess } from "../UserAccess";

import "./ChatList.css";

export default function App(usr_id) {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [alert, setAlert] = useState();
  const [chats, setChats] = useState([]);
  const [first, setFirst] = useState([]);
  const [last, setLast] = useState([]);
  const [header, setHeader] = useState(false);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const fromId = userId;
  const [toId, setToId] = useState();
  const [showChatWindow, setShowChatWindow] = useState(false);
  const chatRef = useRef(null);
  const [chatId, setChatId] = useState(null);
  const [newMessage, setNewMessage] = useState(false);

  const docID = localStorage.getItem("doctorid");

  useEffect(() => {
    // axios.get(`${backendHost}/chat/list/${userId}`)
    axios
      .get(`${backendHost}/chat/list/${docID == 0 ? userId : docID}`)
      .then((response) => {
        console.log(response.data);
        setChatList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    // scrollToBottom();
    console.log(chats);
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  });

  const checkChat = (getId) => {
    // Close the previous WebSocket connection if it exists

    // console.log('getid->',getId)

    //  console.log("doctorid",docID)

    axios
      .get(
        `${backendHost}/chat/${userAccess != 1 ? userId : getId}/${
          userAccess != 1 ? getId : docID
        }`
      )

      .then((res) => {
        setChatId(res.data[0].Chat_id);
        setToId(getId);
        setChats(res.data);
        startWebSocket(res.data[0].Chat_id);
        // Create a new WebSocket connection
        console.log("got chat id", res.data[0].Chat_id);
      })
      .catch((err) => err);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const newChat = {
      Message: message,
      From_id: userId,
    };
    setNewMessage(true);
    setChats((prevMessages) => [...prevMessages, newChat]);
    const toid = toId;
    const chatId = chats[0].Chat_id;
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const newMessage = `${fromId}:${toid}:${chatId}:${message}:`;
    console.log(newMessage);

    socket.send(newMessage);
    setMessage("");
    // chatRef.current.scrollIntoView({ behavior: 'smooth' });
    scrollToBottom();
  };
  const startWebSocket = (getChatId) => {
    // Close the previous WebSocket connection if it exists
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }

    // Set up WebSocket connection
    const ws = new WebSocket("wss://all-cures.com:8000");

    ws.onopen = () => {
      console.log("Connected to the Chat Server->", getChatId);
      ws.send(`{"Room_No":"${getChatId}"}`);
    };

    ws.onmessage = (event) => {
      console.log(event);
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

  const handleClick = (chat) => {
    checkChat(chat.userID);

    setSelectedChat(chat.userID);
    setFirst(chat.first_name);
    setLast(chat.last_name);
    setHeader(true);

    setToId(chat.User);
  };

  const scrollToBottom = () => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };
  return (
    <>
      <Header />
      <div className="p-4">
        <div className="border">
          <div className="container">
            <div className="chat">
              <div className="message-header">
                <FontAwesomeIcon icon={faInbox} size={"3x"} />

                <div className="header-info">
                  <h3 style={{ color: "#00415e", marginLeft: 20 }}>Inbox</h3>
                </div>
              </div>

              <div className="chat-list">
                {chatList.map((users) => (
                  <div
                    key={users.User}
                    onClick={() => handleClick(users)}
                    className={`chat-item ${
                      selectedChat === users.User ? "selected-chat" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faUserCircle} size={"3x"} />
                    <div className="chat-info" style={{ marginLeft: 20 }}>
                      <h3>
                        {users.first_name} {users.last_name}
                      </h3>
                      <p>{users.Message}</p>
                    </div>
                    <div className="chat-time">
                      {dayjs(users.Time).format("h:mm A")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="message">
              <div
                className="message-header"
                style={{ display: header ? " flex" : "none" }}
              >
                <FontAwesomeIcon icon={faUserCircle} size={"3x"} />
                <div className="header-info">
                  <h3 style={{ color: "#00415e", marginLeft: 20 }}>
                    {first} {last}
                  </h3>
                </div>
              </div>

              <div className="message-list" ref={chatRef}>
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
                      </p>{" "}
                    </div>
                  );
                })}
              </div>

              <div
                className="message-footer"
                style={{ display: header ? "flex" : "none" }}
              >
                <form onSubmit={sendMessage}>
                  <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit">send message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
