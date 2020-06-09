import React, { useEffect, useState } from 'react'
import Search from './Search'
import Novel from './Novel'
import { filterNovels, retrieveNovels } from '../utils/novels'

export default () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [novelList, setNovelList] = useState([])
  const [filteredNovelList, setFilteredNovelList] = useState([])

  useEffect(() => {
    async function pullData() {
      const novels = await retrieveNovels()

      setNovelList(novels)
      setFilteredNovelList(novels)
    }

    pullData()
  }, [])

  useEffect(() => {
    const filtered = filterNovels(novelList, searchTerm)

    setFilteredNovelList(filtered)
  }, [searchTerm])

  return (
    <div className="page">
      <div className="title">Great Novels</div>
      <div className="subtitle">Great Novel Search</div>
      <Search term={searchTerm} setter={setSearchTerm} />
      {
        filteredNovelList.map(novel => (
          <Novel
            key={novel.id}
            id={novel.id}
            title={novel.title}
            nameFirst={novel.author.nameFirst}
            nameLast={novel.author.nameLast}
          />
        ))
      }
    </div>
  )
}
