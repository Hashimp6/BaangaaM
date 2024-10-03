const Cart = require('../models/addToCartModel');

// POST /cart/add
const addToCart = async (req, res) => {
  const { userId, productId, productName, productPrice,productImage, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, productName, productPrice,productImage, quantity });
      }
    } else {
      cart = new Cart({
        userId,
        products: [{ productId, productName, productPrice,productImage, quantity }],
      });
    }

    await cart.save();
    return res.json(cart);
  } catch (error) {
    console.error(error);
    return res.json({ message: 'Server error' });
  }
};

const allCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the cart of the given user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({ message: 'Cart not found for this user' });
    }

    console.log("cartsssu", cart);

    // Map the products to include name, price, quantity, and total price
    const products = cart.products.map(item => ({
      productId: item.productId,
      name: item.productName,
      price: item.productPrice,
      quantity: item.quantity,
      image:item.productImage,
      totalPrice: item.productPrice * item.quantity
    }));

    console.log("product cart is", products);
    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateCartItem = async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
  
    try {
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found for this user' });
      }
  
      const itemIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );
  
      if (itemIndex > -1) {
        cart.products[itemIndex].quantity = quantity;
      } else {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
  
      await cart.save();
      return res.json(cart);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  // DELETE /cart/remove/:userId/:productId
  const removeFromCart = async (req, res) => {
    const { userId, productId } = req.params;
  
    try {
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found for this user' });
      }
  
      cart.products = cart.products.filter(
        (product) => product.productId.toString() !== productId
      );
  
      await cart.save();
      return res.json(cart);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = { addToCart, allCart,updateCartItem,removeFromCart };