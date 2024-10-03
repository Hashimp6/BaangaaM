const shopModel = require("../models/shopModel");
const bcrypt = require("bcrypt");
const formidable = require("formidable");
const cloudinary = require("../config/cloudinary");
const { generateToken } = require("../utils/generateJwt");
const path = require("path");

const salt = 10;

// Function to hash the password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, salt);
};

const registerStore = async (req, res) => {
  try {
    const { name,  email, password } = req.body;

    // Check if the user already exists
    const existingStore = await shopModel.findOne({ email: email });

    if (existingStore) {
      return res.json({
        success: false,
        message: " email already registered for another store",
      });
    }
    const hashedPassword = await hashPassword(password);
    const newShop = new shopModel({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await newShop.save();

    return res
      .status(201)
      .json({ success: true, message: "New shop created successfully" });
  } catch (error) {
    console.error("Error registering store:", error);
    return res.json({ success: false, message: "couldnt create a store" });
  }
};

const loginStore = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const findShop = await shopModel.findOne({ email: email });
    if (findShop) {
      const isMatch = await bcrypt.compare(password, findShop.password);
      if (isMatch) {
        const token = generateToken(findShop);
        return res.json({
          success: true,
          message: "Admin Login successfull",
          user: findShop,
          token: token,
        });
      } else {
        return res.json({ success: false, message: "Incorrect password" });
      }
    } else {
      return res.json({ success: false, message: "shop is not found" });
    }
  } catch (error) {
    console.error("Error logging in store:", error);
    return res.json({ message: "Internal server error" });
  }
};

const updateStore = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "temp"); // Set the temp directory for uploaded files
    form.keepExtensions = true;

    form.parse(req, async (err, fields) => {
      if (err) {
        return res.status(400).json({ error: "Error parsing form data" });
      }

      const parsedFields = Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [key, value[0]])
      );
      const {
        storeEmail,
        shopId,
        shopName,
        location,
        address,
        phoneNumber,
        whatsapp,
        instagram,
        facebook,
        cashOnDelivery,
        deliveryAvailable,
        category,
        logoURL,
        bannerURL,
      } = parsedFields;


      const uploadPromises = [];

      // Prepare upload promises
      if (logoURL) {
        uploadPromises.push(
          cloudinary.uploader
            .upload(logoURL, {
              folder: "stores/logos", // Optional: Specify a folder in Cloudinary
            })
            .then((result) => result.secure_url)
            .catch(err => console.error("Error uploading logo:", err))
        );
      }

      if (bannerURL) {
        uploadPromises.push(
          cloudinary.uploader
            .upload(bannerURL, {
              folder: "stores/banners", // Optional: Specify a folder in Cloudinary
            })
            .then((result) => result.secure_url)
            .catch(err => console.error("Error uploading banner:", err))
        );
      }

      // Wait for all uploads to complete
      const [logoUrl, bannerUrl] = await Promise.all(uploadPromises);
      console.log(logoUrl,bannerUrl);
console.log(shopName);

      const updatedStore = await shopModel.findOneAndUpdate({ email:storeEmail },  {
        shopName: shopName,
        location,
        address,
        category,
        logo: logoUrl, 
        banner: bannerUrl, 
        features: [cashOnDelivery, deliveryAvailable].filter(Boolean),
        contact: {
          phone: phoneNumber || '', 
          whatsapp: whatsapp || '', 
          instagram: instagram || '',
        },
      },
      { new: true }
    );

      if (!updatedStore) {
        console.log('not found');
        return res.json({ message: "Store not found" });
      }
      else{
        console.log('got it'); return res.json({ message:"store details updated" });
    }

        });
  } catch (error) {
    console.log("error for updating store details", error);
  }
};

module.exports = { registerStore, loginStore, updateStore };
