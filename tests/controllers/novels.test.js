/* eslint-disable max-len */
import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {
  afterEach, before, beforeEach, describe, it,
} from 'mocha'
import models from '../../models'
import { singleNovel, novelList } from '../mocks/novels'
import { getAllNovels, getNovelByIdOrTitle } from '../../controllers/novels'

chai.use(sinonChai)

describe('Controllers - novels', () => {
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

    stubbedFindAll = sandbox.stub(models.Novels, 'findAll')
    stubbedFindOne = sandbox.stub(models.Novels, 'findOne')

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

  describe('getAllNovels', () => {
    it('retrieves a list of novels from the database and calls response.send() with the list', async () => {
      stubbedFindAll.returns(novelList)

      await getAllNovels({}, response)

      expect(stubbedFindAll).to.have.been.calledWith({
        include: [{ model: models.Authors }, { model: models.Genres }],
      })
      expect(stubbedSend).to.have.been.calledWith(novelList)
    })
  })

  describe('getNovelByIdOrTitle', () => {
    it('retrieves the novel associated with the provided ID, from the database and calls response.send with it', async () => {
      stubbedFindOne.returns(singleNovel)
      const request = {
        params: {
          identifier: 'drac',
        },
      }

      await getNovelByIdOrTitle(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({
        where: {
          [models.Sequelize.Op.or]: [
            { id: 'drac' },
            { title: { [models.Sequelize.Op.like]: '%drac%' } },
          ],
        },
        include: [{ model: models.Authors }, { model: models.Genres }],
      })
      expect(stubbedSend).to.have.been.calledWith(singleNovel)
    })

    it('retrieves the novel associated with the provided ID, from the database and calls response.send with it', async () => {
      stubbedFindOne.returns(singleNovel)
      const request = {
        params: {
          identifier: 2,
        },
      }

      await getNovelByIdOrTitle(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({
        where: {
          [models.Sequelize.Op.or]: [
            { id: 2 },
            { title: { [models.Sequelize.Op.like]: '%2%' } },
          ],
        },
        include: [{ model: models.Authors }, { model: models.Genres }],
      })
      expect(stubbedSend).to.have.been.calledWith(singleNovel)
    })

    it('returns a 404 when no novel is found', async () => {
      stubbedFindOne.returns(null)
      const request = { params: { identifier: 'not-found' } }

      await getNovelByIdOrTitle(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({
        where: {
          [models.Sequelize.Op.or]: [
            { id: 'not-found' },
            { title: { [models.Sequelize.Op.like]: '%not-found%' } },
          ],
        },
        include: [{ model: models.Authors }, { model: models.Genres }],
      })
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })
  })
})
