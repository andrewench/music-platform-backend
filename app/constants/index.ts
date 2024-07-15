const Constants = {
  Tokens: {
    ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
    ACCESS_TOKEN_LIFE_TIME: 60 * 1,
    ACCESS_TOKEN_PREFIX: 'at',

    REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_LIFE_TIME: 60 * 5,
    REFRESH_TOKEN_PREFIX: 'rt',
  },

  STATIC_PATH: '/uploads/images',
}

export default Constants
