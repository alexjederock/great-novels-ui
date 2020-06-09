/* eslint-disable max-len */
import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {
  afterEach, before, beforeEach, describe, it,
} from 'mocha'
import models from '../../models'
import { getAllGenres, getGenreById } from '../../controllers/genres'
import { singleGenre, genreList } from '../mocks/genres'

chai.use(sinonChai)

describe('Controllers - genres', () => {
  let sandbox
  let stubbedFindAll
  let stubbedFindOne
  let stubbedSend
  let response
  let stubbedSendStatus
  let stubbedStatusSend
  let stubbedStatus

  before(() => {
    sandbox = sinon.createSandbox()

    stubbedFindAll = sandbox.stub(models.Genres, 'findAll')
    stubbedFindOne = sandbox.stub(models.Genres, 'findOne')

    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedStatusSend = sandbox.stub()
    stubbedStatus = sandbox.stub()

    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus,
    }
  })

  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusSend })
  })

  afterEach(() => {
    sandbox.reset()
  })

  describe('getAllGenres', () => {
    it('retrieves a list of genres from the database and calls response.send() with the list', async () => {
      stubbedFindAll.returns(genreList)

      await getAllGenres({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedSend).to.have.been.calledWith(genreList)
    })
  })

  describe('getGenreById', () => {
    it('retrieves the genre associated with the provided ID, or name from the database and calls response.send with it', async () => {
      stubbedFindOne.returns(singleGenre)
      const request = {
        params: {
          id: 1,

        },
      }

      await getGenreById(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({
        where: { id: 1 },
        include: [{
          model: models.Novels,
          include: [{ model: models.Authors }],
        }],
      })
      expect(stubbedSend).to.have.been.calledWith(singleGenre)
    })

    it('returns a 404 when no genre is found', async () => {
      stubbedFindOne.returns(null)
      const request = { params: { id: 'not-found' } }

      await getGenreById(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({
        where: { id: 'not-found' },
        include: [{
          model: models.Novels,
          include: [{ model: models.Authors }],
        }],
      })
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })
  })
})
