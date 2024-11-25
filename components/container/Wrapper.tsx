import React, { ReactNode } from 'react'
import styles from "./container.module.css"
const Wrapper = ({children}: {
  children: ReactNode
}) => {
  return (
    <section className={styles.wrapper}>{children}</section>
  )
}

export default Wrapper