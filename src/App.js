import { useEffect, useState } from "react";
import "./App.css";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import Pusher from "pusher-js";
import axios from "./axios";

function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    axios.get("/messages/sync").then((response) => {
      setMessages(response.data);
    });
  }, []);
  console.log(messages);

  useEffect(() => {
    const pusher = new Pusher("1e1d25919d71ba0ef85f", {
      cluster: "ap2",
    });
    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessages) => {
      // alert(JSON.stringify(newMessages));
      setMessages([...messages, newMessages]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  return (
    <div className='app'>
      <div className='app__body'>
        <Sidebar />

        <Chat messages={messages} />
      </div>
    </div>
  );
}

export default App;
