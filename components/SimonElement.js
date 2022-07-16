import styles from '../styles/Simon.module.css'

export default function SimonElement(props) {
  return (
    <div className={styles.simonElement} onClick={props.onClick} style={{
        backgroundColor: props.color || 'red',
        opacity: (props.active ? 1 : 0.3),
    }}>
        
    </div>
  )
}