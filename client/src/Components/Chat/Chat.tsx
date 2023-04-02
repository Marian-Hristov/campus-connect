import styles from "./Chat.module.scss";
import Message from "../Message/Message";
import { useEffect, useRef, useState } from "react";
import { ChatMessage, useChat } from "../../chat";
import { UserClassSection } from "../../../../types/UserClassSection";
import { useSections, useUser } from "../../custom-query-hooks";
import { useQuery } from "react-query";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MostRecentMessage } from "../../../../types/Queries/MostRecentMessage";
import { isDateCurrentDay } from "../../validationUtils";
type ChatProps = {
  selectedChat: UserClassSection;
  setMostRecentMessage: (setMostRecentMessage: MostRecentMessage) => void;
};

const formatDate = (date: Date) => {
  return isDateCurrentDay(date)
    ? date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : date.toLocaleString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
};

export default function Chat({
  selectedChat,
  setMostRecentMessage,
}: ChatProps) {
  const user = useUser();
  const sections = useSections({ userClassSections: user.sections });
  const [messages, _setMessages] = useState<ChatMessage[]>([]);
  const [loadedMsgIndex, setIndex] = useState(0);
  const { data: msgsFromDBQ, isLoading } = useQuery(
    ["loading", selectedChat, loadedMsgIndex],
    loadMessages,
    { refetchOnWindowFocus: false, cacheTime: 0 }
  );
  const [justLoadedFromDb, setJustLoadedFromDb] = useState(false);

  const mainChatRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  const [messageToScrollKey, setMessageToScrollKey] = useState("");
  const messageToScrollRef = useRef<HTMLDivElement>(null);

  const lastMessageRef = useRef<HTMLDivElement>(null);

  async function loadMessages() {
    setJustLoadedFromDb(true);
    const loadLatestMessages = await axios.get("/api/getLatestMessages", {
      params: { room: selectedChat, loadedMsgIndex: loadedMsgIndex },
    });
    return loadLatestMessages.data;
  }

  useEffect(() => {
    if (msgsFromDBQ) {
      setJustLoadedFromDb(true);
      msgsFromDBQ.forEach((d: ChatMessage) => (d.date = new Date(d.date)));
      _setMessages((currentMessages) => [...msgsFromDBQ, ...currentMessages]);
    }
  }, [msgsFromDBQ]);

  const chat = useChat({
    rooms: [selectedChat],
    onMessage: (m) => {
      if (
        m.room.courseNumber + m.room.sectionNumber !==
        selectedChat.courseNumber + selectedChat.sectionNumber
      )
        return;
      setMessages(m);
    },
  });

  const setMessages = (c: ChatMessage) => {
    c.date = new Date(c.date);
    setMostRecentMessage({
      message: c.message,
      room: c.room,
      userName: c.user.userName,
    });
    _setMessages((currentMessages) => [...currentMessages, c]);
  };

  const onEnter = (message: string) => {
    if (message === "") return;
    const pMessage = {
      message,
      room: selectedChat,
      user: { _id: user._id, userName: user.name },
      date: new Date(),
    };

    chat.sendMessage(pMessage);
    setMessages(pMessage);
  };

  const onKeyUp = ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === "Enter") {
      onEnter(textRef.current!.value);
      textRef.current!.value = "";
    }
  };

  useEffect(() => {
    if (justLoadedFromDb) {
      setJustLoadedFromDb(false);
      if (loadedMsgIndex != 0) {
        messageToScrollRef.current?.scrollIntoView();
        return;
      }
    }
    lastMessageRef.current?.scrollIntoView();
  }, [messages]);

  function onScroll() {
    if (mainChatRef.current?.scrollTop === 0) {
      setMessageToScrollKey(user._id + msgsFromDBQ[0].date);
      setIndex(loadedMsgIndex + 1);
    }
  }

  return (
    <>
      <div className={styles["main-chat"]}>
        <div className={styles["msger"]}>
          <div className={styles["msger-header"]}>
            <div className={styles["msger-header-title"]}>
              <i className={styles["fas fa-comment-alt"]}></i>
              {
                sections.data!.find(
                  (s) => s.courseNumber === selectedChat.courseNumber
                )!.courseTitle
              }
              {isLoading && (
                <FontAwesomeIcon icon="circle-notch" className="fa-spin" />
              )}
            </div>
            <div className={styles["msger-header-options"]}>
              <span>
                <i className={styles["fas fa-cog"]}></i>
              </span>
            </div>
          </div>

          <div
            className={styles["msger-chat"]}
            onScroll={() => onScroll()}
            ref={mainChatRef}
          >
            <>
              {messages.map((message) => {
                const key = user._id + message.date;
                const refObj = {
                  ref:
                    key == messageToScrollKey
                      ? messageToScrollRef
                      : lastMessageRef,
                };

                return (
                  <div {...refObj}>
                    <GenerateChatMessage
                      userID={user._id}
                      message={message}
                      key={user._id + message.date}
                    />
                  </div>
                );
              })}
            </>
          </div>

          <div className={styles["msger-inputarea"]}>
            <input
              type="text"
              className={styles["msger-input"]}
              placeholder="Enter your message..."
              onKeyUp={onKeyUp}
              ref={textRef}
            ></input>
          </div>
        </div>
      </div>
    </>
  );
}

function GenerateChatMessage({
  message,
  userID,
}: {
  message: ChatMessage;
  userID: string;
}) {
  return (
    <Message
      leftOrRight={message.user._id === userID ? "right-msg" : "left-msg"}
      user={message.user.userName}
      message={message.message}
      time={formatDate(message.date)}
    />
  );
}
