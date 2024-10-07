import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CardMedia,
  IconButton,
  Stack,
  Rating,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import RightDrawer from "./MessageDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartFailure,
  addToCartSuccess,
} from "../redux/slices/cart/cartSlice";

function MiddleProducts() {
  const [products, setProducts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();

  const selectedShop = useSelector((state) => state.store.selectedShop);
  const userInfo = useSelector((state) => state.user?.userInfo);
  const userId = userInfo ? userInfo.user._id : null;
  console.log("user Id from middle product", userId);

  useEffect(() => {
    if (selectedShop?.email) {
      const email = selectedShop.email;
      axios
        .get(`http://localhost:3200/product/allProducts/${email}`, {
          withCredentials: true,
        })
        .then((response) => {
          setProducts(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
  }, [selectedShop]);
  const handleAddToCart = async (product) => {
    try {
      console.log("user is is s", userId, product);
      const response = await axios.post(
        "http://localhost:3200/product/addtocart",
        {
          userId: userId,
          productId: product._id,
          productName: product.product_name,
          productPrice: product.offerPrice,
          productImage: product.image,
          quantity: 1,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addToCartSuccess(response.data));
      console.log(response.data);
    } catch (error) {
      dispatch(addToCartFailure(error.message));
      console.error("Error adding to cart:", error);
    }
  };

  const handleMessageClick = (product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const handleFavoriteToggle = async (productId) => {
    try {
      const updatedProducts = products.map((product) =>
        product._id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      );
      setProducts(updatedProducts);

      const product = products.find((p) => p._id === productId);
      if (product.isFavorite) {
        await axios.post(
          "http://localhost:3200/product/remove-from-favorite",
          {
            productId: productId,
          },
          {
            withCredentials: true,
          }
        );
      } else {
        await axios.post(
          "http://localhost:3200/product/add-to-favorite",
          {
            productId: productId,
          },
          {
            withCredentials: true,
          }
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert the optimistic update if the API call fails
      const revertedProducts = products.map((product) =>
        product._id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      );
      setProducts(revertedProducts);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        width: {
          xs: "100vw",
          md: "80vw",
        },
        height: "90vh",
        backgroundColor: "teal",
        display: "flex",
        flexDirection: "column",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Box
        sx={{
          height: "15vh",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: "bold" }}>
          {selectedShop?.shopName || "Shop Name"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#fff", marginTop: 1 }}>
          {selectedShop?.address || "Shop Location"}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderTopLeftRadius: "22vw",
          borderLeft: "2px solid teal",
          p: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: 2,
            color: "#333",
          }}
        >
          Products
        </Typography>
        <Grid container spacing={3}>
          {products.length > 0 ? (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card
                  sx={{
                    width: "100%",
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "translateY(-7px)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.image}
                    alt={product.product_name}
                    sx={{ objectFit: "cover" }}
                  />
                  <IconButton
                    onClick={() => handleFavoriteToggle(product._id)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                  >
                    {product.isFavorite ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon color="error" />
                    )}
                  </IconButton>
                  <CardContent sx={{ padding: "10px", paddingBottom: "2px" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >
                      {product.product_name}
                    </Typography>
                    <Rating value={product.rating || 4} readOnly size="small" />
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack direction="row" spacing={1} alignItems="baseline">
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold", color: "primary.main" }}
                        >
                          Rs: {product.offerPrice}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            textDecoration: "line-through",
                            color: "text.secondary",
                          }}
                        >
                          Rs: {product.originalPrice}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleMessageClick(product)}
                          sx={{
                            backgroundColor: "green",
                            color: "white",
                            "&:hover": { backgroundColor: "darkgreen" },
                            width: 32,
                            height: 32,
                          }}
                        >
                          <ChatIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleAddToCart(product)}
                          size="small"
                          sx={{
                            backgroundColor: "teal",
                            color: "white",
                            "&:hover": { backgroundColor: "darkcyan" },
                            width: 32,
                            height: 32,
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography>No products found.</Typography>
            </Grid>
          )}
        </Grid>
        <RightDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          storeId={selectedShop?._id}
          storeName={selectedShop?.shopName}
          showchat={true}
          isAdmin={false}
          productDetails={
            selectedProduct && {
              image: selectedProduct.image,
              name: selectedProduct.product_name,
              price: selectedProduct.offerPrice,
            }
          }
        />
      </Box>
    </Box>
  );
}

export default MiddleProducts;
