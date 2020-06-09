/* eslint-disable max-len */
import { expect } from 'chai'
import { createSandbox } from 'sinon'
import {
  after, afterEach, before, describe, it,
} from 'mocha'
import { novelList, filteredNovelList } from '../mocks/novels'
import * as NovelsActions from '../../actions/novels'
import { filterNovels, retrieveNovels } from '../../utils/novels'

describe('Utils - Novels', () => {
  let sandbox
  let stubbedFetchNovels

  before(() => {
    sandbox = createSandbox()

    stubbedFetchNovels = sandbox.stub(NovelsActions, 'fetchNovels')
  })

  afterEach(() => {
    sandbox.reset()
  })

  after(() => {
    sandbox.restore()
  })

  describe('filterNovels', () => {
    it('returns a filtered list of novels', () => {
      const filteredNovels = filterNovels(novelList, 'and')

      expect(filteredNovels).to.deep.equal(filteredNovelList)
    })
  })

  describe('retrieveNovels', () => {
    it('returns a list of novels from the API call', async () => {
      stubbedFetchNovels.returns(novelList)

      const data = await retrieveNovels()

      expect(data).to.deep.equal(novelList)
    })
  })
})
