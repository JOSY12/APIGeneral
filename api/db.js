import { Sequelize } from 'sequelize'
import pg from 'pg'
import 'dotenv/config'

const URLBASEDEDATOS =
  process.env.NODE_ENV === 'NODE'
    ? process.env.URL_BASEDEDATOS_NODE
    : process.env.URL_BASEDEDATOS_DOCKER

export const basedatos = new Sequelize(`${URLBASEDEDATOS}`, {
  dialectModule: pg,
  dialect: 'postgres'
})
