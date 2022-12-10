/* eslint-disable object-curly-newline */
/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
const path = require('path');
const { QueryTypes } = require('sequelize');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const {
  Sequelize,
  Heroes,
  HeroesRoleLists,
  sequelize,
  HeroesRoles,
} = require('../models');
const { deleteFile } = require('../utils/file');
const { createSuccessResponse } = require('../utils/response');

exports.findAll = async (req, res, next) => {
  try {
    // eslint-disable-next-line object-curly-newline
    const { limit = 0, offset, name, heroes_role_id } = req.query;

    const params = {};
    if (offset) params.offset = (+offset - 1) * limit;
    if (limit) params.limit = limit;

    if (name) {
      params.where = {
        ...params.where,
        name: { [Sequelize.Op.like]: `%${name}%` },
      };
    }
    const paramsHeroesRole = {};
    if (heroes_role_id) {
      paramsHeroesRole.id = {
        [Sequelize.Op.eq]: heroes_role_id,
      };
    }
    const data = await Heroes.findAll({
      ...params,
      include: [{ model: HeroesRoles, where: paramsHeroesRole }],
    });
    const response = {
      status: 'success',
      message: 'Success get heroes',
      data,
    };

    delete params.limit;
    delete params.offset;
    if (limit) {
      const where = [];
      if (name) {
        where.push(`h.name ILIKE %${name}%`);
      }
      if (heroes_role_id) {
        where.push(`hrl.heroes_role_id = ${heroes_role_id}`);
      }
      const totalItems = await sequelize.query(
        `
          SELECT COUNT(h.id) as total
          FROM heroes h
          LEFT JOIN heroes_role_lists hrl ON hrl.hero_id = h.id
          ${where.length > 0 ? `WHERE ${where.join('AND ')}` : ''}
      `,
        { type: QueryTypes.SELECT },
      );

      const page = {
        totalItems: totalItems[0]?.total || 0,
        limit: +limit,
        page: +offset,
      };
      response.page = page;
    }
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  let iconUrl = null;
  let bannerUrl = null;
  try {
    iconUrl = req.files?.icon[0].filename;
    if (!iconUrl) {
      throw new InvariantError('Icon is required!');
    }
    bannerUrl = req.files?.banner[0].filename;
    if (!bannerUrl) {
      throw new InvariantError('Banner is required');
    }
    const { heroes_role_id: heroesRoleId } = req.body;

    const params = {
      name: req.body.name,
      icon_url: iconUrl,
      banner_url: bannerUrl,
    };

    const t = await sequelize.transaction();
    try {
      const heroes = await Heroes.create(params, { transaction: t });
      await HeroesRoleLists.bulkCreate(
        heroesRoleId.map(
          (roleId) => ({
            heroesRoleId: roleId,
            heroId: heroes.dataValues.id,
          }),
          { transaction: t },
        ),
      );

      await t.commit();

      return createSuccessResponse(res, 'Success create heroes', heroes, 201);
    } catch (error) {
      await t.rollback();
      throw new Error('Something went wrong');
    }
  } catch (error) {
    if (bannerUrl) {
      deleteFile(bannerUrl);
    }
    if (iconUrl) {
      deleteFile(iconUrl);
    }
    return next(error);
  }
};

exports.findById = async (req, res, next) => {
  const { id } = req.params;

  const heroes = await Heroes.findOne({ where: { id }, include: HeroesRoles });

  if (!heroes) {
    return next(new NotFoundError());
  }
  return createSuccessResponse(res, 'Success get heroes', heroes);
};

exports.update = async (req, res, next) => {
  let iconUrl = null;
  let bannerUrl = null;
  try {
    const { id } = req.params;

    const heroes = await Heroes.findByPk(id);
    if (!heroes) {
      throw new NotFoundError();
    }
    const params = {
      heroes_role_id: req.body.heroes_role_id,
      name: req.body.name,
    };
    iconUrl = req.files?.icon ? req.files?.icon[0]?.filename : null;
    if (iconUrl) {
      params.icon_url = iconUrl;
    }
    bannerUrl = req.files?.banner ? req.files?.banner[0]?.filename : null;
    if (bannerUrl) {
      params.banner_url = bannerUrl;
    }
    const { heroes_role_id: heroesRoleId } = req.body;

    if (req.files[0]?.icon) {
      iconUrl = heroes.icon_url;
    }
    if (req.files[0]?.banner) {
      bannerUrl = heroes.banner_url;
    }

    const t = await sequelize.transaction();
    try {
      await Heroes.update(params, { where: { id } }, { transaction: t });
      await HeroesRoleLists.destroy(
        { where: { hero_id: id } },
        { transaction: t },
      );
      const lists = heroesRoleId.map((roleId) => ({
        heroesRoleId: roleId,
        heroId: +id,
      }));
      await HeroesRoleLists.bulkCreate(lists, { transaction: t });

      await t.commit();

      return createSuccessResponse(res, 'Success update heroes');
    } catch (error) {
      await t.rollback();
      throw new Error('Something went wrong');
    }
  } catch (error) {
    if (iconUrl) {
      deleteFile(iconUrl);
    }
    if (bannerUrl) {
      deleteFile(bannerUrl);
    }
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  const heroes = await Heroes.findByPk(id);
  if (!heroes) {
    return next(new NotFoundError());
  }
  deleteFile(path.join(__dirname, '..', 'uploads', heroes.icon_url));
  deleteFile(path.join(__dirname, '..', 'uploads', heroes.banner_url));
  await Heroes.destroy({ where: { id } });
  return createSuccessResponse(res, 'Success delete heroes');
};
