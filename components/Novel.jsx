import React from 'react'

export default ({ id, title, nameFirst, nameLast }) => (
  <div className="novel" key={id}>{`${title} by ${nameFirst} ${nameLast}`}</div>
)
