import React from 'react'
import styles from "./container.module.css"
const GameContainer = ({children}: {children:React.ReactNode}) => {
  return (
    <section className={styles.container}>{children}</section>
  )
}

export default GameContainer