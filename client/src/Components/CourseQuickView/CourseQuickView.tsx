import { useState } from "react"
import Course from "../../../../types/Course"
import styles from "./CourseQuickView.module.scss"

type CourseQuickViewProps = {
    course: Course,
    color: string,
    key: number
}

export default function CourseQuickView(props: CourseQuickViewProps) {
    const [animateBubble, setAnimateBubble] = useState(false)
    const animationDuration: number = 2000

    return (
        <>
            <div className={styles["course-quick-view"]} onClick={e => {
                e.preventDefault()
                setAnimateBubble(true)
                setTimeout(() => { setAnimateBubble(false) }, animationDuration); //need to change this
            }}>
                <h2>{props.course.sectionTitle}</h2>
                <h4>{props.course.teacherName}</h4>
                <div className={animateBubble ? [styles.bubble, styles.animationBubble].join(" ") : styles.bubble} style={{ background: `var(--classes-${props.color})`, animationDuration: `${animationDuration / 1000}s` }}></div>
            </div>

        </>
    )
}