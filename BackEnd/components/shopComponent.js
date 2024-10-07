const shopModel = require("../models/shopModel");
const bcrypt = require("bcrypt");
const formidable = require('formidable');
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
        return  res.cookie('token', token, {
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, 
        }).json({
          success: true,
          message: "shop Login successfull",
          shop: findShop,
          role:"shop",
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
    form.uploadDir = path.join(__dirname, "temp");
    form.keepExtensions = true;

    form.parse(req, async (err, fields) => {
      if (err) {
        return res.json({ error: "Error parsing form data" });
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
        GeoLocationLat,
        GeoLocationLng
      } = parsedFields;
const GeolocationLatitude=parseFloat(GeoLocationLat)
const GeolocationLongitude=parseFloat(GeoLocationLng)
console.log(GeoLocationLat);
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
        Geolocation: {
          type: "Point",
          coordinates: [GeolocationLongitude,GeolocationLatitude]
        },
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

// function for finding nearest stores
async function findNearestShops(latitude, longitude, maxDistanceKm = 10) {
  try {
    const shops = await shopModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          distanceField: "distance",
          maxDistance: maxDistanceKm * 1000,
          spherical: true,
          query: { Geolocation: { $exists: true } }
        },
      },
      {
        $sort: { distance: 1 },
      },
    ]);

    return shops.map(shop => ({
      shop
    }));
  } catch (error) {
    console.error('Error finding nearest shops:', error);
    throw error;
  }
}

// finding nearest stores

const nearestStore = async (req, res) => {
  
  try {
    const { lat, lng } = req.body;
    console.log(lat,lng
      
    );
    
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
    }

    const nearestShops = await findNearestShops(lat, lng);
    console.log(nearestShops);
    if (nearestShops && nearestShops.length > 0) {
      
      return res.json({ success: true, data: nearestShops });
    } else {
      return res.json({ success: false, message: "No stores found" });
    }
  } catch (error) {
    console.error('Error in nearestStore:', error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const findAllStores=async(req,res)=>{
  try {
    const response= await shopModel.find()
    if(response)
    {
      console.log(response);
      return res.json({success:true,data:response})
    }
    else{
      return res.json({success:false,message:"couldnt find stores"})
    }
  } catch (error) {
    console.log(error);
    return res.json({success:false,message:"couldnt find stores"})
  }
}
const deleteStores = async (req, res) => {
  console.log("is in delete back");
  try {
    const { id } = req.params; 

    
    const deletedStore = await shopModel.findByIdAndDelete(id);

    if (!deletedStore) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    res.json({ success: true, message: "Store deleted successfully" });
  } catch (error) {
    console.error("Error deleting store:", error);
    res.status(500).json({ success: false, message: "Error deleting store", error: error.message });
  }
};




module.exports = { registerStore, loginStore, updateStore, nearestStore ,findAllStores,deleteStores};
