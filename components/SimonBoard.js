import styles from '../styles/Simon.module.css'

export default function SimonBoard(props) {
  return (
    <div className={styles.simonBoard}>
        {props.children}
    </div>
  )
}