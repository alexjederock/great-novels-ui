/* eslint-disable max-len */
import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {
  afterEach, before, beforeEach, describe, it,
} from 'mocha'
import models from '../../models'
import { getAllAuthors, getAuthorByIdOrName } from '../../controllers/authors'
import { singleAuthor, authorList } from '../mocks/authors'

chai.use(sinonChai)

describe('Controllers - authors', () => {
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

    stubbedFindAll = sandbox.stub(models.Authors, 'findAll')
    stubbedFindOne = sandbox.stub(models.Authors, 'findOne')

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

  describe('getAllAuthors', () => {
    it('retrieves a list of authors from the database and calls response.send() with the list', async () => {
      stubbedFindAll.returns(authorList)

      await getAllAuthors({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedSend).to.have.been.calledWith(authorList)
    })
  })

  describe('getAuthorByIdOrName', () => {
    it('retrieves the author associated with the provided ID, or name from the database and calls response.send with it', async () => {
      stubbedFindOne.returns(singleAuthor)
      const request = {
        params: {
          identifier: 1,

        },
      }

      await getAuthorByIdOrName(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({
        where: {
          [models.Sequelize.Op.or]: [
            { id: 1 },
            { nameLast: { [models.Sequelize.Op.like]: '%1%' } },
          ],
        },
        include: [{
          model: models.Novels,
          include: [{ model: models.Genres }],
        }],
      })
      expect(stubbedSend).to.have.been.calledWith(singleAuthor)
    })

    it('returns a 404 when no author is found', async () => {
      stubbedFindOne.returns(null)
      const request = { params: { identifier: 'not-found' } }

      await getAuthorByIdOrName(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({
        where: {
          [models.Sequelize.Op.or]: [
            { id: 'not-found' },
            { nameLast: { [models.Sequelize.Op.like]: '%not-found%' } },
          ],
        },
        include: [{
          model: models.Novels,
          include: [{ model: models.Genres }],
        }],
      })
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })
  })
})
