import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const prisma = new PrismaClient();

async function checkValidation(email, mobile) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const mobileRegex = /^[6-9]\d{9}$/;

  const notValidEmail = emailRegex.test(email);
  const notValidMobile = mobileRegex.test(mobile);

  return {
    validateEmail: !notValidEmail,
    validateMobile: !notValidMobile,
  };
}

async function doesUserExist(email, mobile) {
  const userWithEmail = await prisma.user.findUnique({
    where: { email },
  });

  const userWithMobile = await prisma.user.findUnique({
    where: { mobile },
  });

  return {
    existsWithEmail: !!userWithEmail,
    existsWithMobile: !!userWithMobile,
  };
}

async function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      mobile: user.mobile,
      fullName: user.fullName,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      avatar: user.avatar,
      backgroundImage: user.backgroundImage,
      dob: user.dob,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
}

// Create user
const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, password, isAdmin } = req.body;

  // Validate input
  if (!fullName || !email || !mobile || !password) {
    return res
      .status(200)
      .json(
        new ApiError(
          200,
          "",
          `${
            !fullName
              ? "Fullname"
              : !email
              ? "Email"
              : !mobile
              ? "Mobile Number"
              : !password
              ? "Password"
              : ""
          } is required`
        )
      );
  }

  // Check validations
  const validate = await checkValidation(email, mobile);

  if (validate.validateEmail) {
    return res.status(200).json(new ApiError(200, "", "Email ID is not valid"));
  }

  if (validate.validateMobile) {
    return res
      .status(200)
      .json(new ApiError(200, "", "Mobile Number is not valid"));
  }

  // Check if the user with the same email already exists
  const existingUser = await doesUserExist(email, mobile);

  if (existingUser.existsWithEmail) {
    return res
      .status(200)
      .json(new ApiError(200, "", "User with this email already exists"));
  }

  if (existingUser.existsWithMobile) {
    return res
      .status(200)
      .json(new ApiError(200, "", "User with this mobile already exists"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = await prisma.user.create({
    data: {
      fullName,
      email,
      mobile,
      password: hashedPassword,
      isAdmin: isAdmin,
    },
  });

  //   const createdUser = await prisma.user.findUnique(newUser.id).select(
  //     "-password -refreshToken"
  //   );

  if (!newUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, newUser, "User registered Successfully"));
});

// User Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(200).json({ error: "Email and Password are required" });
  }

  // check existing user
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(200).json(new ApiError(404, "", "User does not exist"));
  }

  const checkPassword = await bcrypt.compare(password, user?.password);

  if (!(user && checkPassword)) {
    return res
      .status(200)
      .json(new ApiError(200, "", "Password entered is not valid"));
  }

  const sanitizedUser = {
    id: user.id,
    email: user.email,
    token: await generateAccessToken(user),
  };

  if (user && checkPassword) {
    return res
      .status(200)
      .json(new ApiResponse(200, sanitizedUser, "User loggedin successfully"));
  }
});

export { createUser, loginUser };
