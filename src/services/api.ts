const BASE_URL = 'https://characteristically-unsecreting-chasity.ngrok-free.dev';;

// Send OTP API
export const sendOtp = async (identifier: string) => {
  const response = await fetch(
    `${BASE_URL}/auth/send-otp`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
      }),
    },
  );

  return response.json();
};

// Verify OTP API
export const verifyOtp = async (
  identifier: string,
  otp: string,
) => {
  const response = await fetch(
    `${BASE_URL}/auth/verify-otp`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        otp,
      }),
    },
  );

  return response.json();
};

// Get User Profile API
export const getUserProfile = async (
  userId: number,
) => {
  const response = await fetch(
    `${BASE_URL}/users/profile/${userId}`,
  );

  return response.json();
};

// Register User API
export const registerUser = async (
  userData: any,
) => {
  const response = await fetch(
    `${BASE_URL}/users/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    },
  );

  return response.json();
};

// Upload Profile Image API
export const uploadProfileImage = async (
  image: any,
) => {
  const formData = new FormData();

  formData.append('file', {
    uri: image.uri,
    type: image.type || 'image/jpeg',
    name: image.fileName || 'profile.jpg',
  } as any);

  const response = await fetch(
    `${BASE_URL}/upload/profile`,
    {
      method: 'POST',
      body: formData,
    },
  );

  return response.json();
};

// Save Horoscope / Birth Details API
export const saveHoroscope = async (
  horoscopeData: any,
) => {
  const response = await fetch(
    `${BASE_URL}/horoscope`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(horoscopeData),
    },
  );

  return response.json();
};

// Get Horoscope API
export const getHoroscope = async (
  horoscopeData: {
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
  },
) => {
  const response = await fetch(
    `${BASE_URL}/horoscope/view`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(horoscopeData),
    },
  );

  return response.json();
};