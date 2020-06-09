import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { expect } from 'chai'
import { before, describe, it } from 'mocha'
import novelList from '../mocks/novels'
import { fetchNovels } from '../../actions/novels'

describe('Actions - Novels', () => {
  let mockAxios
  before(() => {
    mockAxios = new MockAdapter(axios)
  })
  describe('fetchNovels', () => {
    it('returns a list of novels from the API', async () => {
      mockAxios.onGet().reply(200, novelList)
      const data = await fetchNovels()
      expect(data).to.deep.equal(novelList)
    })
  })
})