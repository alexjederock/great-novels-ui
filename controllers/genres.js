import models from '../models'

export const getAllGenres = async (request, response) => {
  const genres = await models.Genres.findAll()

  return response.send(genres)
}

export const getGenreById = async (request, response) => {
  const { id } = request.params

  const genre = await models.Genres.findOne({
    where: { id },
    include: [{
      model: models.Novels,
      include: [{ model: models.Authors }],
    }],
  })

  return genre
    ? response.send(genre)
    : response.sendStatus(404)
}
