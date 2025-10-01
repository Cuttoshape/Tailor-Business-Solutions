import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Product, ProductCategory } from '../models';
import { Op } from 'sequelize';

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, search, page = 1, limit = 10, isActive } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { rows: products, count } = await Product.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['name', 'ASC']]
    });

    res.json({
      products,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      category,
      description,
      basePrice,
      materialCost,
      laborCost,
      imageUrl
    } = req.body;

    const product = await Product.create({
      name,
      category,
      description,
      basePrice,
      materialCost: materialCost || 0,
      laborCost: laborCost || 0,
      imageUrl
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      description,
      basePrice,
      materialCost,
      laborCost,
      imageUrl,
      isActive
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    await product.update({
      name,
      category,
      description,
      basePrice,
      materialCost,
      laborCost,
      imageUrl,
      isActive
    });

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    await product.destroy();

    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = Object.values(ProductCategory);
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
