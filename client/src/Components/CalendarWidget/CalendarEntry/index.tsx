import { useState } from "react";
import Rodal from "rodal";
import { Events } from "../../../../../types/Event";
import { CalendarEntryDetailedModal } from "../CalendarEntryDetailedModal";
import styles from "./CalendarEntry.module.scss"

export interface CalendarEventRowProps {
  event: Events;
}

export default function CalendarEventRow({event}: CalendarEventRowProps) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <div className={styles.wrapper} onClick={() => setIsVisible(true)}>
        <div className={styles.left}>
          <text className={styles.text}> Day </text>
          <text className={styles.day}> {event.date.getDate()} </text>
        </div>
        <div className={styles.vl}/>
        <div className={styles.right}>
          <text className={styles.className}>
            {event.courseTitle}
          </text>
          <text className={styles.eventName}>
            {event.title}
          </text>
        </div>
      </div>

      <Rodal visible={isVisible} onClose={() => setIsVisible(false)}
        customStyles={{"borderRadius": "25px", padding: 0, height: "500px"}}
      >
        <CalendarEntryDetailedModal event={event} close={() => setIsVisible(false)}/>
      </Rodal>

    </>
  )
}
