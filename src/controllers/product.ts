import { Request, Response } from "express";
import { createProduct, deleteProductById, getProductById, getProducts, updateProductById } from "../models/Product";
import logger from "../utils/logger";
import { getFileStream, uploadImage } from "../utils/s3";
import { getUserBySessionToken } from "../models/User";
import { unlinkFile } from "../utils/unlinkFile";

export const create = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      url,
      price,
      imageUrl
    } = req.body;
    const sessionToken = req.cookies["FASHIONSOCIAL-AUTH"];
    const user = await getUserBySessionToken(sessionToken);


    if (!user || !title || !description || !url || !price) {
      return res.sendStatus(400);
    }

    const formattedUrl = (url.startsWith("http://") || url.startsWith("https://")) ? url : `https://${url}`;

    const product = await createProduct({
      userId: user?._id,
      title,
      description,
      url: formattedUrl,
      imageUrl,
      price
    });

    user.products.push(product._id);
    await user.save();

    return res.status(200).json({
      "result": "Product was successfully created!",
      "productId": product._id
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.sendStatus(400);
    }

    const product = await getProductById(productId);

    return res.status(200).json({
      "result": "Product was successfully created!",
      "product": product
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
  }
}

export const getAllProducts = async (req: Request, res: Response) => {
  try {

    const products = await getProducts();

    res.status(200).json({
      result: "Successfully fetched all products!",
      data: products
    })
    
  } catch (error) {
    logger.log('error', error);
    res.sendStatus(400);
  }
}

export const edit = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const {
      title,
      description,
      url,
      imageUrl,
      price,
    } = req.body;

    if (!title || !description || !url || !imageUrl || !price || !productId) {
      return res.sendStatus(400);
    }

    const product = await getProductById(productId);
    if (!product) return res.sendStatus(400);

    await updateProductById(productId, {
      title,
      description,
      url,
      imageUrl,
      price
    });

    return res.status(200).json({
      "result": "Product was successfully updated!",
      "productId": product._id
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    if (!productId) return res.sendStatus(400);

    const product = await getProductById(productId);
    if (!product) return res.sendStatus(400);

    await deleteProductById(productId);

    return res.status(200).json({
      "result": "Product was successfully deleted!",
      "productId": product._id
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
  }
}

export const readImage = async (req: Request, res: Response) => {
  try {
    const key = req.params.imageKey;
    const readStream = getFileStream(key);
    
    readStream.pipe(res);
  } catch (error) {
    logger.log('error', error);
    res.sendStatus(400);
  }
}

export const upload = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    let imageUrl;

    if (file) {
      const result = await uploadImage(file);
      imageUrl = `/images/${result.Key}`

      await unlinkFile(file?.path);
    }

    return res.status(200).json({
      result: "Photo was uploaded successfully!",
      imageUrl
    })
    
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400);
  }
}